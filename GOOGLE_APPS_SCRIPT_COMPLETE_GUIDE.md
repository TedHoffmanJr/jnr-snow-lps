# Complete Google Apps Script Setup Guide

## What is Google Apps Script?
Google Apps Script is a cloud-based JavaScript platform that lets you integrate with Google services (Sheets, Gmail, etc.) and external APIs. Think of it as a serverless backend that runs your form processing code.

## Why We're Using It
- **Free**: No hosting costs
- **Integrated**: Direct access to Google Sheets
- **Reliable**: Google's infrastructure
- **Simple**: No server management needed

## Overview of Our Setup
1. **Form submission** → **Google Apps Script** → **Google Sheets** + **Email notification**
2. The script receives form data, saves it to a Google Sheet, and sends you an email via Resend API

---

## Step-by-Step Implementation

### STEP 1: Open Google Sheets and Create Your Lead Tracking Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open the existing sheet with ID `1xVgNvnLJfzjhyQb7v7zh7chzxS2Fu6fwN_HW9MVJlMI`
   - Or create a new sheet if this one doesn't exist
3. Make sure the sheet has these column headers in row 1:
   ```
   A: Timestamp | B: Name | C: Mobile | D: Email | E: Address | F: Town | G: ZIP | H: Source | I: Page
   ```

### STEP 2: Open Google Apps Script

1. From your Google Sheet, click **Extensions** → **Apps Script**
2. This opens the Google Apps Script editor
3. Delete any existing code in `Code.gs`

### STEP 3: Add Your Script Code

1. Copy the entire contents from `premade-files/jandr_leads_apps_script_configured.gs`
2. Paste it into the `Code.gs` file in Apps Script editor
3. **Save** the project (Ctrl+S or File → Save)

### STEP 4: Set Up Script Properties (API Keys)

This is where you store your sensitive API keys securely.

1. In Apps Script editor, click the **Settings** gear icon in the left sidebar
2. Scroll down to **Script Properties**
3. Click **Add script property** and add these three properties:

   **Property 1:**
   - Name: `RESEND_API_KEY`
   - Value: `your_actual_resend_api_key_here`

   **Property 2:**
   - Name: `FROM_EMAIL`
   - Value: `noreply@yourdomain.com` (must be verified in Resend)

   **Property 3:**
   - Name: `RECIPIENTS`
   - Value: `ted@growwithagp.com` (for testing - change later for production)

4. Click **Save script properties**

### STEP 5: Set Permissions and Deploy

1. **Set Permissions:**
   - Click **Review permissions** if prompted
   - Sign in with your Google account
   - Click **Allow** to grant permissions to access Google Sheets and make HTTP requests

2. **Deploy the Script:**
   - Click **Deploy** button (top right)
   - Click **New deployment**
   - Click the gear icon next to "Select type"
   - Choose **Web app**
   - Set these options:
     - Execute as: **Me**
     - Who has access: **Anyone** (important for public form submissions)
   - Click **Deploy**
   - **Copy the web app URL** - you'll need this for the form!

### STEP 6: Update Your Landing Page

1. Open `snow-cicero/index.html`
2. Find this line (around line 480):
   ```javascript
   const response = await fetch('YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_URL', {
   ```
3. Replace `YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_URL` with the URL you copied from step 5
4. Save the file

---

## How to Get Your Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create API Key**
5. Name it something like "J&R Snow Leads"
6. Copy the key and use it in Script Properties above

---

## Testing Your Setup

### Test 1: Check if Script Deploys
1. Go to your deployed web app URL directly in browser
2. You should see: `{"error":"Method not allowed"}`
3. This is good! It means the script is running

### Test 2: Submit Form Data
1. Start your local server: `python -m http.server 3000`
2. Go to `http://localhost:3000/snow-cicero/`
3. Fill out the form with test data
4. Submit the form
5. Check your Google Sheet - new row should appear
6. Check your email - you should receive a notification

### Test 3: Check Error Handling
If something goes wrong, check:
1. **Apps Script Logs**: In Apps Script editor, click **Executions** to see any errors
2. **Browser Console**: Press F12 and check for JavaScript errors
3. **Form Response**: Check if you get success/error message

---

## Understanding the Script

### What the script does:
```javascript
// 1. Receives form data from your website
function doPost(e) {
  // 2. Gets form data from the POST request
  const formData = e.parameter;
  
  // 3. Saves data to Google Sheet
  appendToSheet(formData);
  
  // 4. Sends email notification via Resend
  sendEmailNotification(formData);
  
  // 5. Returns success response
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}));
}
```

### Key functions:
- `doPost()`: Main handler for form submissions
- `appendToSheet()`: Adds form data to Google Sheets
- `sendEmailNotification()`: Sends email via Resend API
- Error handling throughout to catch and log issues

---

## Production Deployment Checklist

Before going live:

### ✅ Google Apps Script
- [ ] Script deployed with public access
- [ ] All Script Properties set with real API keys
- [ ] Test form submission works
- [ ] Google Sheet receives data correctly
- [ ] Email notifications working

### ✅ Landing Page
- [ ] Form URL updated with deployed script URL
- [ ] Form validation working
- [ ] Success/error messages display correctly
- [ ] Mobile responsive

### ✅ Email Setup
- [ ] Resend account verified
- [ ] FROM_EMAIL domain verified in Resend
- [ ] Test emails received successfully
- [ ] RECIPIENTS updated to real email addresses

### ✅ Security
- [ ] API keys stored in Script Properties (not in code)
- [ ] Google Sheet permissions set correctly
- [ ] Honeypot field working to prevent spam

---

## Troubleshooting Common Issues

### "Script function not found"
- Make sure you saved the script after pasting the code
- Try refreshing the Apps Script editor

### "Permission denied"
- Check that the sheet ID in the script matches your actual sheet
- Make sure you granted all permissions when prompted

### "Resend API error"
- Verify your API key is correct in Script Properties
- Check that FROM_EMAIL domain is verified in Resend
- Check Resend dashboard for any account issues

### Form doesn't submit
- Check browser console for JavaScript errors
- Verify the deployed script URL is correct in the form
- Make sure the script is deployed with "Anyone" access

### No data in Google Sheet
- Check Apps Script execution logs for errors
- Verify sheet ID and column structure
- Check that the sheet isn't protected/read-only

---

## Need Help?

1. **Check Apps Script Logs**: Most issues show up in the execution logs
2. **Test Each Part**: Test script deployment, sheet access, email sending separately
3. **Use Browser DevTools**: Check network tab for HTTP errors
4. **Check Resend Dashboard**: Look for delivery issues or API errors

The system is designed to be reliable, but like any integration, it needs proper setup. Take it step by step and test each part as you go!