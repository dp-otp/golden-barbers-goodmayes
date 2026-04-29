const crypto = require('crypto');
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.database();
const REGION = 'europe-west1';
const TIME_ZONE = 'Europe/London';
const ENGINE_VERSION = '2026.03.27.1';
const DEFAULT_WHATSAPP_API_VERSION = 'v23.0';
const GOOGLE_BUSINESS_API_BASE = 'https://mybusiness.googleapis.com/v4';
const GOOGLE_REVIEW_SYNC_LIMIT = 50;

const DELIVERED_STATUSES = new Set(['completed', 'completed_pending_payment']);
const SETTLED_PAYMENT_STATUSES = new Set(['confirmed', 'paid']);
const PRESERVED_REVIEW_STATUSES = new Set(['sent', 'reviewed', 'skipped']);

function nowIso() {
  return new Date().toISOString();
}

function safeText(value) {
  return String(value == null ? '' : value).trim();
}

function roundMoney(value) {
  return Math.round((parseFloat(value) || 0) * 100) / 100;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function envText(name, fallback) {
  const value = safeText(process.env[name]);
  return value || safeText(fallback);
}

function envBool(name, fallback) {
  const value = safeText(process.env[name]).toLowerCase();
  if (!value) return !!fallback;
  if (['1', 'true', 'yes', 'on'].includes(value)) return true;
  if (['0', 'false', 'no', 'off'].includes(value)) return false;
  return !!fallback;
}

function normalizePhone(value) {
  return safeText(value).replace(/[^0-9]/g, '');
}

function formatWhatsappDestinationPhone(value) {
  let digits = normalizePhone(value);
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('44')) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return `44${digits.slice(1)}`;
  return digits;
}

