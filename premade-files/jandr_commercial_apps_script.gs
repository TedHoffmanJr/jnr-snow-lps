/**
 * Google Apps Script to accept form submissions from J & R snow landing pages.
 * It writes each submission to appropriate Google Sheet tabs and emails summaries via Resend.
 * 
 * UPDATED VERSION: Now handles LEADS, GIVEAWAY, and COMMERCIAL entries
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Apps Script project
 * 2. Copy this code into the script editor
 * 3. Click Project Settings (gear icon) and add these Script Properties:
 *    - RESEND_API_KEY: Your Resend API key
 *    - FROM_EMAIL: ted@growwithagp.com
 *    - RECIPIENTS: ted@growwithagp.com (for testing, later update with actual recipients)
 * 4. Deploy as Web App with "Execute as: Me" and "Who has access: Anyone"
 * 5. Copy the deployment URL to use in your forms
 * 
 * GOOGLE SHEET SETUP:
 * - "Leads" tab headers: Timestamp, Name, Mobile, Email, Address, ZIP, Town, Page, Source
 * - "Giveaway" tab headers: Timestamp, Name, Mobile, Email, Town, Page, Source, Consent
 * - "Commercial" tab headers: Timestamp, Business Name, Contact Name, Contact Phone, Contact Email, Business Address, Town, ZIP, Services Needed, Property Details, RFP URL, Page, Source
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
    // - Commercial entries (source: "Commercial-LP") → "Commercial" sheet
    // - All other quote requests → "Leads" sheet
    const isGiveaway = params.source === 'Giveaway';
    const isCommercial = params.source === 'Commercial-LP';
    
    let sheetName;
    if (isGiveaway) {
      sheetName = 'Giveaway';
    } else if (isCommercial) {
      sheetName = 'Commercial';
    } else {
      sheetName = 'Leads';
    }
    
    // Try to find the sheet (case-insensitive)
    let sheet = spreadsheet.getSheetByName(sheetName) || 
                spreadsheet.getSheetByName(sheetName.toLowerCase()) ||
                spreadsheet.getSheetByName('giveaway') ||
                spreadsheet.getSheetByName('commercial') ||
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
    } else if (isCommercial) {
      // Commercial form structure: Timestamp, Business Name, Contact Name, Contact Phone, Contact Email, Business Address, Town, ZIP, Services Needed, Property Details, RFP URL, Page, Source
      row = [
        timestamp,
        params.business_name || '',
        params.contact_name || '',
        params.contact_phone || '',
        params.contact_email || '',
        params.business_address || '',
        params.town || '',
        params.zip || '',
        params.services_needed || '',
        params.property_details || '',
        params.rfp_url || '',
        params.page || '',
        params.source || ''
      ];
    } else {
      // Residential Leads form structure: Timestamp, Name, Mobile, Email, Address, ZIP, Town, Page, Source
      row = [
        timestamp,
        params.name || params.contact_name || '',
        params.mobile || params.contact_phone || '',
        params.email || params.contact_email || '',
        params.address || params.business_address || '',
        params.zip || '',
        params.town || '',
        params.page || '',
        params.source || ''
      ];
    }
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Send email notification for quote requests (not giveaway entries)
    if (!isGiveaway) {
      sendEmailNotification(params, isCommercial);
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully',
      type: sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send email notification via Resend
 * @param {Object} params Form parameters
 * @param {boolean} isCommercial Whether this is a commercial lead
 */
function sendEmailNotification(params, isCommercial) {
  if (!RESEND_API_KEY || !FROM_EMAIL || !RECIPIENTS) {
    console.error('Missing required email configuration');
    return;
  }
  
  try {
    const leadType = isCommercial ? 'COMMERCIAL' : 'RESIDENTIAL';
    const businessName = isCommercial ? params.business_name : '';
    const contactName = params.contact_name || params.name || '';
    const contactPhone = params.contact_phone || params.mobile || '';
    const contactEmail = params.contact_email || params.email || '';
    const address = params.business_address || params.address || '';
    
    let emailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">
        🎯 New ${leadType} Lead - J&R Snow Blowing
      </h2>`;
    
    if (isCommercial) {
      emailBody += `
      <div style="background-color: #f7fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3182ce;">
        <h3 style="color: #1a365d; margin-top: 0;">Business Information</h3>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Business Address:</strong> ${address}</p>
        <p><strong>Town:</strong> ${params.town || ''}</p>
        <p><strong>ZIP:</strong> ${params.zip || ''}</p>
      </div>
      
      <div style="background-color: #edf2f7; padding: 20px; margin: 20px 0; border-left: 4px solid #38a169;">
        <h3 style="color: #1a365d; margin-top: 0;">Services Requested</h3>
        <p><strong>Services Needed:</strong> ${params.services_needed || 'Not specified'}</p>
        ${params.property_details ? `<p><strong>Property Details:</strong><br>${params.property_details}</p>` : ''}
        ${params.rfp_url ? `<p><strong>RFP/Scope Document:</strong> <a href="${params.rfp_url}" target="_blank">${params.rfp_url}</a></p>` : ''}
      </div>`;
    } else {
      emailBody += `
      <div style="background-color: #f7fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3182ce;">
        <h3 style="color: #1a365d; margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Town:</strong> ${params.town || ''}</p>
        <p><strong>ZIP:</strong> ${params.zip || ''}</p>
      </div>`;
    }
    
    emailBody += `
      <div style="background-color: #fed7d7; padding: 15px; margin: 20px 0; border-left: 4px solid #e53e3e;">
        <p style="margin: 0; font-weight: bold;">⚡ Action Required: Contact this lead within 24 hours for best conversion rates!</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
        <p><strong>Source:</strong> ${params.page || 'Unknown'} (${params.source || 'Unknown'})</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </div>`;
    
    const emailPayload = {
      from: FROM_EMAIL,
      to: RECIPIENTS.split(',').map(email => email.trim()),
      subject: `🎯 ${leadType} Lead: ${businessName || contactName} - ${params.town || 'CNY'}`,
      html: emailBody
    };
    
    const response = UrlFetchApp.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(emailPayload)
    });
    
    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      console.error(`Email sending failed with status ${responseCode}: ${response.getContentText()}`);
    } else {
      console.log('Email notification sent successfully');
    }
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw - we don't want email failures to break form submission
  }
}