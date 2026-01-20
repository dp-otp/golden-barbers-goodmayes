/* ============================================
   GOLDEN BARBERS - PREMIUM JAVASCRIPT
   Interactive Functionality & Animations
   ============================================ */

// ============================================
// 1. NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.hamburger = document.querySelector('.nav-hamburger');
        this.menu = document.querySelector('.nav-menu');
        this.links = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Set active link based on current page
        this.setActiveLink();
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.links.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// 2. SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .service-card-interactive, .gallery-item-interactive'
        );

        animatedElements.forEach(el => observer.observe(el));
    }
}

// ============================================
// 3. SERVICE DETAILS MODAL
// ============================================
class ServiceModal {
    constructor() {
        this.modal = null;
        this.currentService = null;
        this.init();
    }

    init() {
        // Listen for service card clicks
        document.addEventListener('click', (e) => {
            const serviceCard = e.target.closest('.service-card-interactive');
            if (serviceCard) {
                const serviceData = this.extractServiceData(serviceCard);
                this.show(serviceData);
            }

            // Close modal clicks
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.close();
            }
        });
    }

    extractServiceData(card) {
        return {
            name: card.querySelector('.service-card-title')?.textContent || '',
            price: card.querySelector('.service-card-price')?.textContent || '',
            duration: card.dataset.duration || '30 min',
            description: card.querySelector('.service-card-description')?.textContent || '',
            icon: card.querySelector('.service-card-icon')?.textContent || '✂️',
            addOns: JSON.parse(card.dataset.addons || '[]')
        };
    }

    show(serviceData) {
        this.currentService = serviceData;

        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay';
        this.modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <span class="modal-icon">${serviceData.icon}</span>
                    <h2>${serviceData.name}</h2>
                </div>
                <div class="modal-body">
                    <p class="modal-description">${serviceData.description}</p>
                    <div class="modal-details">
                        <div class="modal-detail-item">
                            <span class="modal-detail-label">Price</span>
                            <span class="modal-detail-value">${serviceData.price}</span>
                        </div>
                        <div class="modal-detail-item">
                            <span class="modal-detail-label">Duration</span>
                            <span class="modal-detail-value">${serviceData.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary btn-large" onclick="bookingFlow.startBooking('${serviceData.name}', '${serviceData.price}')">
                        <span>Book & Pay</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            this.modal.classList.add('active');
        });
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.remove();
            this.modal = null;
            document.body.style.overflow = '';
        }, 300);
    }
}

// ============================================
// 4. UPSELL MODAL
// ============================================
class UpsellModal {
    constructor() {
        this.modal = null;
        this.selectedAddOns = [];
        this.callback = null;
    }

