/**
 * Google Apps Script to handle submissions from the snow blowing giveaway form.
 * It records entries in a Google Sheet and does not send confirmation emails.
 */
const GIVEAWAY_SHEET_ID = 'YOUR_GIVEAWAY_SHEET_ID';

function doPost(e) {
  const params = e.parameter;
  // Honeypot: ignore submissions that fill out the hidden field
  if (params.company && params.company.trim() !== '') {
    return ContentService.createTextOutput('ok');
  }
  const sheet = SpreadsheetApp.openById(GIVEAWAY_SHEET_ID).getSheetByName('Entries');
  const timestamp = new Date();
  const row = [
    timestamp,
    params.name || '',
    params.mobile || '',
    params.email || '',
    params.address || '',
    params.zip || '',
    params.town || '',
    params.source || ''
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput('success');
}