function getIntegrationStatus() {
  return {
    whatsappApiConfigured: !!(envText('WHATSAPP_ACCESS_TOKEN') && envText('WHATSAPP_PHONE_NUMBER_ID')),
    whatsappWebhookConfigured: !!envText('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
    googleBusinessConfigured: !!(
      envText('GOOGLE_BUSINESS_CLIENT_ID') &&
      envText('GOOGLE_BUSINESS_CLIENT_SECRET') &&
      envText('GOOGLE_BUSINESS_REFRESH_TOKEN') &&
      envText('GOOGLE_BUSINESS_LOCATION_NAME')
    )
  };
}

function getWhatsappApiVersion() {
  return envText('WHATSAPP_API_VERSION', DEFAULT_WHATSAPP_API_VERSION);
}

function createStableKey(value) {
  return crypto.createHash('sha1').update(safeText(value)).digest('hex');
}

function normalizeComparableText(value) {
  return safeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenizeComparableText(value) {
  return normalizeComparableText(value)
    .split(' ')
    .map((part) => safeText(part))
    .filter(Boolean);
}

function nameMatchScore(left, right) {
  const leftNormalized = normalizeComparableText(left);
  const rightNormalized = normalizeComparableText(right);

  if (!leftNormalized || !rightNormalized) return 0;
  if (leftNormalized === rightNormalized) return 100;

  const shorter = leftNormalized.length <= rightNormalized.length ? leftNormalized : rightNormalized;
  const longer = shorter === leftNormalized ? rightNormalized : leftNormalized;
  if (shorter.length >= 4 && longer.includes(shorter)) return 85;

  const leftTokens = tokenizeComparableText(left);
  const rightTokens = tokenizeComparableText(right);
  const overlaps = leftTokens.filter((token) => rightTokens.includes(token));
  if (!overlaps.length) return 0;

  const longestSharedToken = overlaps.reduce((best, token) => Math.max(best, token.length), 0);
  if (overlaps.length >= 2) return 80 + overlaps.length;
  if (overlaps.length === 1 && longestSharedToken >= 5 && (leftTokens.length <= 2 || rightTokens.length <= 2)) {
    return 72;
  }
  return 0;
}

function parseGoogleStarRating(value) {
  const lookup = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
  };
  if (typeof value === 'number') return value;
  return lookup[safeText(value).toUpperCase()] || 0;
}

function unixSecondsToIso(value) {
  const timestamp = parseInt(value, 10);
  if (!timestamp) return nowIso();
  const date = new Date(timestamp * 1000);
  return Number.isNaN(date.getTime()) ? nowIso() : date.toISOString();
}

function dayKey(value) {
  const text = safeText(value);
  if (!text) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
}

function getVisitDate(visit) {
  return dayKey(
    (visit && (visit.preferredDate || visit.date || visit.createdAt)) || ''
  );
}

function getVisitServiceSummary(visit, payment) {
  if (safeText(visit && visit.serviceSummary)) return safeText(visit.serviceSummary);
  if (safeArray(visit && visit.items).length) return visit.items.join(', ');
  if (safeArray(payment && payment.items).length) return payment.items.join(', ');
  return 'Service';
}

function getVisitAmount(visit, payment) {
  return roundMoney(
    (visit && (visit.total || visit.subtotal)) ||
      (payment && (payment.amount || payment.subtotal)) ||
      0
  );
}

function getPaymentStatus(visit, payment) {
  return safeText(
    (visit && visit.paymentStatus) || (payment && payment.status) || ''
  ).toLowerCase();
}

function getVisitStatus(visit) {
  return safeText(visit && visit.visitStatus).toLowerCase();
}

function isServiceDelivered(visit) {
  return DELIVERED_STATUSES.has(getVisitStatus(visit));
}

function isPaymentSettled(visit, payment) {
  if (safeText((visit && visit.paymentMethod) || (payment && payment.paymentMethod)).toLowerCase() === 'cash') {
    return true;
  }
  return SETTLED_PAYMENT_STATUSES.has(getPaymentStatus(visit, payment));
}

function getPhoneForVisit(visit) {
  return normalizePhone(visit && (visit.customerPhone || visit.phone));
}

function getSourceLabel(source) {
  const value = safeText(source).toLowerCase();
  if (value === 'online_booking') return 'Online booking';
  if (value === 'qr_walkin') return 'In-shop QR';
  if (value === 'walk_in_cash') return 'Walk-in cash';
  if (value === 'legacy_booking') return 'Legacy booking';
  return 'Visit';
}

function getVisitSnapshot(visit, payment) {
  return {
    customerName: safeText(visit.customerName || visit.name || 'Guest'),
    customerPhone: safeText(visit.customerPhone || visit.phone),
    customerEmail: safeText(visit.customerEmail || visit.email),
    preferredBarber: safeText(visit.preferredBarber),
    serviceSummary: getVisitServiceSummary(visit, payment),
    total: getVisitAmount(visit, payment),
    date: getVisitDate(visit) || dayKey(nowIso()),
    source: safeText(visit.source),
    paymentStatus: getPaymentStatus(visit, payment),
    visitStatus: getVisitStatus(visit),
    updatedAt: nowIso()
  };
}

function recalcClientProfile(existing, visitId, visit, payment) {
  const visitName = safeText(visit && (visit.customerName || visit.name));
  const visitPhone = safeText(visit && (visit.customerPhone || visit.phone));
  const visitEmail = safeText(visit && (visit.customerEmail || visit.email));
  const profile = Object.assign(
    {
      name: visitName || 'Unknown',
      phone: visitPhone,
      email: visitEmail,
      totalVisits: 0,
      totalSpend: 0,
      averageSpend: 0,
      firstVisit: '',
      lastVisit: '',
      preferredService: '',
      preferredBarber: '',
      services: {},
      barbers: {},
      visitKeys: {},
      updatedAt: nowIso()
    },
    existing || {}
  );

  profile.visitKeys = Object.assign({}, profile.visitKeys || {});

  if (visit) {
    profile.visitKeys[visitId] = getVisitSnapshot(visit, payment);
  } else {
    delete profile.visitKeys[visitId];
  }

  const visitEntries = Object.values(profile.visitKeys);
  const services = {};
  const barbers = {};
  let totalSpend = 0;
  let firstVisit = '';
  let lastVisit = '';

  visitEntries.forEach((entry) => {
    const amount = roundMoney(entry.total);
    const date = dayKey(entry.date);
    totalSpend += amount;
    if (!firstVisit || (date && date < firstVisit)) firstVisit = date;
    if (!lastVisit || (date && date > lastVisit)) lastVisit = date;

    safeText(entry.serviceSummary)
      .split(',')
      .map((part) => safeText(part))
      .filter(Boolean)
      .forEach((serviceName) => {
        services[serviceName] = (services[serviceName] || 0) + 1;
      });

    if (safeText(entry.preferredBarber)) {
      barbers[entry.preferredBarber] = (barbers[entry.preferredBarber] || 0) + 1;
    }
  });

  const totalVisits = visitEntries.length;
  profile.name = visitName || profile.name;
  profile.phone = visitPhone || profile.phone;
  profile.email = visitEmail || profile.email;
  profile.totalVisits = totalVisits;
  profile.totalSpend = roundMoney(totalSpend);
  profile.averageSpend = totalVisits ? roundMoney(totalSpend / totalVisits) : 0;
  profile.firstVisit = firstVisit || '';
  profile.lastVisit = lastVisit || '';
  profile.services = services;
  profile.barbers = barbers;
  profile.preferredService = topKey(services);
  profile.preferredBarber = topKey(barbers);
  profile.updatedAt = nowIso();

  return profile;
}

function topKey(obj) {
  const keys = Object.keys(obj || {});
  if (!keys.length) return '';
  return keys.reduce((best, current) => {
    return (obj[current] || 0) > (obj[best] || 0) ? current : best;
  }, keys[0]);
}

function findStaffMatch(staffMap, barberName) {
  const target = safeText(barberName).toLowerCase();
  if (!target) return null;
  return Object.keys(staffMap || {}).reduce((match, key) => {
    if (match) return match;
    const staff = staffMap[key] || {};
    if (safeText(staff.name).toLowerCase() === target) {
      return Object.assign({ _key: key }, staff);
    }
    return null;
  }, null);
}

function buildReviewQueueItem(existing, visitId, visit, payment) {
  return {
    customerName: safeText(visit.customerName || visit.name || existing && existing.customerName || 'Guest'),
    customerPhone: safeText(visit.customerPhone || visit.phone || existing && existing.customerPhone),
    customerEmail: safeText(visit.customerEmail || visit.email || existing && existing.customerEmail),
    service: getVisitServiceSummary(visit, payment),
    amount: getVisitAmount(visit, payment),
    paymentKey: visitId,
    visitKey: visitId,
    status: safeText(existing && existing.status) || 'pending',
    queuedAt: safeText(existing && existing.queuedAt) || nowIso(),
    sentAt: existing && existing.sentAt ? existing.sentAt : null,
    reviewedAt: existing && existing.reviewedAt ? existing.reviewedAt : null,
    source: 'backend',
    backendUpdatedAt: nowIso()
  };
}

function buildCommissionAssignment(existing, visitId, visit, payment, commissionSettings, staffMap) {
  const staffMatch = findStaffMatch(staffMap, visit.preferredBarber);
  if (!staffMatch) return null;

  if (existing && existing.manualOverride) {
    return Object.assign({}, existing, {
      backendUpdatedAt: nowIso(),
      visitStatus: getVisitStatus(visit),
      paymentStatus: getPaymentStatus(visit, payment)
    });
  }

  const defaultRate = parseInt((commissionSettings && commissionSettings.defaultRate) || 40, 10) || 40;
  const staffRates = (commissionSettings && commissionSettings.staffRates) || {};
  const rate = parseInt(staffRates[staffMatch._key] || defaultRate, 10) || defaultRate;
  const amount = getVisitAmount(visit, payment);
  const commission = roundMoney(amount * (rate / 100));

  return {
    staffKey: staffMatch._key,
    staffName: safeText(staffMatch.name),
    paymentKey: visitId,
    amount: amount,
    commission: commission,
    rate: rate,
    date: getVisitDate(visit) || dayKey(nowIso()),
    service: getVisitServiceSummary(visit, payment),
    createdAt: safeText(existing && existing.createdAt) || nowIso(),
    backendUpdatedAt: nowIso(),
    source: existing && existing.source === 'manual' ? 'manual' : 'backend',
    manualOverride: !!(existing && existing.manualOverride),
    visitStatus: getVisitStatus(visit),
    paymentStatus: getPaymentStatus(visit, payment)
  };
}

function shouldQueueReview(visit, payment, reviewSettings) {
  if (!isServiceDelivered(visit)) return false;
  if (!isPaymentSettled(visit, payment)) return false;
  if (!reviewSettings || reviewSettings.autoQueueEnabled === false) return false;
  if (!safeText(reviewSettings.googleReviewUrl)) return false;
  if (!getPhoneForVisit(visit)) return false;
  return getVisitAmount(visit, payment) >= roundMoney(reviewSettings.minimumSpend || 0);
}

function shouldAssignCommission(visit, payment) {
  if (!isServiceDelivered(visit)) return false;
  if (!isPaymentSettled(visit, payment)) return false;
  return !!safeText(visit && visit.preferredBarber);
}

function shouldTrackClient(visit) {
  return isServiceDelivered(visit) && !!getPhoneForVisit(visit);
}

function shouldConsumeInventory(visit) {
  return isServiceDelivered(visit);
}

async function updateEngineStatus(patch) {
  await db.ref('automationV2/system/status').update(
    Object.assign(
      {
        backendOwned: true,
        mode: 'backend',
        version: ENGINE_VERSION,
        region: REGION,
        integrations: getIntegrationStatus(),
        updatedAt: nowIso()
      },
      patch || {}
    )
  );
}

async function refreshEngineMetrics() {
  const [reviewSnap, clientSnap, commissionSnap, lowStockSnap, pendingSnap, googleSummarySnap] = await Promise.all([
    db.ref('autoManager/reviews/queue').once('value'),
    db.ref('autoManager/clients').once('value'),
    db.ref('autoManager/commissions/assignments').once('value'),
    db.ref('automationV2/alerts/lowStock').once('value'),
    db.ref('automationV2/alerts/pendingPayments').once('value'),
    db.ref('automationV2/googleBusiness/summary').once('value')
  ]);

  const reviewQueue = reviewSnap.val() || {};
  const pendingReviews = Object.values(reviewQueue).filter((item) => safeText(item.status) === 'pending').length;
  const sentReviews = Object.values(reviewQueue).filter((item) => safeText(item.status) === 'sent').length;
  const reviewedReviews = Object.values(reviewQueue).filter((item) => safeText(item.status) === 'reviewed').length;
  const totalClients = Object.keys(clientSnap.val() || {}).length;
  const totalAssignments = Object.keys(commissionSnap.val() || {}).length;
  const lowStockAlerts = Object.keys(lowStockSnap.val() || {}).length;
  const stalePendingPayments = Object.keys(pendingSnap.val() || {}).length;
  const googleSummary = googleSummarySnap.val() || {};

  await db.ref('automationV2/system/metrics').set({
    pendingReviews,
    sentReviews,
    reviewedReviews,
    totalClients,
    totalAssignments,
    lowStockAlerts,
    stalePendingPayments,
    googleReviewCount: parseInt(googleSummary.totalReviewCount, 10) || 0,
    googleAverageRating: parseFloat(googleSummary.averageRating) || 0,
    lastComputedAt: nowIso()
  });
}

async function pushOpsNotification(type, title, body, data) {
  await db.ref('opsNotifications').push({
    type,
    title: safeText(title),
    body: safeText(body),
    createdAt: nowIso(),
    data: data || {}
  });
}

function buildReviewMessage(reviewItem, reviewSettings) {
  const template = safeText(
    (reviewSettings && reviewSettings.messageTemplate) ||
      'Thanks for visiting Golden Barbers. We would really appreciate a quick review: {link}'
  );

  return template
    .replace(/\{name\}/gi, safeText(reviewItem && reviewItem.customerName) || 'there')
    .replace(/\{link\}/gi, safeText(reviewSettings && reviewSettings.googleReviewUrl));
}

function extractApiError(payload, fallback) {
  if (!payload || typeof payload !== 'object') return safeText(fallback);
  if (payload.error && payload.error.message) return safeText(payload.error.message);
  if (payload.error_description) return safeText(payload.error_description);
  if (payload.message) return safeText(payload.message);
  return safeText(fallback);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const raw = await response.text();
  let payload = null;

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new Error(
      extractApiError(payload, `${safeText(options && options.method) || 'GET'} ${url} failed with ${response.status}`)
    );
  }

  return payload || {};
}

