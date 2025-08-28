/**
 * Google Apps Script to accept form submissions from J & R snow landing pages.
 * It writes each submission to a Google Sheet and emails a summary via Resend
 * to designated recipients.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Apps Script project
 * 2. Copy this code into the script editor
 * 3. Click Project Settings (gear icon) and add these Script Properties:
 *    - RESEND_API_KEY: Your Resend API key
 *    - FROM_EMAIL: ted@growwithagp.com
 *    - RECIPIENTS: ted@growwithagp.com (for testing, later update with actual recipients)
 * 4. Deploy as Web App with "Execute as: Me" and "Who has access: Anyone"
 * 5. Copy the deployment URL to use in your form
 */

// Your actual Google Sheet ID
const SHEET_ID = '1xVgNvnLJfzjhyQb7v7zh7chzxS2Fu6fwN_HW9MVJlMI';

// Get configuration from Script Properties
const RESEND_API_KEY = PropertiesService.getScriptProperties().getProperty('RESEND_API_KEY');
const FROM_EMAIL = PropertiesService.getScriptProperties().getProperty('FROM_EMAIL');
const RECIPIENTS = PropertiesService.getScriptProperties().getProperty('RECIPIENTS');

/**
 * Handle POST requests from the HTML forms.
 * @param {Object} e The event object from the request
 * @return {TextOutput} Response to the client
 */
function doPost(e) {
  try {
    const params = e.parameter;
    
    // Honeypot check: if hidden field has value, treat as spam and return OK
    if (params.company && params.company.trim() !== '') {
      return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the correct sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Leads') || spreadsheet.getSheetByName('lead');
    
    if (!sheet) {
      throw new Error('Leads sheet not found');
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const row = [
      timestamp,
      params.name || '',
      params.mobile || '',
      params.email || '',
      params.address || '',
      params.zip || '',
      params.town || '',  // Updated to use town instead of driveway
      params.page || '',
      params.source || ''
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Send email notification
    sendEmail(params);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Compose and send an email with the lead details using Resend.
 * @param {Object} params Form parameters
 */
function sendEmail(params) {
  if (!RESEND_API_KEY || !FROM_EMAIL || !RECIPIENTS) {
    console.log('Email configuration missing, skipping email send');
    return;
  }
  
  const subject = `New Snow Lead – ${params.town || 'Unknown'} – ${params.name}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">New Snow Removal Lead</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Mobile:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.mobile || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.email || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Address:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.address || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>ZIP:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.zip || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Town:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.town || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Source Page:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.page || 'Not provided'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Submitted: ${new Date().toLocaleString()}
      </p>
    </div>
  `;
  
  const textBody = 
    `New Snow Removal Lead\n\n` +
    `Name: ${params.name}\n` +
    `Mobile: ${params.mobile}\n` +
    `Email: ${params.email}\n` +
    `Address: ${params.address}\n` +
    `ZIP: ${params.zip}\n` +
    `Town: ${params.town}\n` +
    `Page: ${params.page}\n` +
    `Source: ${params.source}`;
  
  // Parse recipients
  const recipients = RECIPIENTS.split(',').map((e) => e.trim()).filter(Boolean);
  
  // Resend API call
  const url = 'https://api.resend.com/emails';
  const payload = {
    from: FROM_EMAIL,
    to: recipients,
    subject: subject,
    text: textBody,
    html: htmlBody
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log('Email sent successfully:', response.getContentText());
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * Test function to verify the script is working
 */
function doGet() {
  return ContentService.createTextOutput('J&R Snow Leads Script is running. Use POST method to submit forms.');
}