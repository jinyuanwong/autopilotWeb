# Google Form Setup Guide for Meeting Booking

## Step 1: Create Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with these fields:
   - Full Name (Short answer, Required)
   - Email (Short answer, Required, Email validation)
   - Phone Number (Short answer, Required)
   - Service Interested In (Dropdown or Multiple choice):
     - Free Central Heating Grants
     - Air Source Heat Pumps
     - Insulation Services
     - General Energy Assessment
   - Preferred Date (Short answer)
   - Preferred Time (Short answer, Optional)
   - Additional Message (Paragraph, Optional)

## Step 2: Connect to Google Sheets

1. In your form, click the "Responses" tab
2. Click the Google Sheets icon to create a spreadsheet
3. This will automatically sync all form submissions

## Step 3: Get Form Field IDs

1. Open your form in preview mode
2. Right-click and "Inspect" each field
3. Look for `entry.XXXXXXXXX` in the HTML
4. Note down each field's entry ID:

```javascript
// Your actual field IDs from the Google Form
const formFields = {
    name: 'entry.682685384',           // Full Name field
    email: 'entry.1238611864',         // Email field
    phone: 'entry.1407605129',         // Phone Number field
    service: 'entry.1891032903',       // Service Interest field
    preferredDate: 'entry.152986260',  // Preferred Date field
    preferredTimeHour: 'entry.1449457478_hour',    // Time Hour field
    preferredTimeMinute: 'entry.1449457478_minute', // Time Minute field
    additionalDateYear: 'entry.378052578_year',    // Date Year field
    additionalDateMonth: 'entry.378052578_month',  // Date Month field
    additionalDateDay: 'entry.378052578_day'       // Date Day field
};
```

## Step 4: Get Form URL

1. Click "Send" button in your form
2. Click the link icon
3. Copy the form URL (looks like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`)
4. Extract the FORM_ID part

## Step 5: Update meeting-booking.js

Replace the placeholder values in `meeting-booking.js`:

```javascript
// Replace this line:
this.googleFormBaseUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

// With your actual form URL:
this.googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform';

// And update the field IDs with your actual values
this.formFields = {
    name: 'entry.XXXXXXXXX',      // Your actual field IDs
    email: 'entry.XXXXXXXXX',
    // ... etc
};
```

## Step 6: Set Up Email Notifications (Optional)

1. In Google Forms, go to Settings → Responses
2. Enable "Collect email addresses"
3. Enable "Response receipts" → Always
4. Go to Responses tab → Three dots menu → Get email notifications

## Step 7: Test the Integration

1. Open your chat interface
2. Type "I'd like to book a meeting"
3. Follow the booking flow
4. Verify the pre-filled form opens correctly
5. Submit and check Google Sheets

## Benefits of This Approach

✅ **No API Keys Required** - Works immediately without authentication
✅ **Automatic Data Collection** - All submissions go directly to Google Sheets
✅ **Email Notifications** - Get notified of new bookings instantly
✅ **User-Friendly** - Smooth chat experience with form confirmation
✅ **Free** - Uses Google's free tier
✅ **Scalable** - Can handle unlimited bookings

## Alternative: Direct Submission (Advanced)

If you want to submit directly without opening the form:

```javascript
// Add this method to MeetingBookingHandler class
async submitDirectly() {
    const formData = new FormData();
    
    Object.keys(this.bookingData).forEach(key => {
        if (this.formFields[key]) {
            formData.append(this.formFields[key], this.bookingData[key]);
        }
    });
    
    try {
        // Note: This may be blocked by CORS in browser
        const response = await fetch(this.googleFormBaseUrl.replace('viewform', 'formResponse'), {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        return { success: true, message: 'Booking submitted successfully!' };
    } catch (error) {
        return { success: false, message: 'Please use the form link to complete booking.' };
    }
}
```

## Security Note

- The form IDs are not sensitive information
- No API keys or authentication tokens are exposed
- All data is handled securely by Google
- Consider adding reCAPTCHA to prevent spam submissions