    show(mainService, addOns, callback) {
        this.selectedAddOns = [];
        this.callback = callback;

        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay upsell-modal';

        const addOnsHTML = addOns.map((addOn, index) => `
            <div class="upsell-item" data-index="${index}">
                <div class="upsell-item-header">
                    <div>
                        <h4>${addOn.name}</h4>
                        <p>${addOn.description}</p>
                        ${addOn.discount ? `<span class="upsell-discount-badge">${addOn.discount}</span>` : ''}
                    </div>
                    <div class="upsell-item-price">
                        ${addOn.originalPrice ? `<span class="upsell-original-price">${addOn.originalPrice}</span>` : ''}
                        <span class="upsell-price-label">+${addOn.price}</span>
                        <span class="upsell-duration">${addOn.duration}</span>
                    </div>
                </div>
                <button class="upsell-add-btn" data-index="${index}">
                    <span>Add to booking</span>
                </button>
            </div>
        `).join('');

        this.modal.innerHTML = `
            <div class="modal-content upsell-modal-content">
                <div class="upsell-header">
                    <h2>Complete Your Look</h2>
                    <p>Most clients upgrade their ${mainService.toLowerCase()} with:</p>
                </div>
                <div class="upsell-body">
                    ${addOnsHTML}
                </div>
                <div class="upsell-footer">
                    <button class="btn btn-secondary" onclick="upsellModal.skip()">
                        <span>Skip</span>
                    </button>
                    <button class="btn btn-primary" onclick="upsellModal.continue()">
                        <span>Continue to Payment</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        // Add click handlers for add-ons
        this.modal.querySelectorAll('.upsell-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleAddOn(e, addOns));
        });

        requestAnimationFrame(() => {
            this.modal.classList.add('active');
        });
    }

    toggleAddOn(e, addOns) {
        const btn = e.currentTarget;
        const index = parseInt(btn.dataset.index);
        const addOn = addOns[index];

        const existingIndex = this.selectedAddOns.findIndex(item => item.name === addOn.name);

        if (existingIndex > -1) {
            // Remove
            this.selectedAddOns.splice(existingIndex, 1);
            btn.classList.remove('added');
            btn.querySelector('span').textContent = 'Add to booking';
        } else {
            // Add
            this.selectedAddOns.push(addOn);
            btn.classList.add('added');
            btn.querySelector('span').textContent = '✓ Added';
        }
    }

    skip() {
        this.continue();
    }

    continue() {
        if (this.callback) {
            this.callback(this.selectedAddOns);
        }
        this.close();
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.remove();
            this.modal = null;
            document.body.style.overflow = '';
        }, 300);
    }
}

// ============================================
// 5. PAYMENT CHECKOUT
// ============================================
class PaymentCheckout {
    constructor() {
        this.modal = null;
    }

    show(mainService, mainPrice, addOns = []) {
        const subtotal = this.calculateSubtotal(mainPrice, addOns);
        const tax = (subtotal * 0.2).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

        const itemsHTML = `
            <div class="checkout-item">
                <span>${mainService}</span>
                <span>${mainPrice}</span>
            </div>
            ${addOns.map(addOn => `
                <div class="checkout-item addon">
                    <span>${addOn.name}</span>
                    <span>${addOn.price}</span>
                </div>
            `).join('')}
        `;

        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay checkout-modal';
        this.modal.innerHTML = `
            <div class="modal-content checkout-modal-content">
                <button class="modal-close">&times;</button>
                <div class="checkout-header">
                    <h2>Complete Your Booking</h2>
                    <p>Secure payment powered by Stripe</p>
                </div>

                <div class="checkout-body">
                    <div class="checkout-section">
                        <h3>Order Summary</h3>
                        <div class="checkout-items">
                            ${itemsHTML}
                            <div class="checkout-divider"></div>
                            <div class="checkout-item">
                                <span>Subtotal</span>
                                <span>£${subtotal}</span>
                            </div>
                            <div class="checkout-item">
                                <span>VAT (20%)</span>
                                <span>£${tax}</span>
                            </div>
                            <div class="checkout-total">
                                <span>Total</span>
                                <span>£${total}</span>
                            </div>
                        </div>
                    </div>

                    <div class="checkout-section">
                        <h3>Contact Information</h3>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Smith" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="07XXX XXXXXX" required>
                        </div>
                    </div>

                    <div class="checkout-section">
                        <h3>Payment Details</h3>
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" placeholder="4242 4242 4242 4242" maxlength="19">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expiry Date</label>
                                <input type="text" placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="form-group">
                                <label>CVC</label>
                                <input type="text" placeholder="123" maxlength="3">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="checkout-footer">
                    <button class="btn btn-primary btn-large" onclick="paymentCheckout.processPayment()">
                        <span>Pay £${total}</span>
                    </button>
                    <p class="checkout-secure">
                        <svg width="12" height="14" fill="currentColor"><path d="M6 0L0 3v4c0 3.5 2.5 6.5 6 8 3.5-1.5 6-4.5 6-8V3L6 0z"/></svg>
                        Secure payment
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        // Close button
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());

        requestAnimationFrame(() => {
            this.modal.classList.add('active');
        });
    }

    calculateSubtotal(mainPrice, addOns) {
        let total = parseFloat(mainPrice.replace('£', ''));
        addOns.forEach(addOn => {
            total += parseFloat(addOn.price.replace('£', ''));
        });
        return total.toFixed(2);
    }

    processPayment() {
        // Simulate payment processing
        const btn = this.modal.querySelector('.checkout-footer .btn');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<span>Processing...</span>';

        setTimeout(() => {
            this.close();
            this.showSuccess();
        }, 2000);
    }

    showSuccess() {
        const successModal = document.createElement('div');
        successModal.className = 'modal-overlay success-modal active';
        successModal.innerHTML = `
            <div class="modal-content success-modal-content">
                <div class="success-icon">✓</div>
                <h2>Booking Confirmed!</h2>
                <p>We've sent confirmation details to your email.</p>
                <p class="success-subtext">See you soon at Golden Barbers!</p>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">
                    <span>Close</span>
                </button>
            </div>
        `;
        document.body.appendChild(successModal);
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.remove();
            this.modal = null;
            document.body.style.overflow = '';
        }, 300);
    }
}

// ============================================
// 6. BOOKING FLOW CONTROLLER
// ============================================
class BookingFlow {
    constructor() {
        this.currentService = null;
        this.currentPrice = null;
    }

    startBooking(serviceName, servicePrice) {
        this.currentService = serviceName;
        this.currentPrice = servicePrice;

        // Close service modal
        if (window.serviceModal && window.serviceModal.modal) {
            window.serviceModal.close();
        }

        // Define upsell add-ons based on service
        const addOns = this.getAddOnsForService(serviceName);

        if (addOns.length > 0) {
            // Show upsell modal
            window.upsellModal.show(serviceName, addOns, (selectedAddOns) => {
                this.proceedToPayment(selectedAddOns);
            });
        } else {
            // Go straight to payment
            this.proceedToPayment([]);
        }
    }

