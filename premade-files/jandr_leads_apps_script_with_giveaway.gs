/**
 * Google Apps Script to accept form submissions from J & R snow landing pages.
 * It writes each submission to a Google Sheet and emails a summary via Resend
 * to designated recipients.
 * 
 * UPDATED VERSION: Now handles both LEADS and GIVEAWAY entries
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
 * 
 * GOOGLE SHEET SETUP:
 * - "Leads" tab headers: Timestamp, Name, Mobile, Email, Address, ZIP, Town, Page, Source
 * - "Giveaway" tab headers: Timestamp, Name, Mobile, Email, Town, Page, Source, Consent
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
    
    // Open the correct sheet based on form source
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // ROUTING LOGIC:
    // - Giveaway entries (source: "Giveaway") → "Giveaway" sheet
    // - All quote requests (source: "LP", "Giveaway-Thanks", etc.) → "Leads" sheet
    const isGiveaway = params.source === 'Giveaway';
    const sheetName = isGiveaway ? 'Giveaway' : 'Leads';
    
    // Try to find the sheet (case-insensitive)
    let sheet = spreadsheet.getSheetByName(sheetName) || 
                spreadsheet.getSheetByName(sheetName.toLowerCase()) ||
                spreadsheet.getSheetByName('giveaway') ||
                spreadsheet.getSheetByName('leads') ||
                spreadsheet.getSheetByName('lead');
    
    if (!sheet) {
      throw new Error(`${sheetName} sheet not found`);
    }
    
    // Prepare the row data based on form type
    const timestamp = new Date();
    let row;
    
    if (isGiveaway) {
      // Giveaway form structure: Timestamp, Name, Mobile, Email, Town, Page, Source, Consent
      row = [
        timestamp,
        params.name || '',
        params.mobile || '',
        params.email || '',
        params.town || '',
        params.page || '',
        params.source || '',
        params.consent || ''
      ];
    } else {
      // Leads form structure: Timestamp, Name, Mobile, Email, Address, ZIP, Town, Page, Source
      row = [
        timestamp,
        params.name || '',
        params.mobile || '',
        params.email || '',
        params.address || '',
        params.zip || '',
        params.town || '',
        params.page || '',
        params.source || ''
      ];
    }
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Send email notification ONLY for quote requests (not giveaway entries)
    if (!isGiveaway) {
      sendEmail(params, isGiveaway);
    }
    
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
 * Compose and send an email with the lead/giveaway details using Resend.
 * @param {Object} params Form parameters
 * @param {boolean} isGiveaway Whether this is a giveaway entry
 */
function sendEmail(params, isGiveaway = false) {
  if (!RESEND_API_KEY || !FROM_EMAIL || !RECIPIENTS) {
    console.log('Email configuration missing, skipping email send');
    return;
  }
  
  // Create appropriate subject line based on source
  let subject;
  if (isGiveaway) {
    subject = `New Giveaway Entry – ${params.town || 'Unknown'} – ${params.name}`;
  } else if (params.source === 'Giveaway-Thanks') {
    subject = `New Quote Request (from Giveaway) – ${params.town || 'Unknown'} – ${params.name}`;
  } else {
    subject = `New Snow Lead – ${params.town || 'Unknown'} – ${params.name}`;
  }
  
  // Determine email body header based on source
  let emailHeader;
  if (isGiveaway) {
    emailHeader = 'New Giveaway Entry';
  } else if (params.source === 'Giveaway-Thanks') {
    emailHeader = 'New Quote Request (from Giveaway Thanks Page)';
  } else {
    emailHeader = 'New Snow Removal Lead';
  }
  
  let htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">${emailHeader}</h2>
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
        </tr>`;
        
  if (!isGiveaway) {
    // Add address and ZIP for leads
    htmlBody += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Address:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.address || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>ZIP:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.zip || 'Not provided'}</td>
        </tr>`;
  }
  
  htmlBody += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Town:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.town || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Source Page:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.page || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Form Type:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.source || 'Not provided'}</td>
        </tr>`;
        
  if (isGiveaway && params.consent) {
    htmlBody += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Consent:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${params.consent}</td>
        </tr>`;
  }
  
  htmlBody += `
      </table>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Submitted: ${new Date().toLocaleString()}
      </p>`;
        
  if (isGiveaway) {
    htmlBody += `
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h3 style="color: #1e3a5f; margin-top: 0;">🎉 Giveaway Entry Details</h3>
        <p style="margin-bottom: 5px;"><strong>Drawing Dates:</strong> September 15, October 1, October 15, 2024</p>
        <p style="margin-bottom: 0;"><strong>Prize:</strong> FREE snow removal all season (up to $500 value)</p>
      </div>`;
  } else if (params.source === 'Giveaway-Thanks') {
    htmlBody += `
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">⚡ High-Intent Lead Alert</h3>
        <p style="margin-bottom: 5px; color: #856404;"><strong>Source:</strong> Customer entered giveaway then immediately requested quote!</p>
        <p style="margin-bottom: 0; color: #856404;"><strong>Note:</strong> Pre-qualified lead - they're already engaged and interested.</p>
      </div>`;
  }
  
  htmlBody += `</div>`;
  
  // Create text body header
  let textBody;
  if (isGiveaway) {
    textBody = `New Giveaway Entry\n\n`;
  } else if (params.source === 'Giveaway-Thanks') {
    textBody = `New Quote Request (from Giveaway Thanks Page)\n\n`;
  } else {
    textBody = `New Snow Removal Lead\n\n`;
  }
    
  textBody += 
    `Name: ${params.name}\n` +
    `Mobile: ${params.mobile}\n` +
    `Email: ${params.email}\n`;
    
  if (!isGiveaway) {
    textBody += 
      `Address: ${params.address}\n` +
      `ZIP: ${params.zip}\n`;
  }
  
  textBody +=
    `Town: ${params.town}\n` +
    `Page: ${params.page}\n` +
    `Source: ${params.source}`;
    
  if (isGiveaway && params.consent) {
    textBody += `\nConsent: ${params.consent}`;
  }
  
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