async function sendWhatsappTextMessage(to, body) {
  if (!getIntegrationStatus().whatsappApiConfigured) {
    throw new Error('WhatsApp API credentials are missing');
  }

  const phoneNumberId = envText('WHATSAPP_PHONE_NUMBER_ID');
  const accessToken = envText('WHATSAPP_ACCESS_TOKEN');
  const apiVersion = getWhatsappApiVersion();

  return fetchJson(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: true,
        body
      }
    })
  });
}

async function sendReviewRequest(queueKey) {
  const reviewRef = db.ref(`autoManager/reviews/queue/${queueKey}`);
  const [reviewSnap, reviewSettingsSnap] = await Promise.all([
    reviewRef.once('value'),
    db.ref('autoManager/reviews/settings').once('value')
  ]);

  if (!reviewSnap.exists()) {
    throw new Error(`Review queue item ${queueKey} was not found`);
  }

  const item = reviewSnap.val() || {};
  const reviewSettings = reviewSettingsSnap.val() || {};
  const currentStatus = safeText(item.status).toLowerCase();

  if (currentStatus === 'reviewed') {
    return { skipped: true, reason: 'already_reviewed', queueKey };
  }

  if (currentStatus === 'skipped') {
    return { skipped: true, reason: 'already_skipped', queueKey };
  }

  const destination = formatWhatsappDestinationPhone(item.customerPhone);
  if (!destination) {
    throw new Error('Review request is missing a valid WhatsApp phone number');
  }

  const message = buildReviewMessage(item, reviewSettings);
  if (!message) {
    throw new Error('Review request message is empty');
  }

  await reviewRef.update({
    lastSendAttemptAt: nowIso(),
    deliveryError: null,
    backendUpdatedAt: nowIso()
  });

  const response = await sendWhatsappTextMessage(destination, message);
  const messageId = safeText(response && response.messages && response.messages[0] && response.messages[0].id);
  const recipientWaId = safeText(response && response.contacts && response.contacts[0] && response.contacts[0].wa_id);

  await reviewRef.update({
    status: 'sent',
    sentAt: nowIso(),
    sentVia: 'whatsapp_api',
    whatsappMessageId: messageId,
    whatsappRecipientWaId: recipientWaId,
    deliveryStatus: 'accepted',
    lastSentMessage: message,
    deliveryError: null,
    backendUpdatedAt: nowIso()
  });

  if (messageId) {
    await db.ref(`automationV2/index/whatsappMessageReviews/${messageId}`).set(queueKey);
  }

  await refreshEngineMetrics();

  return {
    queueKey,
    messageId,
    recipientWaId,
    destination
  };
}

