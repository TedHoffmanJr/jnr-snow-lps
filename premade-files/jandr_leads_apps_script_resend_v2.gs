/**
 * Google Apps Script to accept form submissions from J & R snow landing pages.
 * It writes each submission to a Google Sheet and emails a summary via Resend
 * to designated recipients. The Resend API key and list of recipients should
 * be stored as script properties. See documentation for instructions.
 */

const SHEET_ID = 'YOUR_LEADS_SHEET_ID';
const RESEND_API_KEY = PropertiesService.getScriptProperties().getProperty('RESEND_API_KEY');
const FROM_EMAIL = PropertiesService.getScriptProperties().getProperty('FROM_EMAIL');
const RECIPIENTS = PropertiesService.getScriptProperties().getProperty('RECIPIENTS');

/**
 * Handle POST requests from the HTML forms.
 * @param {Object} e The event object from the request
 * @return {TextOutput} Response to the client
 */
function doPost(e) {
  const params = e.parameter;
  // Honeypot check: if hidden field has value, treat as spam and return OK
  if (params.company && params.company.trim() !== '') {
    return ContentService.createTextOutput('ok');
  }
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Leads');
  const timestamp = new Date();
  const row = [
    timestamp,
    params.name || '',
    params.mobile || '',
    params.email || '',
    params.address || '',
    params.zip || '',
    params.driveway || '',
    params.new_customer ? 'Yes' : 'No',
    params.town || '',
    params.page || '',
    params.source || ''
  ];
  sheet.appendRow(row);
  sendEmail(params);
  return ContentService.createTextOutput('success');
}

/**
 * Compose and send an email with the lead details using Resend.
 * @param {Object} params Form parameters
 */
function sendEmail(params) {
  if (!RESEND_API_KEY || !FROM_EMAIL || !RECIPIENTS) {
    // Missing configuration; skip sending email
    return;
  }
  const subject = `New Snow Lead – ${params.town || ''}`;
  const textBody =
    `A new lead has been submitted:\n\n` +
    `Name: ${params.name}\n` +
    `Mobile: ${params.mobile}\n` +
    `Email: ${params.email}\n` +
    `Address: ${params.address}\n` +
    `ZIP: ${params.zip}\n` +
    `Driveway Type: ${params.driveway}\n` +
    `New Customer: ${params.new_customer ? 'Yes' : 'No'}\n` +
    `Town: ${params.town}\n` +
    `Page: ${params.page}\n` +
    `Source: ${params.source}`;
  const recipients = RECIPIENTS.split(',').map((e) => e.trim()).filter(Boolean);
  const url = 'https://api.resend.com/emails';
  const payload = {
    from: FROM_EMAIL,
    to: recipients,
    subject: subject,
    text: textBody
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + RESEND_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(url, options);
}