    getAddOnsForService(serviceName) {
        const addOnsMap = {
            'Golden Luxury': [
                { name: 'Patterns and design', price: '£8.00', originalPrice: '£10.00', duration: '+15 min', description: 'Custom hair patterns', discount: '20% OFF' }
            ],
            'Hair Cut, Hair Bundle + Style': [
                { name: 'Beard trim with machine', price: '£5.50', originalPrice: '£6.95', duration: '+10 min', description: 'Clean machine trim', discount: 'Save £1.45' },
                { name: 'Head massage', price: '£4.00', originalPrice: '£5.00', duration: '+10 min', description: 'Relaxing massage', discount: 'Save £1' }
            ],
            'Gents Cut': [
                { name: 'Beard trim with machine', price: '£5.50', originalPrice: '£6.95', duration: '+10 min', description: 'Clean machine trim', discount: 'Save £1.45' },
                { name: 'Traditional Turkish hot towel', price: '£4.00', originalPrice: '£5.00', duration: '+15 min', description: 'Hot towel service', discount: 'Save £1' }
            ],
            'Skin Fade': [
                { name: 'Patterns and design', price: '£4.00', originalPrice: '£5.00', duration: '+15 min', description: 'Custom designs', discount: 'Save £1' },
                { name: 'Beard trim with machine', price: '£5.50', originalPrice: '£6.95', duration: '+10 min', description: 'Clean machine trim', discount: 'Save £1.45' }
            ],
            'Under 10s Cut': [
                { name: 'Patterns and design', price: '£4.00', originalPrice: '£5.00', duration: '+15 min', description: 'Fun designs for kids', discount: 'Save £1' }
            ],
            'Beard Trim with Machine': [
                { name: 'Head massage', price: '£4.00', originalPrice: '£5.00', duration: '+10 min', description: 'Relaxing massage', discount: 'Save £1' }
            ],
            'Traditional Turkish Hot Towel': [
                { name: 'Head massage', price: '£4.00', originalPrice: '£5.00', duration: '+10 min', description: 'Relaxing massage', discount: 'Save £1' }
            ],
            'Deluxe Hot Towel Shave': [
                { name: 'Head massage', price: '£4.00', originalPrice: '£5.00', duration: '+10 min', description: 'Relaxing massage', discount: 'Save £1' },
                { name: 'Beard trim with machine', price: '£5.50', originalPrice: '£6.95', duration: '+10 min', description: 'Clean machine trim', discount: 'Save £1.45' }
            ],
            'Headshave': [
                { name: 'Traditional Turkish hot towel', price: '£4.00', originalPrice: '£5.00', duration: '+15 min', description: 'Hot towel finish', discount: 'Save £1' },
                { name: 'Beard trim with machine', price: '£5.50', originalPrice: '£6.95', duration: '+10 min', description: 'Clean machine trim', discount: 'Save £1.45' }
            ],
            'Ear / Nose Flaming & Waxing': [
                { name: 'Head massage', price: '£4.00', originalPrice: '£5.00', duration: '+10 min', description: 'Relaxing massage', discount: 'Save £1' }
            ],
            'Patterns and Design': [],
            'Head Massage': [],
            'Colour / Textures': []
        };

        return addOnsMap[serviceName] || [];
    }

    proceedToPayment(addOns) {
        window.paymentCheckout.show(this.currentService, this.currentPrice, addOns);
    }
}

// ============================================
// 7. FORM HANDLING
// ============================================
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('form[data-form-type]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formType = form.dataset.formType;

        // Simulate form submission
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<span>Sending...</span>';

        setTimeout(() => {
            btn.innerHTML = '<span>✓ Sent!</span>';
            form.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }, 2000);
        }, 1500);
    }
}

// ============================================
// 8. GALLERY FILTERING
// ============================================
class GalleryFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item-interactive');
        this.init();
    }

    init() {
        if (this.filterBtns.length === 0) return;

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterGallery(btn));
        });
    }

    filterGallery(btn) {
        const filter = btn.dataset.filter;

        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        this.galleryItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                // Re-trigger animation
                item.classList.remove('scale-in');
                void item.offsetWidth; // Force reflow
                item.classList.add('scale-in');
            } else {
                item.style.display = 'none';
            }
        });

        // Auto-scroll to first visible gallery item on mobile - ALWAYS run (not just mobile)
        setTimeout(() => {
            const firstVisible = Array.from(this.galleryItems).find(item => item.style.display !== 'none');
            if (firstVisible) {
                // Get the gallery grid container for better positioning
                const galleryGrid = firstVisible.closest('.gallery-grid');
                if (galleryGrid) {
                    const offset = 150; // Offset for fixed header and some breathing room
                    const gridTop = galleryGrid.getBoundingClientRect().top + window.scrollY;

                    window.scrollTo({
                        top: gridTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        }, 300);
    }
}

// ============================================
// 9. INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    window.navigation = new Navigation();
    window.scrollAnimations = new ScrollAnimations();
    window.serviceModal = new ServiceModal();
    window.upsellModal = new UpsellModal();
    window.paymentCheckout = new PaymentCheckout();
    window.bookingFlow = new BookingFlow();
    window.formHandler = new FormHandler();
    window.galleryFilter = new GalleryFilter();

    console.log('✨ Golden Barbers Premium - Initialized');
});