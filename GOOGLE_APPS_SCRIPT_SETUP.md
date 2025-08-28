# Google Apps Script Setup Instructions

## Step 1: Create the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Name your project "J&R Snow Leads Handler"
4. Delete the default code and paste the entire contents of: `premade-files/jandr_leads_apps_script_with_giveaway.gs`

## Step 2: Set Script Properties (IMPORTANT)

1. In the Apps Script editor, click the gear icon (Project Settings) on the left sidebar
2. Scroll down to "Script Properties"
3. Click "Add script property" and add these three properties:

   | Property | Value |
   |----------|-------|
   | RESEND_API_KEY | Your actual Resend API key |
   | FROM_EMAIL | ted@growwithagp.com |
   | RECIPIENTS | ted@growwithagp.com |

   **Note**: For testing, RECIPIENTS is set to only your email. When ready for production, update to include all recipients separated by commas.

## Step 3: Deploy as Web App

1. Click "Deploy" → "New Deployment"
2. Click the gear icon and select "Web app"
3. Configure as follows:
   - **Description**: J&R Snow Leads Form Handler
   - **Execute as**: Me (your account)
   - **Who has access**: Anyone
4. Click "Deploy"
5. **COPY THE WEB APP URL** - You'll need this for the form

## Step 4: Update Your Landing Page

1. Update all form URLs in these files:
   - `snow-cicero/index.html`
   - `snow-giveaway/index.html`
   - `snow-giveaway/thanks.html`
2. Find the Google Apps Script URLs and replace with your actual deployed URL from Step 3

## Step 5: Test the Form

1. Start your local server: `python server.py`
2. Visit: http://localhost:8000/snow-cicero/
3. Fill out the form with test data
4. Submit and verify:
   - Data appears in your Google Sheet (Leads tab)
   - Email is sent to ted@growwithagp.com
   - User is redirected to thank you page

## Google Sheet Structure

The script expects your Google Sheet (ID: `1xVgNvnLJfzjhyQb7v7zh7chzxS2Fu6fwN_HW9MVJlMI`) to have:

- A sheet named "Leads" or "lead" with these columns:
  1. Timestamp
  2. Name
  3. Mobile
  4. Email
  5. Address
  6. ZIP
  7. Town
  8. Page
  9. Source

## Troubleshooting

### Form submission fails
- Check browser console for errors
- Verify the Google Apps Script URL is correct
- Check Google Apps Script logs: View → Executions

### Emails not sending
- Verify RESEND_API_KEY is set correctly in Script Properties
- Check that FROM_EMAIL matches your Resend verified domain
- Review Google Apps Script execution logs

### Data not appearing in sheet
- Confirm sheet ID matches: `1xVgNvnLJfzjhyQb7v7zh7chzxS2Fu6fwN_HW9MVJlMI`
- Verify sheet has a tab named "Leads" or "lead"
- Check Google Apps Script permissions

## Production Deployment Notes

For Netlify deployment:
1. The form will work directly with Google Apps Script (no server-side code needed)
2. Update RECIPIENTS in Script Properties to include all notification recipients
3. Consider adding rate limiting or CAPTCHA for spam prevention
4. Monitor Google Apps Script quotas (limited executions per day)

## Security Notes

- The honeypot field (company) helps prevent bot submissions
- Google Apps Script handles CORS automatically
- API keys are stored securely in Script Properties (not in code)
- Consider implementing additional validation in the Apps Script