function verifyWhatsappSignature(request) {
  const appSecret = envText('WHATSAPP_APP_SECRET');
  if (!appSecret) return true;

  const signatureHeader = safeText(request.headers['x-hub-signature-256']);
  if (!signatureHeader.startsWith('sha256=')) return false;

  const expected = `sha256=${crypto.createHmac('sha256', appSecret).update(request.rawBody || '').digest('hex')}`;
  const actualBuffer = Buffer.from(signatureHeader);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

async function recordWhatsappStatusEvent(status) {
  const messageId = safeText(status && status.id);
  const queueKey = messageId
    ? safeText((await db.ref(`automationV2/index/whatsappMessageReviews/${messageId}`).once('value')).val())
    : '';
  const statusValue = safeText(status && status.status).toLowerCase();
  const eventTimestamp = unixSecondsToIso(status && status.timestamp);
  const errorText = safeArray(status && status.errors)
    .map((entry) => safeText(entry && (entry.title || entry.message || (entry.error_data && entry.error_data.details))))
    .filter(Boolean)
    .join('; ');

  const eventPayload = {
    messageId,
    queueKey,
    status: statusValue,
    timestamp: eventTimestamp,
    recipientId: safeText(status && status.recipient_id),
    conversationId: safeText(status && status.conversation && status.conversation.id),
    pricingCategory: safeText(status && status.pricing && status.pricing.category),
    error: errorText,
    receivedAt: nowIso()
  };

  await db.ref(`automationV2/integrations/whatsapp/statusEvents/${createStableKey(`${messageId}:${statusValue}:${eventTimestamp}`)}`).set(
    eventPayload
  );

  if (!queueKey) return;

  const reviewPatch = {
    deliveryStatus: statusValue,
    whatsappConversationId: eventPayload.conversationId,
    whatsappStatusUpdatedAt: nowIso(),
    backendUpdatedAt: nowIso()
  };

  if (statusValue === 'sent') reviewPatch.sentAt = eventTimestamp;
  if (statusValue === 'delivered') reviewPatch.deliveredAt = eventTimestamp;
  if (statusValue === 'read') reviewPatch.readAt = eventTimestamp;
  if (statusValue === 'failed') {
    reviewPatch.failedAt = eventTimestamp;
    reviewPatch.deliveryError = errorText || 'WhatsApp delivery failed';
  }

  await db.ref(`autoManager/reviews/queue/${queueKey}`).update(reviewPatch);
}

async function recordWhatsappInboundMessage(message, changeValue) {
  const messageId = safeText(message && message.id) || createStableKey(JSON.stringify(message || {}));
  await db.ref(`automationV2/integrations/whatsapp/inbound/${messageId}`).set({
    messageId,
    from: safeText(message && message.from),
    timestamp: unixSecondsToIso(message && message.timestamp),
    type: safeText(message && message.type),
    text: safeText(message && message.text && message.text.body),
    contextMessageId: safeText(message && message.context && message.context.id),
    phoneNumberId: safeText(changeValue && changeValue.metadata && changeValue.metadata.phone_number_id),
    profileName: safeText(
      changeValue &&
        changeValue.contacts &&
        changeValue.contacts[0] &&
        changeValue.contacts[0].profile &&
        changeValue.contacts[0].profile.name
    ),
    receivedAt: nowIso(),
    raw: message || {}
  });
}

async function getGoogleBusinessAccessToken() {
  if (!getIntegrationStatus().googleBusinessConfigured) {
    throw new Error('Google Business API credentials are missing');
  }

  const tokenResponse = await fetchJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: envText('GOOGLE_BUSINESS_CLIENT_ID'),
      client_secret: envText('GOOGLE_BUSINESS_CLIENT_SECRET'),
      refresh_token: envText('GOOGLE_BUSINESS_REFRESH_TOKEN'),
      grant_type: 'refresh_token'
    }).toString()
  });

  const accessToken = safeText(tokenResponse.access_token);
  if (!accessToken) throw new Error('Google Business access token exchange did not return an access token');
  return accessToken;
}

async function updateGoogleBusinessStatus(patch) {
  await db.ref('automationV2/googleBusiness/status').update(
    Object.assign(
      {
        configured: getIntegrationStatus().googleBusinessConfigured,
        updatedAt: nowIso()
      },
      patch || {}
    )
  );
}

function buildGoogleReviewRecord(review) {
  const reviewName = safeText(review && review.name);
  const reviewId = safeText(review && review.reviewId) || createStableKey(reviewName);
  const reviewer = (review && review.reviewer) || {};

  return {
    reviewId,
    name: reviewName,
    reviewerName: safeText(reviewer.displayName || reviewer.display_name || 'Anonymous'),
    reviewerPhotoUrl: safeText(reviewer.profilePhotoUrl),
    starRating: parseGoogleStarRating(review && review.starRating),
    comment: safeText(review && review.comment),
    createTime: safeText(review && review.createTime),
    updateTime: safeText(review && review.updateTime) || safeText(review && review.createTime),
    replyComment: safeText(review && review.reviewReply && review.reviewReply.comment),
    replyUpdateTime: safeText(review && review.reviewReply && review.reviewReply.updateTime),
    hasReply: !!safeText(review && review.reviewReply && review.reviewReply.comment),
    pulledAt: nowIso()
  };
}

function findBestReviewQueueMatch(review, queueItems) {
  const reviewTimestamp = new Date(review.updateTime || review.createTime || 0).getTime();
  if (Number.isNaN(reviewTimestamp)) return null;

  let bestMatch = null;
  let bestScore = 0;
  let scoreTied = false;

  queueItems.forEach((item) => {
    if (!item || item.matched) return;
    if (safeText(item.status).toLowerCase() !== 'sent') return;
    if (safeText(item.googleReviewId)) return;

    const sentTimestamp = new Date(item.sentAt || item.queuedAt || 0).getTime();
    if (Number.isNaN(sentTimestamp)) return;
    if (reviewTimestamp + 12 * 60 * 60 * 1000 < sentTimestamp) return;
    if (reviewTimestamp - sentTimestamp > 90 * 24 * 60 * 60 * 1000) return;

    const score = nameMatchScore(item.customerName, review.reviewerName);
    if (score < 70) return;

    if (score > bestScore) {
      bestMatch = item;
      bestScore = score;
      scoreTied = false;
      return;
    }

    if (score === bestScore) scoreTied = true;
  });

  if (!bestMatch || scoreTied) return null;
  return bestMatch;
}

async function matchGoogleBusinessReviews(reviewRecords) {
  const reviewQueueSnap = await db.ref('autoManager/reviews/queue').once('value');
  const reviewQueue = reviewQueueSnap.val() || {};
  const queueItems = Object.keys(reviewQueue).map((key) =>
    Object.assign(
      {
        _key: key
      },
      reviewQueue[key] || {}
    )
  );
  const usedGoogleReviewIds = new Set(
    queueItems.map((item) => safeText(item.googleReviewId)).filter(Boolean)
  );

  let matchedCount = 0;

  for (const review of reviewRecords
    .slice()
    .sort((left, right) => new Date(left.createTime || left.updateTime || 0) - new Date(right.createTime || right.updateTime || 0))) {
    if (!review.reviewId || usedGoogleReviewIds.has(review.reviewId)) continue;

    const match = findBestReviewQueueMatch(review, queueItems);
    if (!match) continue;

    await db.ref(`autoManager/reviews/queue/${match._key}`).update({
      status: 'reviewed',
      reviewedAt: review.updateTime || review.createTime || nowIso(),
      googleReviewId: review.reviewId,
      googleReviewName: review.name,
      googleReviewerName: review.reviewerName,
      googleReviewMatchedAt: nowIso(),
      reviewSource: 'google_business_api',
      backendUpdatedAt: nowIso()
    });

    match.matched = true;
    usedGoogleReviewIds.add(review.reviewId);
    matchedCount += 1;
  }

  return matchedCount;
}

