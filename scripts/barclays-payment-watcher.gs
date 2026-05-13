/**
 * Golden Barbers - Barclays "money in" email watcher
 *
 * Runs every minute inside goldenbarbers.payments@gmail.com (Apps Script
 * time-driven trigger). Scans new Barclays notification emails, extracts
 * amount + reference, POSTs to verifyIncomingPayment Cloud Function which
 * runs the smart-amount FIFO matcher and confirms the booking/visit.
 *
 * IDEMPOTENT: each POST carries a stable transactionId derived from the
 * Gmail message ID, so duplicate runs (Apps Script retries, or Push layer
 * firing on the same email) cannot double-confirm a payment. The Cloud
 * Function's processedTransactions guard handles dedup server-side.
 *
 * RELIABILITY: every processed message gets the "barclays-processed" label.
 * Anything that fails to parse goes into "barclays-unparsed" for review.
 * The script never deletes mail - read-only side effects only.
 *
 * INSTALL:
 *   1. Sign into goldenbarbers.payments@gmail.com
 *   2. script.google.com -> New Project -> paste this file as Code.gs
 *   3. Save (Ctrl+S), name the project "Barclays Payment Watcher"
 *   4. Triggers -> Add Trigger ->
 *        Function: checkBarclaysPayments
 *        Source: Time-driven
 *        Type: Minutes timer
 *        Interval: Every minute
 *   5. Authorize on first run (gmail.readonly + external request scopes)
 */

const FIREBASE_URL = 'https://europe-west1-golden-barbers-e25db.cloudfunctions.net/verifyIncomingPayment';
const API_KEY = 'e0pVZrSP3jkquGtiqW7eR4XkZVT8Hb9mnEsTvEBlrhc';

// Tune to whatever sender Barclays uses for "money in" notifications.
// Keep broad initially so we capture whatever the real template looks like,
// then narrow once we've seen a sample.
const SEARCH_QUERY = 'from:(barclays.co.uk OR barclays.com OR barclays-uk.com) is:unread newer_than:2d -label:barclays-processed -label:barclays-unparsed';

const LABEL_PROCESSED = 'barclays-processed';
const LABEL_UNPARSED  = 'barclays-unparsed';
const MAX_THREADS_PER_RUN = 20;

const DRY_RUN = false;

function checkBarclaysPayments() {
  const labelProcessed = getOrCreateLabel(LABEL_PROCESSED);
  const labelUnparsed  = getOrCreateLabel(LABEL_UNPARSED);

  const threads = GmailApp.search(SEARCH_QUERY, 0, MAX_THREADS_PER_RUN);
  if (!threads.length) return;

  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      if (message.getLabels().some(function(l) {
        return l.getName() === LABEL_PROCESSED || l.getName() === LABEL_UNPARSED;
      })) return;

      const body = message.getPlainBody() || '';
      const amount = extractAmount(body);
      const reference = extractReference(body);
      const messageId = message.getId();

      if (!amount) {
        console.warn('No amount parsed', messageId, body.slice(0, 400));
        thread.addLabel(labelUnparsed);
        return;
      }

      if (DRY_RUN) {
        console.log('DRY_RUN', { amount: amount, reference: reference, messageId: messageId });
        return;
      }

      const payload = {
        amount: amount,
        reference: reference,
        timestamp: message.getDate().toISOString(),
        source: 'apps_script_poll',
        transactionId: 'gmail:' + messageId
      };

      try {
        const response = UrlFetchApp.fetch(FIREBASE_URL, {
          method: 'post',
          contentType: 'application/json',
          headers: { 'x-api-key': API_KEY },
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        });
        const code = response.getResponseCode();
        const text = response.getContentText();
        console.log('Posted', amount, reference, code, text);

        if (code >= 200 && code < 300) {
          thread.addLabel(labelProcessed);
          message.markRead();
        } else {
          console.error('Non-2xx response, leaving for retry', code, text);
        }
      } catch (err) {
        console.error('Fetch failed, leaving for retry', err && err.message);
      }
    });
  });
}

function extractAmount(body) {
  // £ is the Unicode pound-sign escape, used in place of the literal
  // character so this file stays pure ASCII and cannot get mangled by
  // copy-paste through editors with different default encodings.
  const patterns = [
    /(?:Amount|Received|You have received|paid in|credited)[^\d£]*£\s*([\d,]+\.\d{2})/i,
    /£\s*([\d,]+\.\d{2})\s+(?:has been credited|received|paid in|landed|deposited)/i,
    /£\s*([\d,]+\.\d{2})/
  ];
  for (let i = 0; i < patterns.length; i++) {
    const m = body.match(patterns[i]);
    if (m) {
      const value = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(value) && value > 0) return value;
    }
  }
  return null;
}

function extractReference(body) {
  const patterns = [
    /Reference[:\s]+([A-Z0-9\-_ ]{2,40})/i,
    /Ref\.?[:\s]+([A-Z0-9\-_ ]{2,40})/i,
    /From[:\s]+([^\n\r]{2,60})/i
  ];
  for (let i = 0; i < patterns.length; i++) {
    const m = body.match(patterns[i]);
    if (m) return m[1].trim();
  }
  return '';
}

function getOrCreateLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

/**
 * Manual one-shot for testing - call from the Apps Script editor.
 * Searches for a Barclays email, parses it, logs what WOULD be posted.
 */
function dryRunOnce() {
  const threads = GmailApp.search('from:(barclays.co.uk OR barclays.com OR barclays-uk.com)', 0, 5);
  if (!threads.length) {
    console.log('No Barclays emails found in inbox.');
    return;
  }
  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      const body = message.getPlainBody() || '';
      console.log('--- Message', message.getId(), '---');
      console.log('Subject:', message.getSubject());
      console.log('Amount parsed:', extractAmount(body));
      console.log('Reference parsed:', extractReference(body));
      console.log('First 300 chars of body:', body.slice(0, 300));
    });
  });
}
