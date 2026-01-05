# Team RAW Admin Panel - Email Configuration Guide

## Setting Up Gmail for Email Sending

To send emails from the admin panel, you need to configure Gmail with an App Password.

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** section
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to App Passwords: https://myaccount.google.com/apppasswords
2. Select **App**: Mail
3. Select **Device**: Other (Custom name) - Enter "Team RAW Admin"
4. Click **Generate**
5. Copy the 16-character password (shown without spaces)

### Step 3: Configure Environment Variables

#### For Local Development:
Edit `admin/.env.local` and add:
```
EMAIL_USER=teamraw@sfit.ac.in
EMAIL_PASS=abcdefghijklmnop
```
(Replace with your actual email and the 16-character app password)

#### For Vercel Deployment:
1. Go to your Vercel Dashboard
2. Select your **rawwebsiteadmin** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `EMAIL_USER` = `teamraw@sfit.ac.in`
   - `EMAIL_PASS` = Your 16-character app password
5. Redeploy your application

### Step 4: Test Email Functionality

1. Go to Admin Panel → Registrations
2. Select one or more registrations (using checkboxes)
3. Click **📧 Send Email** button
4. Fill in Subject and Message
5. Click **📨 Send Email**

### Important Notes:

- **Never commit** `.env.local` file to Git (it's already in .gitignore)
- Use a dedicated email account (teamraw@sfit.ac.in) for better organization
- App Passwords are more secure than using your regular password
- Each App Password is unique and can be revoked independently
- The email will include Team RAW branding and registration details

### Troubleshooting:

**Error: "Email configuration not found"**
- Make sure EMAIL_USER and EMAIL_PASS are set in environment variables
- Restart your development server after adding variables

**Error: "Invalid login"**
- Verify you're using the App Password, not your regular Gmail password
- Check for typos in the email address
- Ensure 2-Factor Authentication is enabled

**Emails not sending:**
- Check your Gmail account security settings
- Verify the App Password hasn't been revoked
- Check spam folder for test emails
- Review server logs for specific error messages

### Email Template Features:

The email includes:
- Team RAW branding with gradient header
- Personalized greeting with student's name
- Your custom message content
- Registration details (competition, email)
- Professional footer with contact information
- Responsive HTML design

### Usage Tips:

1. **Welcome Email**: Send to newly approved registrations
2. **Updates**: Notify about competition dates, venues, requirements
3. **Reminders**: Send deadline reminders or important announcements
4. **Batch Communication**: Select multiple registrations to send bulk emails

### Security Best Practices:

- Rotate App Passwords periodically
- Monitor sent emails for any unauthorized activity
- Use strong, unique passwords for your Google account
- Keep environment variables secure and never share them
