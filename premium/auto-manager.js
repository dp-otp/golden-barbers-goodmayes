// ============================================================
// AUTO-MANAGER SYSTEM — Golden Barbers Goodmayes
// Inventory, Reviews, Expenses, Commissions, Client Intelligence
// ============================================================

(function() {
    'use strict';
    var db = firebase.database();
    var AM = window.AutoManager = {};

    // ---- Shared state ----
    var allProducts = [], stockLog = [], reviewQueue = [], reviewSettings = {};
    var recurringExpenses = [], oneoffExpenses = [], generatedExpenses = [];
    var commissionSettings = { defaultRate: 40, staffRates: {} }, commissionAssignments = [];
    var clientProfiles = {}, clientsBuilt = false;
    var amStaffList = []; // populated from main admin staff listener
    var serviceNameMap = {}; // name -> id lookup

    // ---- Sub-tab switching ----
    AM.switchTab = function(tab, btn) {
        document.querySelectorAll('.am-view').forEach(function(v) { v.classList.remove('active'); });
        document.querySelectorAll('.am-tab').forEach(function(b) { b.classList.remove('active'); });
        var el = document.getElementById('am-' + tab);
        if (el) el.classList.add('active');
        if (btn) btn.classList.add('active');
    };

    // ---- Build service name -> id map ----
    function buildServiceMap() {
        db.ref('servicePrices').once('value', function(snap) {
            var data = snap.val();
            if (!data) return;
            ['haircuts', 'beard', 'addons'].forEach(function(cat) {
                if (data[cat]) {
                    data[cat].forEach(function(s) {
                        if (s.name && s.id) serviceNameMap[s.name.toLowerCase()] = s.id;
                        if (s.name) serviceNameMap[s.name.toLowerCase()] = s.id || s.name.toLowerCase().replace(/\s+/g, '-');
                    });
                }
            });
        });
    }

    // ================================================================
    // 1. INVENTORY & STOCK
    // ================================================================

    function loadInventory() {
        db.ref('autoManager/inventory/products').on('value', function(snap) {
            allProducts = [];
            var data = snap.val();
            if (data) {
                Object.keys(data).forEach(function(k) {
                    var p = data[k]; p._key = k; allProducts.push(p);
                });
            }
            renderInventory();
        });

        db.ref('autoManager/inventory/stockLog').orderByChild('timestamp').limitToLast(30).on('value', function(snap) {
            stockLog = [];
            snap.forEach(function(child) {
                var item = child.val(); item._key = child.key; stockLog.push(item);
            });
            stockLog.reverse();
            renderStockLog();
        });
    }

    function renderInventory() {
        var statsEl = document.getElementById('am-inv-stats');
        var gridEl = document.getElementById('am-inv-grid');
        if (!statsEl || !gridEl) return;

        var totalProducts = allProducts.length;
        var lowStock = allProducts.filter(function(p) { return (p.currentStock || 0) <= (p.reorderThreshold || 0); }).length;
        var totalValue = allProducts.reduce(function(sum, p) { return sum + ((p.currentStock || 0) * (p.costPrice || 0)); }, 0);

        statsEl.innerHTML =
            '<div class="am-stat"><div class="am-stat-value">' + totalProducts + '</div><div class="am-stat-label">Products</div></div>' +
            '<div class="am-stat' + (lowStock > 0 ? ' am-stat-red' : '') + '"><div class="am-stat-value">' + lowStock + '</div><div class="am-stat-label">Low Stock</div></div>' +
            '<div class="am-stat"><div class="am-stat-value">£' + totalValue.toFixed(0) + '</div><div class="am-stat-label">Stock Value</div></div>';

        if (allProducts.length === 0) {
            gridEl.innerHTML = '<div class="am-empty">No products yet. Add your first product above.</div>';
            return;
        }

        gridEl.innerHTML = allProducts.map(function(p) {
            var stockClass = (p.currentStock || 0) <= (p.reorderThreshold || 0) ? 'am-stock-low' : (p.currentStock || 0) <= (p.reorderThreshold || 0) * 2 ? 'am-stock-warn' : 'am-stock-ok';
            var linkedStr = (p.linkedServices || []).join(', ') || 'None';
            return '<div class="am-product-card">' +
                '<div class="am-product-header">' +
                    '<div class="am-product-name">' + (p.name || 'Unnamed') + '</div>' +
                    '<button class="am-btn-sm am-btn-danger" onclick="AutoManager.deleteProduct(\'' + p._key + '\')">×</button>' +
                '</div>' +
                '<div class="am-product-stock ' + stockClass + '">' + (p.currentStock || 0) + ' in stock</div>' +
                '<div class="am-product-meta">Reorder at: ' + (p.reorderThreshold || 0) + ' · Cost: £' + (p.costPrice || 0).toFixed(2) + '</div>' +
                '<div class="am-product-meta">Links: ' + linkedStr + '</div>' +
                '<div class="am-product-actions">' +
                    '<button class="am-btn-sm" onclick="AutoManager.adjustStock(\'' + p._key + '\', -1)">− 1</button>' +
                    '<button class="am-btn-sm" onclick="AutoManager.adjustStock(\'' + p._key + '\', 1)">+ 1</button>' +
                    '<button class="am-btn-sm am-btn-green" onclick="AutoManager.restockProduct(\'' + p._key + '\')">Restock</button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function renderStockLog() {
        var el = document.getElementById('am-inv-log');
        if (!el) return;
        if (stockLog.length === 0) {
            el.innerHTML = '<div class="am-empty">No stock movements yet.</div>';
            return;
        }
        el.innerHTML = stockLog.map(function(l) {
            var icon = l.type === 'consumed' ? '📉' : l.type === 'restocked' ? '📦' : '✏️';
            var time = new Date(l.timestamp);
            var timeStr = time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            var qtyStr = l.quantity > 0 ? '+' + l.quantity : '' + l.quantity;
            return '<div class="am-log-item"><span class="am-log-icon">' + icon + '</span><div class="am-log-body"><div class="am-log-text">' + (l.productName || '') + ' <strong>' + qtyStr + '</strong></div><div class="am-log-sub">' + (l.reason || '') + ' · ' + timeStr + '</div></div></div>';
        }).join('');
    }

    AM.addProduct = function() {
        var name = document.getElementById('am-prod-name').value.trim();
        var category = document.getElementById('am-prod-category').value;
        var stock = parseInt(document.getElementById('am-prod-stock').value) || 0;
        var threshold = parseInt(document.getElementById('am-prod-threshold').value) || 3;
        var cost = parseFloat(document.getElementById('am-prod-cost').value) || 0;
        var linkedChecks = document.querySelectorAll('.am-svc-check:checked');
        var linked = [];
        linkedChecks.forEach(function(c) { linked.push(c.value); });
        var usage = parseInt(document.getElementById('am-prod-usage').value) || 1;

        if (!name) { showToast('Enter a product name', 'error'); return; }

        db.ref('autoManager/inventory/products').push({
            name: name, category: category, currentStock: stock, reorderThreshold: threshold,
            costPrice: cost, linkedServices: linked, usagePerService: usage,
            createdAt: new Date().toISOString(), lastRestocked: new Date().toISOString()
        });
        showToast('Product added: ' + name, 'success');
        logActivity('inventory', 'Product added: ' + name);
        document.getElementById('am-prod-name').value = '';
        document.getElementById('am-prod-stock').value = '';
        document.getElementById('am-prod-cost').value = '';
        AM.toggleAddProduct();
    };

    AM.deleteProduct = function(key) {
        if (!confirm('Delete this product?')) return;
        db.ref('autoManager/inventory/products/' + key).remove();
        showToast('Product deleted', 'info');
    };

    AM.adjustStock = function(key, delta) {
        db.ref('autoManager/inventory/products/' + key).once('value', function(snap) {
            var p = snap.val();
            if (!p) return;
            var newStock = Math.max(0, (p.currentStock || 0) + delta);
            db.ref('autoManager/inventory/products/' + key + '/currentStock').set(newStock);
            db.ref('autoManager/inventory/stockLog').push({
                productId: key, productName: p.name, type: 'manual-adjust',
                quantity: delta, reason: 'Manual adjustment',
                timestamp: new Date().toISOString()
            });
            if (newStock <= (p.reorderThreshold || 0)) {
                showToast('Low stock: ' + p.name + ' (' + newStock + ' left)', 'warning');
            }
        });
    };

    AM.restockProduct = function(key) {
        var qty = parseInt(prompt('How many units to add?'));
        if (isNaN(qty) || qty <= 0) return;
        db.ref('autoManager/inventory/products/' + key).once('value', function(snap) {
            var p = snap.val();
            if (!p) return;
            var newStock = (p.currentStock || 0) + qty;
            db.ref('autoManager/inventory/products/' + key).update({
                currentStock: newStock, lastRestocked: new Date().toISOString()
            });
            db.ref('autoManager/inventory/stockLog').push({
                productId: key, productName: p.name, type: 'restocked',
                quantity: qty, reason: 'Manual restock',
                timestamp: new Date().toISOString()
            });
            showToast(p.name + ' restocked: +' + qty, 'success');
            logActivity('inventory', p.name + ' restocked: +' + qty + ' (now ' + newStock + ')');
        });
    };

    AM.toggleAddProduct = function() {
        var form = document.getElementById('am-add-product-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    };

    // Auto-decrement stock on confirmed payment
    AM.autoDecrementStock = function(paymentKey) {
        db.ref('payments/' + paymentKey).once('value', function(snap) {
            var payment = snap.val();
            if (!payment || !payment.items) return;

            db.ref('autoManager/inventory/products').once('value', function(prodSnap) {
                var products = prodSnap.val();
                if (!products) return;

                payment.items.forEach(function(serviceName) {
                    var svcNameLower = serviceName.toLowerCase();
                    Object.keys(products).forEach(function(prodKey) {
                        var prod = products[prodKey];
                        if (!prod.linkedServices || !prod.linkedServices.length) return;

                        var isLinked = prod.linkedServices.some(function(svcId) {
                            return svcNameLower.includes(svcId.replace(/-/g, ' ')) ||
                                   svcId === serviceNameMap[svcNameLower] ||
                                   svcNameLower.includes(svcId);
                        });

                        if (isLinked) {
                            var usage = prod.usagePerService || 1;
                            var newStock = Math.max(0, (prod.currentStock || 0) - usage);
                            db.ref('autoManager/inventory/products/' + prodKey + '/currentStock').set(newStock);
                            db.ref('autoManager/inventory/stockLog').push({
                                productId: prodKey, productName: prod.name, type: 'consumed',
                                quantity: -usage, reason: 'Payment confirmed: ' + serviceName,
                                paymentKey: paymentKey, timestamp: new Date().toISOString()
                            });
                            if (newStock <= (prod.reorderThreshold || 0)) {
                                showToast('⚠ Low stock: ' + prod.name + ' (' + newStock + ' left)', 'warning');
                                logActivity('inventory', 'Low stock alert: ' + prod.name + ' (' + newStock + ' remaining)');
                            }
                        }
                    });
                });
            });
        });
    };


    // ================================================================
    // 2. REVIEW ENGINE
    // ================================================================

    function loadReviews() {
        db.ref('autoManager/reviews/settings').on('value', function(snap) {
            reviewSettings = snap.val() || {};
            renderReviewSettings();
        });
        db.ref('autoManager/reviews/queue').orderByChild('queuedAt').on('value', function(snap) {
            reviewQueue = [];
            snap.forEach(function(child) {
                var item = child.val(); item._key = child.key; reviewQueue.push(item);
            });
            reviewQueue.reverse();
            renderReviewQueue();
        });
    }

    function renderReviewSettings() {
        var el = document.getElementById('am-review-url');
        if (el && !el._loaded) {
            el.value = reviewSettings.googleReviewUrl || '';
            document.getElementById('am-review-template').value = reviewSettings.messageTemplate || 'Hi {name}! Thanks for visiting Golden Barbers. We\'d really appreciate a quick review: {link}';
            document.getElementById('am-review-autotoggle').checked = reviewSettings.autoQueueEnabled !== false;
            document.getElementById('am-review-minspend').value = reviewSettings.minimumSpend || 0;
            el._loaded = true;
        }
    }

    function renderReviewQueue() {
        var statsEl = document.getElementById('am-review-stats');
        var listEl = document.getElementById('am-review-list');
        if (!statsEl || !listEl) return;

        var pending = reviewQueue.filter(function(r) { return r.status === 'pending'; });
        var sent = reviewQueue.filter(function(r) { return r.status === 'sent'; });
        var reviewed = reviewQueue.filter(function(r) { return r.status === 'reviewed'; });

        statsEl.innerHTML =
            '<div class="am-stat"><div class="am-stat-value">' + pending.length + '</div><div class="am-stat-label">Pending</div></div>' +
            '<div class="am-stat am-stat-blue"><div class="am-stat-value">' + sent.length + '</div><div class="am-stat-label">Sent</div></div>' +
            '<div class="am-stat am-stat-green"><div class="am-stat-value">' + reviewed.length + '</div><div class="am-stat-label">Reviewed</div></div>';

        var filterTab = document.querySelector('.am-review-tab.active');
        var filter = filterTab ? filterTab.dataset.filter : 'pending';
        var filtered = filter === 'pending' ? pending : filter === 'sent' ? sent : filter === 'reviewed' ? reviewed : reviewQueue;

        if (filtered.length === 0) {
            listEl.innerHTML = '<div class="am-empty">No ' + filter + ' review requests.</div>';
            return;
        }

        listEl.innerHTML = filtered.map(function(r) {
            var time = new Date(r.queuedAt);
            var timeStr = time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            var hasPhone = r.customerPhone && r.customerPhone.replace(/[^0-9]/g, '').length >= 8;
            var actions = '';
            if (r.status === 'pending') {
                if (hasPhone) {
                    actions = '<button class="am-btn-sm am-btn-green" onclick="AutoManager.sendReview(\'' + r._key + '\')">Send via WhatsApp</button>';
                } else {
                    actions = '<button class="am-btn-sm" onclick="AutoManager.addPhoneToReview(\'' + r._key + '\')">Add Phone</button>';
                }
                actions += ' <button class="am-btn-sm" onclick="AutoManager.skipReview(\'' + r._key + '\')">Skip</button>';
            } else if (r.status === 'sent') {
                actions = '<button class="am-btn-sm am-btn-green" onclick="AutoManager.markReviewed(\'' + r._key + '\')">Mark Reviewed</button>';
            }
            var badge = r.status === 'pending' ? '<span class="am-badge am-badge-orange">Pending</span>' :
                        r.status === 'sent' ? '<span class="am-badge am-badge-blue">Sent</span>' :
                        '<span class="am-badge am-badge-green">Reviewed</span>';
            return '<div class="am-review-item">' +
                '<div class="am-review-info"><strong>' + (r.customerName || 'Walk-in') + '</strong>' + badge + '<br><span class="am-muted">' + (r.service || '') + ' · £' + (r.amount || 0).toFixed(2) + ' · ' + timeStr + '</span>' + (!hasPhone ? '<br><span class="am-muted am-text-orange">No phone number</span>' : '') + '</div>' +
                '<div class="am-review-actions">' + actions + '</div>' +
            '</div>';
        }).join('');
    }

    AM.saveReviewSettings = function() {
        db.ref('autoManager/reviews/settings').set({
            googleReviewUrl: document.getElementById('am-review-url').value.trim(),
            messageTemplate: document.getElementById('am-review-template').value.trim(),
            autoQueueEnabled: document.getElementById('am-review-autotoggle').checked,
            minimumSpend: parseFloat(document.getElementById('am-review-minspend').value) || 0
        });
        showToast('Review settings saved', 'success');
    };

    AM.sendReview = function(queueKey) {
        var item = reviewQueue.find(function(r) { return r._key === queueKey; });
        if (!item || !item.customerPhone) { showToast('No phone number', 'error'); return; }
        var message = (reviewSettings.messageTemplate || 'Thanks for visiting! Please leave a review: {link}')
            .replace('{name}', item.customerName || 'there')
            .replace('{link}', reviewSettings.googleReviewUrl || '');
        var phone = item.customerPhone.replace(/[^0-9]/g, '');
        window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank');
        db.ref('autoManager/reviews/queue/' + queueKey).update({ status: 'sent', sentAt: new Date().toISOString() });
        logActivity('reviews', 'Review request sent to ' + (item.customerName || 'customer'));
        showToast('WhatsApp opened for ' + (item.customerName || 'customer'), 'success');
    };

    AM.skipReview = function(key) { db.ref('autoManager/reviews/queue/' + key).update({ status: 'skipped' }); };
    AM.markReviewed = function(key) { db.ref('autoManager/reviews/queue/' + key).update({ status: 'reviewed', reviewedAt: new Date().toISOString() }); showToast('Marked as reviewed', 'success'); };

    AM.addPhoneToReview = function(key) {
        var phone = prompt('Enter customer phone number:');
        if (!phone) return;
        db.ref('autoManager/reviews/queue/' + key + '/customerPhone').set(phone);
        showToast('Phone added', 'success');
    };

    AM.filterReviews = function(filter, btn) {
        document.querySelectorAll('.am-review-tab').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderReviewQueue();
    };

    // Queue review on payment confirm
    AM.queueReviewRequest = function(paymentKey) {
        db.ref('autoManager/reviews/settings').once('value', function(snap) {
            var settings = snap.val();
            if (!settings || settings.autoQueueEnabled === false || !settings.googleReviewUrl) return;

            db.ref('payments/' + paymentKey).once('value', function(pSnap) {
                var payment = pSnap.val();
                if (!payment || (payment.amount || 0) < (settings.minimumSpend || 0)) return;

                // Try to find customer info from bookings (same day + service match)
                var contactInfo = { name: 'Walk-in', phone: '', email: '' };
                db.ref('bookings').orderByChild('date').equalTo(payment.date || '').once('value', function(bSnap) {
                    bSnap.forEach(function(child) {
                        var b = child.val();
                        if (b.phone && payment.items) {
                            var svcName = b.service ? (b.service.name || b.service) : '';
                            var match = payment.items.some(function(item) {
                                return item.toLowerCase().includes(svcName.toLowerCase()) || svcName.toLowerCase().includes(item.toLowerCase());
                            });
                            if (match || !contactInfo.phone) {
                                contactInfo.name = b.name || contactInfo.name;
                                contactInfo.phone = b.phone || contactInfo.phone;
                                contactInfo.email = b.email || contactInfo.email;
                            }
                        }
                    });

                    // Also check client intelligence
                    if (!contactInfo.phone) {
                        // No match found from bookings — queue without phone
                    }

                    db.ref('autoManager/reviews/queue').push({
                        customerName: contactInfo.name,
                        customerPhone: contactInfo.phone,
                        customerEmail: contactInfo.email,
                        service: payment.items ? payment.items.join(', ') : 'Service',
                        amount: payment.amount || 0,
                        paymentKey: paymentKey,
                        status: 'pending',
                        queuedAt: new Date().toISOString(),
                        sentAt: null, reviewedAt: null
                    });
                });
            });
        });
    };


    // ================================================================
    // 3. EXPENSE & PROFIT TRACKER
    // ================================================================

    var expensePeriod = 'month';

    function loadExpenses() {
        db.ref('autoManager/expenses/recurring').on('value', function(snap) {
            recurringExpenses = [];
            var data = snap.val();
            if (data) Object.keys(data).forEach(function(k) { var e = data[k]; e._key = k; recurringExpenses.push(e); });
            renderExpenses();
        });
        db.ref('autoManager/expenses/oneoff').on('value', function(snap) {
            oneoffExpenses = [];
            var data = snap.val();
            if (data) Object.keys(data).forEach(function(k) { var e = data[k]; e._key = k; oneoffExpenses.push(e); });
            oneoffExpenses.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });
            renderExpenses();
        });
        // Process recurring expenses on load
        processRecurringExpenses();
    }

    function processRecurringExpenses() {
        db.ref('autoManager/expenses/recurring').once('value', function(snap) {
            var recurring = snap.val();
            if (!recurring) return;
            var now = new Date();
            var monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

            Object.keys(recurring).forEach(function(rKey) {
                var r = recurring[rKey];
                if (!r.active) return;
                if (r.frequency === 'monthly') {
                    db.ref('autoManager/expenses/generated/' + monthKey).orderByChild('recurringId').equalTo(rKey).once('value', function(gSnap) {
                        if (!gSnap.exists()) {
                            db.ref('autoManager/expenses/generated/' + monthKey).push({
                                name: r.name, amount: r.amount, category: r.category,
                                date: monthKey + '-' + String(r.dayOfMonth || 1).padStart(2, '0'),
                                recurringId: rKey, auto: true, createdAt: new Date().toISOString()
                            });
                        }
                    });
                }
            });
        });
    }

    function calculateProfit(periodStart, periodEnd) {
        // Revenue from confirmed payments
        var revenue = 0;
        if (window.livePayments) {
            window.livePayments.forEach(function(p) {
                if (p.status === 'confirmed') {
                    var d = new Date(p.createdAt || p.date);
                    if (d >= periodStart && d <= periodEnd) revenue += (p.amount || 0);
                }
            });
        }

        // Expenses
        var expenses = 0;
        oneoffExpenses.forEach(function(e) {
            var d = new Date(e.date);
            if (d >= periodStart && d <= periodEnd) expenses += (e.amount || 0);
        });
        // Generated recurring
        var now = new Date();
        var monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        db.ref('autoManager/expenses/generated/' + monthKey).once('value', function(snap) {
            var data = snap.val();
            if (data) {
                Object.keys(data).forEach(function(k) {
                    var e = data[k];
                    var d = new Date(e.date);
                    if (d >= periodStart && d <= periodEnd) expenses += (e.amount || 0);
                });
            }
            // Commissions in period
            var commTotal = 0;
            commissionAssignments.forEach(function(c) {
                var d = new Date(c.date);
                if (d >= periodStart && d <= periodEnd) commTotal += (c.commission || 0);
            });
            renderProfitCard(revenue, expenses, commTotal);
        });
    }

    function renderProfitCard(revenue, expenses, commissions) {
        var el = document.getElementById('am-profit-hero');
        if (!el) return;
        var totalExpenses = expenses + commissions;
        var profit = revenue - totalExpenses;
        var profitColor = profit >= 0 ? '#22c55e' : '#ef4444';
        el.innerHTML =
            '<div class="am-profit-number" style="color:' + profitColor + '">£' + profit.toFixed(2) + '</div>' +
            '<div class="am-profit-label">Net Profit</div>' +
            '<div class="am-profit-breakdown">' +
                '<span class="am-profit-rev">Revenue: £' + revenue.toFixed(2) + '</span>' +
                '<span class="am-profit-exp">Expenses: −£' + expenses.toFixed(2) + '</span>' +
                '<span class="am-profit-comm">Commissions: −£' + commissions.toFixed(2) + '</span>' +
            '</div>';
    }

    function renderExpenses() {
        // Recurring list
        var recEl = document.getElementById('am-exp-recurring-list');
        if (recEl) {
            if (recurringExpenses.length === 0) {
                recEl.innerHTML = '<div class="am-empty">No recurring expenses. Add rent, utilities, etc.</div>';
            } else {
                var monthlyTotal = recurringExpenses.filter(function(e) { return e.active; }).reduce(function(s, e) { return s + (e.amount || 0); }, 0);
                recEl.innerHTML = recurringExpenses.map(function(e) {
                    return '<div class="am-expense-item">' +
                        '<div class="am-expense-info"><strong>' + e.name + '</strong><br><span class="am-muted">' + (e.category || '') + ' · ' + (e.frequency || 'monthly') + (e.active ? '' : ' · PAUSED') + '</span></div>' +
                        '<div class="am-expense-amount">£' + (e.amount || 0).toFixed(2) + '</div>' +
                        '<div class="am-expense-actions">' +
                            '<button class="am-btn-sm" onclick="AutoManager.toggleRecurring(\'' + e._key + '\',' + !e.active + ')">' + (e.active ? 'Pause' : 'Resume') + '</button>' +
                            '<button class="am-btn-sm am-btn-danger" onclick="AutoManager.deleteRecurring(\'' + e._key + '\')">×</button>' +
                        '</div>' +
                    '</div>';
                }).join('') + '<div class="am-expense-total">Monthly total: £' + monthlyTotal.toFixed(2) + '</div>';
            }
        }

        // One-off list
        var oneEl = document.getElementById('am-exp-oneoff-list');
        if (oneEl) {
            if (oneoffExpenses.length === 0) {
                oneEl.innerHTML = '<div class="am-empty">No one-off expenses logged.</div>';
            } else {
                oneEl.innerHTML = oneoffExpenses.slice(0, 20).map(function(e) {
                    return '<div class="am-expense-item">' +
                        '<div class="am-expense-info"><strong>' + e.name + '</strong><br><span class="am-muted">' + (e.category || '') + ' · ' + (e.date || '') + (e.notes ? ' · ' + e.notes : '') + '</span></div>' +
                        '<div class="am-expense-amount">£' + (e.amount || 0).toFixed(2) + '</div>' +
                        '<button class="am-btn-sm am-btn-danger" onclick="AutoManager.deleteOneoff(\'' + e._key + '\')">×</button>' +
                    '</div>';
                }).join('');
            }
        }

        // Recalculate profit
        var now = new Date();
        var start, end;
        if (expensePeriod === 'week') {
            start = new Date(now); start.setDate(start.getDate() - start.getDay()); start.setHours(0,0,0,0);
            end = new Date(now); end.setHours(23,59,59,999);
        } else if (expensePeriod === 'lastmonth') {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        } else {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now); end.setHours(23,59,59,999);
        }
        calculateProfit(start, end);
    }

    AM.addRecurring = function() {
        var name = document.getElementById('am-rec-name').value.trim();
        var amount = parseFloat(document.getElementById('am-rec-amount').value) || 0;
        var category = document.getElementById('am-rec-category').value;
        var day = parseInt(document.getElementById('am-rec-day').value) || 1;
        if (!name || !amount) { showToast('Enter name and amount', 'error'); return; }
        db.ref('autoManager/expenses/recurring').push({
            name: name, amount: amount, frequency: 'monthly', category: category,
            dayOfMonth: day, active: true, createdAt: new Date().toISOString()
        });
        showToast('Recurring expense added', 'success');
        logActivity('expenses', 'Recurring expense added: ' + name + ' (£' + amount.toFixed(2) + '/month)');
        document.getElementById('am-rec-name').value = '';
        document.getElementById('am-rec-amount').value = '';
    };

    AM.addOneoff = function() {
        var name = document.getElementById('am-one-name').value.trim();
        var amount = parseFloat(document.getElementById('am-one-amount').value) || 0;
        var date = document.getElementById('am-one-date').value;
        var category = document.getElementById('am-one-category').value;
        var notes = document.getElementById('am-one-notes').value.trim();
        if (!name || !amount) { showToast('Enter name and amount', 'error'); return; }
        db.ref('autoManager/expenses/oneoff').push({
            name: name, amount: amount, date: date || new Date().toISOString().split('T')[0],
            category: category, notes: notes, createdAt: new Date().toISOString()
        });
        showToast('Expense logged', 'success');
        logActivity('expenses', 'One-off expense: ' + name + ' (£' + amount.toFixed(2) + ')');
        document.getElementById('am-one-name').value = '';
        document.getElementById('am-one-amount').value = '';
        document.getElementById('am-one-notes').value = '';
    };

    AM.toggleRecurring = function(key, active) { db.ref('autoManager/expenses/recurring/' + key + '/active').set(active); };
    AM.deleteRecurring = function(key) { if (confirm('Delete this recurring expense?')) db.ref('autoManager/expenses/recurring/' + key).remove(); };
    AM.deleteOneoff = function(key) { db.ref('autoManager/expenses/oneoff/' + key).remove(); };

    AM.setExpensePeriod = function(period, btn) {
        expensePeriod = period;
        document.querySelectorAll('.am-period-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderExpenses();
    };

    AM.toggleAddExpenseForm = function(type) {
        var form = document.getElementById('am-add-' + type + '-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    };


    // ================================================================
    // 4. STAFF COMMISSION CALCULATOR
    // ================================================================

    function loadCommissions() {
        db.ref('autoManager/commissions/settings').on('value', function(snap) {
            commissionSettings = snap.val() || { defaultRate: 40, staffRates: {} };
            renderCommissions();
        });
        db.ref('autoManager/commissions/assignments').on('value', function(snap) {
            commissionAssignments = [];
            var data = snap.val();
            if (data) Object.keys(data).forEach(function(k) { var c = data[k]; c._key = k; commissionAssignments.push(c); });
            renderCommissions();
        });
        // Get staff list
        db.ref('staff').on('value', function(snap) {
            amStaffList = [];
            var data = snap.val();
            if (data) Object.keys(data).forEach(function(k) { var s = data[k]; s._key = k; amStaffList.push(s); });
            renderCommissionRates();
        });
    }

    function renderCommissionRates() {
        var el = document.getElementById('am-comm-rates');
        if (!el) return;
        if (amStaffList.length === 0) {
            el.innerHTML = '<div class="am-empty">No staff members. Add staff in the Staff section first.</div>';
            return;
        }
        el.innerHTML = '<div class="am-comm-default">Default rate: <input type="number" class="am-input-sm" value="' + (commissionSettings.defaultRate || 40) + '" onchange="AutoManager.setDefaultRate(this.value)" min="0" max="100">%</div>' +
            amStaffList.map(function(s) {
                var rate = (commissionSettings.staffRates && commissionSettings.staffRates[s._key]) || commissionSettings.defaultRate || 40;
                return '<div class="am-comm-staff-row">' +
                    '<span class="am-comm-staff-name">' + s.name + ' <span class="am-muted">(' + (s.role || 'Barber') + ')</span></span>' +
                    '<input type="number" class="am-input-sm" value="' + rate + '" onchange="AutoManager.setStaffRate(\'' + s._key + '\', this.value)" min="0" max="100">%' +
                '</div>';
            }).join('');
    }

    function renderCommissions() {
        var summaryEl = document.getElementById('am-comm-summary');
        if (!summaryEl) return;

        // Current month assignments
        var now = new Date();
        var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        var monthAssignments = commissionAssignments.filter(function(c) {
            return new Date(c.date) >= monthStart;
        });

        // Per-barber breakdown
        var byBarber = {};
        monthAssignments.forEach(function(c) {
            if (!byBarber[c.staffName]) byBarber[c.staffName] = { services: 0, revenue: 0, commission: 0 };
            byBarber[c.staffName].services++;
            byBarber[c.staffName].revenue += (c.amount || 0);
            byBarber[c.staffName].commission += (c.commission || 0);
        });

        var totalComm = monthAssignments.reduce(function(s, c) { return s + (c.commission || 0); }, 0);
        var unassigned = 0;
        if (window.livePayments) {
            var assignedKeys = {};
            commissionAssignments.forEach(function(c) { assignedKeys[c.paymentKey || c._key] = true; });
            window.livePayments.forEach(function(p) {
                if (p.status === 'confirmed' && new Date(p.createdAt || p.date) >= monthStart && !assignedKeys[p._key]) unassigned++;
            });
        }

        var html = '';
        if (unassigned > 0) {
            html += '<div class="am-needs-banner" style="border-color:rgba(212,175,55,0.3);background:rgba(212,175,55,0.06);color:#d4af37;"><strong>' + unassigned + ' unassigned payment' + (unassigned > 1 ? 's' : '') + '</strong> — assign barbers below or via the payment feed</div>';
        }

        var barberNames = Object.keys(byBarber);
        if (barberNames.length === 0) {
            html += '<div class="am-empty">No commissions this month yet.</div>';
        } else {
            html += barberNames.map(function(name) {
                var b = byBarber[name];
                return '<div class="am-comm-row">' +
                    '<div class="am-comm-name">' + name + '</div>' +
                    '<div class="am-muted">' + b.services + ' services · £' + b.revenue.toFixed(2) + ' revenue</div>' +
                    '<div class="am-comm-earned">£' + b.commission.toFixed(2) + '</div>' +
                '</div>';
            }).join('');
            html += '<div class="am-expense-total">Total commissions this month: £' + totalComm.toFixed(2) + '</div>';
        }
        summaryEl.innerHTML = html;
    }

    AM.setDefaultRate = function(val) {
        commissionSettings.defaultRate = parseInt(val) || 40;
        db.ref('autoManager/commissions/settings/defaultRate').set(commissionSettings.defaultRate);
    };

    AM.setStaffRate = function(staffKey, val) {
        db.ref('autoManager/commissions/settings/staffRates/' + staffKey).set(parseInt(val) || 40);
    };

    AM.autoAssignCommission = function(paymentKey) {
        db.ref('payments/' + paymentKey).once('value', function(snap) {
            var payment = snap.val();
            if (!payment) return;

            // Check if already assigned
            db.ref('autoManager/commissions/assignments/' + paymentKey).once('value', function(aSnap) {
                if (aSnap.exists()) return;

                // Try to match with booking
                db.ref('bookings').orderByChild('date').equalTo(payment.date || '').once('value', function(bSnap) {
                    var matchedBarber = null;
                    bSnap.forEach(function(child) {
                        var b = child.val();
                        if (b.barber && b.barber.name && b.barber.id !== 'any') {
                            if (payment.items) {
                                var svcName = b.service ? (b.service.name || '') : '';
                                var match = payment.items.some(function(item) {
                                    return item.toLowerCase().includes(svcName.toLowerCase()) || svcName.toLowerCase().includes(item.toLowerCase());
                                });
                                if (match) matchedBarber = b.barber;
                            }
                        }
                    });

                    if (matchedBarber) {
                        // Find staff key
                        var staffMatch = amStaffList.find(function(s) {
                            return s.name.toLowerCase() === matchedBarber.name.toLowerCase();
                        });
                        if (staffMatch) {
                            var rate = (commissionSettings.staffRates && commissionSettings.staffRates[staffMatch._key]) || commissionSettings.defaultRate || 40;
                            var commission = (payment.amount || 0) * (rate / 100);
                            db.ref('autoManager/commissions/assignments/' + paymentKey).set({
                                staffKey: staffMatch._key, staffName: staffMatch.name,
                                paymentKey: paymentKey, amount: payment.amount || 0,
                                commission: Math.round(commission * 100) / 100, rate: rate,
                                date: payment.date, service: payment.items ? payment.items.join(', ') : 'Service',
                                createdAt: new Date().toISOString()
                            });
                            logActivity('commissions', staffMatch.name + ' earned £' + commission.toFixed(2) + ' commission on £' + (payment.amount || 0).toFixed(2));
                        }
                    }
                });
            });
        });
    };

    AM.manualAssign = function(paymentKey, amount, service) {
        if (amStaffList.length === 0) { showToast('No staff members configured', 'error'); return; }
        var names = amStaffList.map(function(s) { return s.name; }).join(', ');
        var name = prompt('Assign barber (' + names + '):');
        if (!name) return;
        var staffMatch = amStaffList.find(function(s) { return s.name.toLowerCase() === name.toLowerCase(); });
        if (!staffMatch) { showToast('Staff member not found', 'error'); return; }
        var rate = (commissionSettings.staffRates && commissionSettings.staffRates[staffMatch._key]) || commissionSettings.defaultRate || 40;
        var commission = (amount || 0) * (rate / 100);
        db.ref('autoManager/commissions/assignments/' + paymentKey).set({
            staffKey: staffMatch._key, staffName: staffMatch.name,
            paymentKey: paymentKey, amount: amount || 0,
            commission: Math.round(commission * 100) / 100, rate: rate,
            date: new Date().toISOString().split('T')[0], service: service || 'Service',
            createdAt: new Date().toISOString()
        });
        showToast(staffMatch.name + ' assigned (£' + commission.toFixed(2) + ' commission)', 'success');
    };


    // ================================================================
    // 5. CLIENT INTELLIGENCE
    // ================================================================

    function loadClients() {
        db.ref('autoManager/clients').on('value', function(snap) {
            clientProfiles = snap.val() || {};
            renderClients();
        });

        // Check if initial build needed
        db.ref('autoManager/meta/clientsBuilt').once('value', function(snap) {
            if (!snap.exists()) {
                rebuildClientIntelligence();
            }
        });
    }

    function rebuildClientIntelligence() {
        db.ref('bookings').once('value', function(bSnap) {
            var bookings = bSnap.val();
            if (!bookings) { db.ref('autoManager/meta/clientsBuilt').set(true); return; }

            var clients = {};
            Object.keys(bookings).forEach(function(bKey) {
                var b = bookings[bKey];
                if (!b.phone) return;
                var normPhone = b.phone.replace(/[^0-9]/g, '');
                if (normPhone.length < 8) return;

                if (!clients[normPhone]) {
                    clients[normPhone] = {
                        name: b.name || 'Unknown', phone: b.phone, email: b.email || '',
                        firstVisit: b.date || b.createdAt, lastVisit: b.date || b.createdAt,
                        totalVisits: 0, totalSpend: 0, services: {}, barbers: {},
                        updatedAt: new Date().toISOString()
                    };
                }
                var c = clients[normPhone];
                c.name = b.name || c.name;
                c.email = b.email || c.email;
                c.totalVisits++;
                var svcName = b.service ? (b.service.name || b.service) : null;
                if (svcName) c.services[svcName] = (c.services[svcName] || 0) + 1;
                var barberName = b.barber ? (b.barber.name || b.barber) : null;
                if (barberName && barberName !== 'Any Available Barber') c.barbers[barberName] = (c.barbers[barberName] || 0) + 1;
                var visitDate = b.date || b.createdAt;
                if (visitDate < c.firstVisit) c.firstVisit = visitDate;
                if (visitDate > c.lastVisit) c.lastVisit = visitDate;
                if (b.service && b.service.price) c.totalSpend += b.service.price;
            });

            // Compute derived
            Object.keys(clients).forEach(function(phone) {
                var c = clients[phone];
                c.averageSpend = c.totalVisits > 0 ? Math.round(c.totalSpend / c.totalVisits * 100) / 100 : 0;
                c.preferredService = getTopKey(c.services);
                c.preferredBarber = getTopKey(c.barbers);
            });

            db.ref('autoManager/clients').set(clients);
            db.ref('autoManager/meta/clientsBuilt').set(true);
        });
    }

    function getTopKey(obj) {
        if (!obj) return null;
        var keys = Object.keys(obj);
        if (keys.length === 0) return null;
        return keys.reduce(function(a, b) { return obj[a] >= obj[b] ? a : b; });
    }

    // Incremental update from new booking
    AM.updateClientFromBooking = function(booking) {
        if (!booking || !booking.phone) return;
        var normPhone = booking.phone.replace(/[^0-9]/g, '');
        if (normPhone.length < 8) return;

        db.ref('autoManager/clients/' + normPhone).once('value', function(snap) {
            var c = snap.val() || {
                name: booking.name || 'Unknown', phone: booking.phone, email: booking.email || '',
                firstVisit: booking.date || booking.createdAt, lastVisit: booking.date || booking.createdAt,
                totalVisits: 0, totalSpend: 0, services: {}, barbers: {},
                updatedAt: new Date().toISOString()
            };
            c.name = booking.name || c.name;
            c.email = booking.email || c.email;
            c.totalVisits = (c.totalVisits || 0) + 1;
            var svcName = booking.service ? (booking.service.name || booking.service) : null;
            if (svcName) { if (!c.services) c.services = {}; c.services[svcName] = (c.services[svcName] || 0) + 1; }
            var barberName = booking.barber ? (booking.barber.name || booking.barber) : null;
            if (barberName && barberName !== 'Any Available Barber') { if (!c.barbers) c.barbers = {}; c.barbers[barberName] = (c.barbers[barberName] || 0) + 1; }
            var visitDate = booking.date || booking.createdAt;
            if (!c.lastVisit || visitDate > c.lastVisit) c.lastVisit = visitDate;
            if (booking.service && booking.service.price) c.totalSpend = (c.totalSpend || 0) + booking.service.price;
            c.averageSpend = c.totalVisits > 0 ? Math.round(c.totalSpend / c.totalVisits * 100) / 100 : 0;
            c.preferredService = getTopKey(c.services);
            c.preferredBarber = getTopKey(c.barbers);
            c.updatedAt = new Date().toISOString();
            db.ref('autoManager/clients/' + normPhone).set(c);
        });
    };

    function renderClients() {
        var statsEl = document.getElementById('am-client-stats');
        var listEl = document.getElementById('am-client-list');
        if (!statsEl || !listEl) return;

        var phones = Object.keys(clientProfiles);
        var totalClients = phones.length;
        var now = new Date();
        var monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        var newThisMonth = phones.filter(function(p) { return (clientProfiles[p].firstVisit || '') >= monthStart; }).length;
        var returning = phones.filter(function(p) { return (clientProfiles[p].totalVisits || 0) > 1; }).length;
        var returnRate = totalClients > 0 ? Math.round(returning / totalClients * 100) : 0;

        statsEl.innerHTML =
            '<div class="am-stat"><div class="am-stat-value">' + totalClients + '</div><div class="am-stat-label">Total Clients</div></div>' +
            '<div class="am-stat am-stat-green"><div class="am-stat-value">' + newThisMonth + '</div><div class="am-stat-label">New This Month</div></div>' +
            '<div class="am-stat am-stat-blue"><div class="am-stat-value">' + returnRate + '%</div><div class="am-stat-label">Return Rate</div></div>';

        // Search filter
        var searchInput = document.getElementById('am-client-search');
        var query = searchInput ? searchInput.value.toLowerCase() : '';

        var sorted = phones.map(function(p) { return clientProfiles[p]; })
            .filter(function(c) { return !query || (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query); })
            .sort(function(a, b) { return (b.totalVisits || 0) - (a.totalVisits || 0); });

        if (sorted.length === 0) {
            listEl.innerHTML = '<div class="am-empty">' + (query ? 'No clients matching "' + query + '"' : 'No client data yet. Clients are added automatically from bookings.') + '</div>';
            return;
        }

        listEl.innerHTML = sorted.slice(0, 50).map(function(c) {
            var lastVisit = c.lastVisit ? new Date(c.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';
            return '<div class="am-client-card">' +
                '<div class="am-client-main">' +
                    '<div class="am-client-name">' + (c.name || 'Unknown') + '</div>' +
                    '<div class="am-muted">' + (c.phone || '') + '</div>' +
                '</div>' +
                '<div class="am-client-meta">' +
                    '<span>' + (c.totalVisits || 0) + ' visits</span>' +
                    '<span>£' + (c.totalSpend || 0).toFixed(0) + ' spent</span>' +
                    '<span>Last: ' + lastVisit + '</span>' +
                '</div>' +
                '<div class="am-client-prefs">' +
                    (c.preferredBarber ? '<span class="am-chip">' + c.preferredBarber + '</span>' : '') +
                    (c.preferredService ? '<span class="am-chip">' + c.preferredService + '</span>' : '') +
                '</div>' +
            '</div>';
        }).join('');
    }

    AM.searchClients = function() { renderClients(); };


    // ================================================================
    // MASTER HOOK — called from confirmPayment() and logCash()
    // ================================================================

    AM.onPaymentConfirmed = function(paymentKey) {
        AM.autoDecrementStock(paymentKey);
        AM.queueReviewRequest(paymentKey);
        AM.autoAssignCommission(paymentKey);
    };


    // ================================================================
    // INIT — called on page load
    // ================================================================

    AM.init = function() {
        buildServiceMap();
        loadInventory();
        loadReviews();
        loadExpenses();
        loadCommissions();
        loadClients();
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(AM.init, 500); });
    } else {
        setTimeout(AM.init, 500);
    }

})();