async function syncGoogleBusinessReviewsData() {
  if (!getIntegrationStatus().googleBusinessConfigured) {
    throw new Error('Google Business API credentials are missing');
  }

  const locationName = envText('GOOGLE_BUSINESS_LOCATION_NAME');
  const accessToken = await getGoogleBusinessAccessToken();
  const reviewsResponse = await fetchJson(
    `${GOOGLE_BUSINESS_API_BASE}/${locationName}/reviews?pageSize=${GOOGLE_REVIEW_SYNC_LIMIT}&orderBy=${encodeURIComponent('updateTime desc')}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const reviewRecords = safeArray(reviewsResponse && reviewsResponse.reviews).map(buildGoogleReviewRecord);
  const reviewMap = {};
  reviewRecords.forEach((review) => {
    reviewMap[review.reviewId] = review;
  });

  await db.ref('automationV2/googleBusiness/reviews').set(reviewMap);

  const matchedCount = await matchGoogleBusinessReviews(reviewRecords);
  const summary = {
    locationName,
    averageRating: parseFloat(reviewsResponse.averageRating) || 0,
    totalReviewCount: parseInt(reviewsResponse.totalReviewCount, 10) || reviewRecords.length,
    latestReviewAt: safeText(reviewRecords[0] && (reviewRecords[0].updateTime || reviewRecords[0].createTime)),
    lastSyncAt: nowIso()
  };

  await db.ref('automationV2/googleBusiness/summary').set(summary);
  await updateGoogleBusinessStatus({
    configured: true,
    lastSyncAt: nowIso(),
    lastErrorAt: null,
    lastErrorMessage: '',
    pulledReviewCount: reviewRecords.length,
    matchedCount,
    locationName
  });

  await refreshEngineMetrics();
  await updateEngineStatus({
    lastGoogleBusinessSyncAt: nowIso(),
    googleBusinessMatchedCount: matchedCount
  });

  return {
    pulledReviewCount: reviewRecords.length,
    matchedCount,
    averageRating: summary.averageRating,
    totalReviewCount: summary.totalReviewCount
  };
}

async function replyToGoogleBusinessReview(reviewName, comment) {
  if (!getIntegrationStatus().googleBusinessConfigured) {
    throw new Error('Google Business API credentials are missing');
  }

  const reviewResourceName = safeText(reviewName);
  const replyComment = safeText(comment);
  if (!reviewResourceName) throw new Error('Google review name is required');
  if (!replyComment) throw new Error('Review reply cannot be empty');

  const accessToken = await getGoogleBusinessAccessToken();
  await fetchJson(`${GOOGLE_BUSINESS_API_BASE}/${reviewResourceName}/reply`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: replyComment
    })
  });

  await syncGoogleBusinessReviewsData();

  return {
    reviewName: reviewResourceName,
    replied: true
  };
}

async function syncClientProjection(visitId, before, after, payment) {
  const prevPhone = safeText((await db.ref(`automationV2/index/visitPhones/${visitId}`).once('value')).val());
  const nextPhone = getPhoneForVisit(after);

  if (prevPhone && prevPhone !== nextPhone) {
    const oldClientRef = db.ref(`autoManager/clients/${prevPhone}`);
    const oldSnap = await oldClientRef.once('value');
    if (oldSnap.exists()) {
      const updated = recalcClientProfile(oldSnap.val(), visitId, null, null);
      if (updated.totalVisits > 0) await oldClientRef.set(updated);
      else await oldClientRef.remove();
    }
  }

  if (shouldTrackClient(after)) {
    const clientRef = db.ref(`autoManager/clients/${nextPhone}`);
    const clientSnap = await clientRef.once('value');
    const updated = recalcClientProfile(clientSnap.val(), visitId, after, payment);
    await clientRef.set(updated);
    await db.ref(`automationV2/index/visitPhones/${visitId}`).set(nextPhone);
    await db.ref('autoManager/meta/clientsBuilt').set(true);
    return;
  }

  if (prevPhone) {
    const clientRef = db.ref(`autoManager/clients/${prevPhone}`);
    const clientSnap = await clientRef.once('value');
    if (clientSnap.exists()) {
      const updated = recalcClientProfile(clientSnap.val(), visitId, null, null);
      if (updated.totalVisits > 0) await clientRef.set(updated);
      else await clientRef.remove();
    }
    await db.ref(`automationV2/index/visitPhones/${visitId}`).remove();
  }
}

async function syncReviewProjection(visitId, after, payment, reviewSettings) {
  const reviewRef = db.ref(`autoManager/reviews/queue/${visitId}`);
  const existingSnap = await reviewRef.once('value');
  const existing = existingSnap.val();

  if (shouldQueueReview(after, payment, reviewSettings)) {
    const payload = buildReviewQueueItem(existing, visitId, after, payment);
    if (existing && PRESERVED_REVIEW_STATUSES.has(safeText(existing.status).toLowerCase())) {
      payload.status = existing.status;
    }
    await reviewRef.set(payload);
    return;
  }

  if (existing && !PRESERVED_REVIEW_STATUSES.has(safeText(existing.status).toLowerCase())) {
    await reviewRef.remove();
  }
}

async function syncCommissionProjection(visitId, after, payment, commissionSettings, staffMap) {
  const assignmentRef = db.ref(`autoManager/commissions/assignments/${visitId}`);
  const existingSnap = await assignmentRef.once('value');
  const existing = existingSnap.val();

  if (!shouldAssignCommission(after, payment)) {
    if (existing && !existing.manualOverride) {
      await assignmentRef.remove();
    }
    return;
  }

  const payload = buildCommissionAssignment(existing, visitId, after, payment, commissionSettings, staffMap);
  if (!payload) {
    if (existing && !existing.manualOverride) {
      await assignmentRef.remove();
    }
    return;
  }

  await assignmentRef.set(payload);
}

function productMatchesVisit(product, visit) {
  const linked = safeArray(product && product.linkedServices).map((value) => safeText(value).toLowerCase());
  if (!linked.length) return false;

  const visitIds = safeArray(visit && visit.serviceIds).map((value) => safeText(value).toLowerCase());
  const visitItems = safeArray(visit && visit.items).map((value) => safeText(value).toLowerCase());

  return linked.some((linkedId) => {
    return visitIds.includes(linkedId) || visitItems.some((item) => item.includes(linkedId.replace(/-/g, ' ')) || linkedId.includes(item.replace(/\s+/g, '-')));
  });
}

async function syncInventoryProjection(visitId, after) {
  if (!shouldConsumeInventory(after)) return;
  const productsSnap = await db.ref('autoManager/inventory/products').once('value');
  const products = productsSnap.val() || {};
  const updates = [];

  Object.keys(products).forEach((productId) => {
    const product = products[productId];
    if (!productMatchesVisit(product, after)) return;
    const logKey = `${visitId}__${productId}`;
    updates.push((async () => {
      const logRef = db.ref(`autoManager/inventory/stockLog/${logKey}`);
      const existingLog = await logRef.once('value');
      if (existingLog.exists()) return;

      const usage = Math.max(1, parseFloat(product.usagePerService) || 1);
      await db.ref(`autoManager/inventory/products/${productId}/currentStock`).transaction((current) => {
        const stock = parseFloat(current) || 0;
        return Math.max(0, stock - usage);
      });

      await logRef.set({
        productId,
        productName: safeText(product.name),
        type: 'consumed',
        quantity: -usage,
        reason: 'Backend automation: completed visit',
        paymentKey: visitId,
        timestamp: nowIso(),
        source: 'backend'
      });
    })());
  });

  await Promise.all(updates);
}

async function refreshDailySummaryForDate(dateKeyInput) {
  const dateKey = dayKey(dateKeyInput) || dayKey(nowIso());
  if (!dateKey) return;

  const [visitSnap, paymentSnap, reviewSnap] = await Promise.all([
    db.ref('visits').once('value'),
    db.ref('payments').once('value'),
    db.ref('autoManager/reviews/queue').once('value')
  ]);

  const visits = Object.values(visitSnap.val() || {}).filter((visit) => getVisitDate(visit) === dateKey);
  const payments = Object.values(paymentSnap.val() || {}).filter((payment) => dayKey(payment.date || payment.createdAt) === dateKey);
  const reviewQueue = Object.values(reviewSnap.val() || {}).filter((item) => dayKey(item.queuedAt) === dateKey);

  const completedVisits = visits.filter((visit) => isServiceDelivered(visit)).length;
  const confirmedBookings = visits.filter((visit) => safeText(visit.source) === 'online_booking' && safeText(visit.visitStatus) === 'confirmed').length;
  const walkIns = visits.filter((visit) => safeText(visit.source) !== 'online_booking').length;
  const revenue = payments
    .filter((payment) => SETTLED_PAYMENT_STATUSES.has(safeText(payment.status).toLowerCase()) || payment.isCash)
    .reduce((sum, payment) => sum + roundMoney(payment.amount), 0);
  const pendingPayments = payments.filter((payment) => safeText(payment.status).toLowerCase() === 'pending_verification').length;
  const pendingReviews = reviewQueue.filter((item) => safeText(item.status).toLowerCase() === 'pending').length;

  await db.ref(`automationV2/summaries/daily/${dateKey}`).set({
    date: dateKey,
    totalVisits: visits.length,
    completedVisits,
    confirmedBookings,
    walkIns,
    revenue: roundMoney(revenue),
    pendingPayments,
    pendingReviews,
    generatedAt: nowIso()
  });
}

async function processVisitProjection(visitId, before, after) {
  if (!after) {
    await Promise.all([
      syncClientProjection(visitId, before, null, null),
      db.ref(`autoManager/reviews/queue/${visitId}`).remove(),
      db.ref(`autoManager/commissions/assignments/${visitId}`).remove()
    ]);
    return;
  }

  const [paymentSnap, reviewSettingsSnap, commissionSettingsSnap, staffSnap] = await Promise.all([
    db.ref(`payments/${visitId}`).once('value'),
    db.ref('autoManager/reviews/settings').once('value'),
    db.ref('autoManager/commissions/settings').once('value'),
    db.ref('staff').once('value')
  ]);

  const payment = paymentSnap.val() || {};
  const reviewSettings = reviewSettingsSnap.val() || {};
  const commissionSettings = commissionSettingsSnap.val() || { defaultRate: 40, staffRates: {} };
  const staffMap = staffSnap.val() || {};

  await syncClientProjection(visitId, before, after, payment);
  await syncReviewProjection(visitId, after, payment, reviewSettings);
  await syncCommissionProjection(visitId, after, payment, commissionSettings, staffMap);
  await syncInventoryProjection(visitId, after);
  await refreshDailySummaryForDate(getVisitDate(after) || dayKey(nowIso()));
}

async function auditPendingPayments() {
  const visitsSnap = await db.ref('visits').once('value');
  const visits = visitsSnap.val() || {};
  const now = Date.now();
  const staleThresholdMs = 20 * 60 * 1000;
  const seen = {};

  await Promise.all(
    Object.keys(visits).map(async (visitId) => {
      const visit = visits[visitId];
      const pending = safeText(visit.paymentStatus).toLowerCase() === 'pending_verification';
      const createdAt = new Date(visit.createdAt || nowIso()).getTime();
      if (!pending || Number.isNaN(createdAt) || now - createdAt < staleThresholdMs) {
        await db.ref(`automationV2/alerts/pendingPayments/${visitId}`).remove();
        return;
      }

      seen[visitId] = true;
      const alertRef = db.ref(`automationV2/alerts/pendingPayments/${visitId}`);
      const existing = await alertRef.once('value');
      const staleMinutes = Math.round((now - createdAt) / 60000);

      await alertRef.set({
        visitKey: visitId,
        paymentKey: visit.paymentKey || visitId,
        customerName: safeText(visit.customerName || 'Customer'),
        source: safeText(visit.source),
        staleMinutes,
        createdAt: existing.exists() ? existing.val().createdAt : nowIso(),
        updatedAt: nowIso()
      });

      if (!existing.exists()) {
        await pushOpsNotification(
          'automation_pending_payment',
          'Payment verification is overdue',
          `${safeText(visit.customerName || 'Customer')} has a ${getSourceLabel(visit.source).toLowerCase()} payment waiting ${staleMinutes} minutes.`,
          { visitKey: visitId, source: safeText(visit.source), staleMinutes }
        );
      }
    })
  );

  await updateEngineStatus({ lastPendingAuditAt: nowIso() });
  await refreshEngineMetrics();
}

async function rebuildAllProjections() {
  const visits = (await db.ref('visits').once('value')).val() || {};
  const visitIds = Object.keys(visits);
  let processed = 0;

  for (const visitId of visitIds) {
    await processVisitProjection(visitId, null, visits[visitId]);
    processed += 1;
  }

  await auditPendingPayments();
  await refreshEngineMetrics();
  await updateEngineStatus({
    lastRebuildAt: nowIso(),
    lastRebuildCount: processed
  });
  await db.ref('autoManager/meta/clientsBuilt').set(true);

  return { processed };
}

exports.syncVisitAutomation = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120, memory: '256MB' })
  .database.ref('/visits/{visitId}')
  .onWrite(async (change, context) => {
    const before = change.before.exists() ? change.before.val() : null;
    const after = change.after.exists() ? change.after.val() : null;
    await processVisitProjection(context.params.visitId, before, after);
    await updateEngineStatus({
      lastVisitSyncAt: nowIso(),
      lastVisitKey: context.params.visitId
    });
    await refreshEngineMetrics();
  });

exports.syncInventoryAlerts = functions
  .region(REGION)
  .database.ref('/autoManager/inventory/products/{productId}')
  .onWrite(async (change, context) => {
    const before = change.before.exists() ? change.before.val() : null;
    const after = change.after.exists() ? change.after.val() : null;
    const alertRef = db.ref(`automationV2/alerts/lowStock/${context.params.productId}`);

    if (!after) {
      await alertRef.remove();
      await refreshEngineMetrics();
      return;
    }

    const currentStock = parseFloat(after.currentStock) || 0;
    const threshold = parseFloat(after.reorderThreshold) || 0;
    const isLow = currentStock <= threshold;
    const wasLow = before ? (parseFloat(before.currentStock) || 0) <= (parseFloat(before.reorderThreshold) || 0) : false;

    if (isLow) {
      await alertRef.set({
        productId: context.params.productId,
        productName: safeText(after.name || 'Product'),
        currentStock,
        reorderThreshold: threshold,
        updatedAt: nowIso()
      });
      if (!wasLow) {
        await pushOpsNotification(
          'automation_low_stock',
          'Low stock alert',
          `${safeText(after.name || 'Product')} is at ${currentStock} and needs restocking.`,
          { productId: context.params.productId, currentStock, reorderThreshold: threshold }
        );
      }
    } else {
      await alertRef.remove();
    }

    await updateEngineStatus({ lastInventorySyncAt: nowIso() });
    await refreshEngineMetrics();
  });

exports.auditPendingPayments = functions
  .region(REGION)
  .pubsub.schedule('every 10 minutes')
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    await auditPendingPayments();
    return null;
  });

exports.buildDailyAutomationSummary = functions
  .region(REGION)
  .pubsub.schedule('every day 23:15')
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    const today = dayKey(nowIso());
    await refreshDailySummaryForDate(today);
    await updateEngineStatus({ lastDailySummaryAt: nowIso(), lastDailySummaryKey: today });
    await refreshEngineMetrics();
    await pushOpsNotification(
      'automation_daily_summary',
      'Daily automation summary updated',
      `Automation summary for ${today} is ready in the admin panel.`,
      { date: today }
    );
    return null;
  });

exports.syncGoogleBusinessReviews = functions
  .region(REGION)
  .pubsub.schedule('every 30 minutes')
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    if (!getIntegrationStatus().googleBusinessConfigured || !envBool('GOOGLE_BUSINESS_AUTO_SYNC', true)) {
      await updateGoogleBusinessStatus({
        configured: getIntegrationStatus().googleBusinessConfigured,
        lastSkippedAt: nowIso(),
        lastSkipReason: getIntegrationStatus().googleBusinessConfigured ? 'auto_sync_disabled' : 'missing_configuration'
      });
      await updateEngineStatus({ lastGoogleBusinessSyncAt: nowIso() });
      return null;
    }

    try {
      await syncGoogleBusinessReviewsData();
    } catch (error) {
      await updateGoogleBusinessStatus({
        lastErrorAt: nowIso(),
        lastErrorMessage: error.message
      });
      throw error;
    }

    return null;
  });

exports.whatsappWebhook = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(async (request, response) => {
    if (request.method === 'GET') {
      const mode = safeText(request.query['hub.mode']);
      const verifyToken = safeText(request.query['hub.verify_token']);
      const challenge = safeText(request.query['hub.challenge']);

      if (mode === 'subscribe' && verifyToken && verifyToken === envText('WHATSAPP_WEBHOOK_VERIFY_TOKEN')) {
        response.status(200).send(challenge);
        return;
      }

      response.status(403).send('Forbidden');
      return;
    }

    if (request.method !== 'POST') {
      response.status(405).send('Method not allowed');
      return;
    }

    if (!verifyWhatsappSignature(request)) {
      response.status(403).send('Invalid signature');
      return;
    }

    const body = request.body || {};
    const receivedAt = nowIso();
    await db.ref('automationV2/integrations/whatsapp/webhooks').push({
      receivedAt,
      payload: body
    });

    const entries = safeArray(body && body.entry);
    for (const entry of entries) {
      const changes = safeArray(entry && entry.changes);
      for (const change of changes) {
        const value = (change && change.value) || {};
        const statuses = safeArray(value && value.statuses);
        const messages = safeArray(value && value.messages);

        for (const status of statuses) {
          await recordWhatsappStatusEvent(status);
        }

        for (const message of messages) {
          await recordWhatsappInboundMessage(message, value);
        }
      }
    }

    response.status(200).send('EVENT_RECEIVED');
  });

exports.processAutomationCommand = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .database.ref('/automationV2/commands/{commandId}')
  .onCreate(async (snapshot, context) => {
    const command = snapshot.val() || {};
    const commandRef = snapshot.ref;
    const type = safeText(command.type).toLowerCase();

    await commandRef.update({
      status: 'running',
      startedAt: nowIso()
    });

    try {
      let result = {};

      if (type === 'rebuild_projections') {
        result = await rebuildAllProjections();
      } else if (type === 'refresh_metrics') {
        await refreshEngineMetrics();
        result = { refreshed: true };
      } else if (type === 'refresh_daily_summary') {
        const targetDate = dayKey(command.date) || dayKey(nowIso());
        await refreshDailySummaryForDate(targetDate);
        result = { date: targetDate };
      } else if (type === 'audit_pending_payments') {
        await auditPendingPayments();
        result = { audited: true };
      } else if (type === 'send_review_request') {
        result = await sendReviewRequest(
          safeText(command.reviewKey || command.queueKey || command.visitKey || context.params.commandId)
        );
      } else if (type === 'sync_google_business_reviews') {
        result = await syncGoogleBusinessReviewsData();
      } else if (type === 'reply_google_review') {
        result = await replyToGoogleBusinessReview(command.reviewName, command.comment);
      } else {
        throw new Error(`Unsupported command type: ${type || 'unknown'}`);
      }

      await commandRef.update({
        status: 'completed',
        completedAt: nowIso(),
        result
      });

      await updateEngineStatus({
        lastCommandAt: nowIso(),
        lastCommandType: type,
        lastCommandStatus: 'completed'
      });

      if (!['send_review_request', 'sync_google_business_reviews', 'reply_google_review'].includes(type)) {
        await pushOpsNotification(
          'automation_command_completed',
          'Automation command completed',
          `${type.replace(/_/g, ' ')} finished successfully.`,
          { commandId: context.params.commandId, type, result }
        );
      }
    } catch (error) {
      await commandRef.update({
        status: 'failed',
        failedAt: nowIso(),
        error: error.message
      });

      await updateEngineStatus({
        lastCommandAt: nowIso(),
        lastCommandType: type,
        lastCommandStatus: 'failed',
        lastErrorAt: nowIso(),
        lastErrorMessage: error.message
      });

      await pushOpsNotification(
        'automation_command_failed',
        'Automation command failed',
        error.message,
        { commandId: context.params.commandId, type }
      );

      throw error;
    }
  });

// ============================================
// SHARED PAYMENT MATCHER
// ============================================
// Used by both verifyIncomingPayment (manual/email path) and revolutWebhook
// (Revolut Business API path). Smart-amount + 2-hour window matching.
async function processIncomingPayment({ amount, reference, timestamp, source, externalTransactionId }) {
  const incomingAmount = roundMoney(amount);
  const incomingReference = safeText(reference);
  const incomingTimestamp = safeText(timestamp) || nowIso();
  const verificationSource = safeText(source) || 'unknown';

  if (!incomingAmount || incomingAmount <= 0) {
    return { matched: false, reason: 'invalid_amount' };
  }

  const paymentsSnap = await db.ref('payments')
    .orderByChild('status')
    .equalTo('pending')
    .once('value');

  const pending = paymentsSnap.val() || {};
  const matches = [];
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const now = Date.now();

  Object.keys(pending).forEach((key) => {
    const p = pending[key];
    const paymentAmount = roundMoney(p.amount);
    const paymentAge = now - new Date(p.createdAt || nowIso()).getTime();
    if (Math.abs(paymentAmount - incomingAmount) < 0.005 && paymentAge < twoHoursMs) {
      matches.push({ key, payment: p, age: paymentAge });
    }
  });

  if (matches.length === 0) {
    await db.ref('automationV2/unmatchedPayments').push({
      amount: incomingAmount,
      reference: incomingReference,
      receivedAt: incomingTimestamp,
      loggedAt: nowIso(),
      source: verificationSource,
      externalTransactionId: externalTransactionId || null
    });
    return { matched: false, reason: 'no_matching_pending_payment', amount: incomingAmount };
  }

  // FIFO — oldest pending wins
  matches.sort((a, b) => b.age - a.age);
  const match = matches[0];
  const confirmedAt = nowIso();

  await db.ref('payments/' + match.key).update({
    status: 'confirmed',
    confirmedAt,
    verifiedAmount: incomingAmount,
    verificationMethod: 'auto',
    verificationSource,
    bankReference: incomingReference || null,
    externalTransactionId: externalTransactionId || null
  });

  const visitSnap = await db.ref('visits/' + match.key).once('value');
  const visit = visitSnap.val();
  if (visit) {
    const nextStatus = visit.source === 'online_booking' ? 'confirmed' : 'completed';
    await db.ref('visits/' + match.key).update({
      paymentStatus: 'confirmed',
      visitStatus: nextStatus,
      verifiedAmount: incomingAmount,
      confirmedAt,
      verificationMethod: 'auto',
      verificationSource,
      requiresManagerVerification: false
    });
  }

  await pushOpsNotification(
    'payment_auto_confirmed',
    'Payment auto-verified',
    `£${incomingAmount.toFixed(2)} matched to ${safeText(match.payment.customerName || 'walk-in')} via ${verificationSource}`,
    { paymentKey: match.key, amount: incomingAmount, source: verificationSource }
  );

  if (matches.length > 1) {
    await db.ref('automationV2/logs/smartAmountCollisions').push({
      amount: incomingAmount,
      matchCount: matches.length,
      selectedKey: match.key,
      source: verificationSource,
      loggedAt: nowIso()
    });
  }

  return {
    matched: true,
    paymentKey: match.key,
    amount: incomingAmount,
    customerName: safeText(match.payment.customerName),
    items: match.payment.items || []
  };
}

// ============================================
// PAYMENT VERIFICATION WEBHOOK (manual / email parser path)
// ============================================
// POST { amount, reference?, timestamp? } with x-api-key header
exports.verifyIncomingPayment = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 30, memory: '256MB' })
  .https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    if (request.method === 'OPTIONS') { response.status(204).send(''); return; }

    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const apiKey = safeText(request.headers['x-api-key'] || request.query.key);
    const expectedKey = envText('PAYMENT_VERIFY_API_KEY');
    if (!expectedKey || apiKey !== expectedKey) {
      response.status(403).json({ error: 'Invalid API key' });
      return;
    }

    const body = request.body || {};
    const result = await processIncomingPayment({
      amount: body.amount,
      reference: body.reference,
      timestamp: body.timestamp,
      source: safeText(body.source) || 'manual_webhook',
      externalTransactionId: safeText(body.transactionId)
    });

    if (result.matched) {
      response.status(200).json(result);
    } else {
      response.status(200).json({ matched: false, reason: result.reason });
    }
  });

// ============================================
// REVOLUT BUSINESS WEBHOOK
// ============================================
// Configure in Revolut Business: Settings → APIs → Webhooks
//   URL: https://<region>-<project>.cloudfunctions.net/revolutWebhook
//   Events: TransactionCreated, TransactionStateChanged
// Set REVOLUT_WEBHOOK_SECRET env var to the signing secret Revolut gives you.
// Signature scheme: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
//   Header: Revolut-Request-Timestamp
//   Header: Revolut-Signature: v1=<hex>[,v1=<hex>] (multiple during rotation)
exports.revolutWebhook = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 30, memory: '256MB' })
  .https.onRequest(async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const webhookSecret = envText('REVOLUT_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('REVOLUT_WEBHOOK_SECRET not configured');
      response.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    const signatureHeader = safeText(request.headers['revolut-signature']);
    const timestampHeader = safeText(request.headers['revolut-request-timestamp']);

    if (!signatureHeader || !timestampHeader) {
      response.status(401).json({ error: 'Missing signature headers' });
      return;
    }

    // Replay protection: reject timestamps older than 5 minutes
    const timestampMs = parseInt(timestampHeader, 10);
    if (!timestampMs || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
      response.status(401).json({ error: 'Stale or invalid timestamp' });
      return;
    }

    const rawBody = (request.rawBody || Buffer.from(JSON.stringify(request.body || {}))).toString('utf8');
    const expectedSignature = 'v1=' + crypto.createHmac('sha256', webhookSecret)
      .update(timestampHeader + '.' + rawBody)
      .digest('hex');

    const providedSignatures = signatureHeader.split(',').map((sig) => sig.trim()).filter(Boolean);
    const signatureMatches = providedSignatures.some((sig) => {
      const a = Buffer.from(sig);
      const b = Buffer.from(expectedSignature);
      if (a.length !== b.length) return false;
      try { return crypto.timingSafeEqual(a, b); } catch (_) { return false; }
    });

    if (!signatureMatches) {
      response.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const body = request.body || {};
    const event = safeText(body.event);
    const data = body.data || {};

    // Audit every accepted webhook
    await db.ref('automationV2/integrations/revolut/webhooks').push({
      event,
      transactionId: safeText(data.id),
      state: safeText(data.state),
      receivedAt: nowIso(),
      payload: body
    });

    // Only process completed transaction events
    if (event !== 'TransactionCreated' && event !== 'TransactionStateChanged') {
      response.status(200).json({ ignored: true, reason: 'event_not_relevant' });
      return;
    }

    if (safeText(data.state).toLowerCase() !== 'completed') {
      response.status(200).json({ ignored: true, reason: 'transaction_not_completed' });
      return;
    }

    // Find an incoming GBP leg (positive amount). Outgoing sweeps to Barclays
    // will have negative amounts and be ignored automatically.
    const legs = safeArray(data.legs);
    const incomingLeg = legs.find((leg) => {
      return roundMoney(leg && leg.amount) > 0
        && safeText(leg && leg.currency).toUpperCase() === 'GBP';
    });

    if (!incomingLeg) {
      response.status(200).json({ ignored: true, reason: 'no_incoming_gbp_leg' });
      return;
    }

    const result = await processIncomingPayment({
      amount: roundMoney(incomingLeg.amount),
      reference: safeText(data.reference || incomingLeg.description),
      timestamp: safeText(data.completed_at) || nowIso(),
      source: 'revolut_webhook',
      externalTransactionId: safeText(data.id)
    });

    response.status(200).json(result);
  });
