# Contact Form Integration Setup Guide

## Overview
This guide explains how to connect the main website contact form with the admin panel to store and manage contact messages using MongoDB.

## Architecture
- **Main Website**: https://rawwebsite-seven.vercel.app/
- **Admin Panel**: https://rawwebsiteadmin.vercel.app/
- **Database**: MongoDB Atlas

## Setup Instructions

### 1. MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free account or sign in

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set "Database User Privileges" to "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Vercel deployments)
   - Or add specific IPs: `0.0.0.0/0`

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 2. Environment Variables Setup

#### Main Website (.env.local)
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamraw?retryWrites=true&w=majority

# Site URLs
NEXT_PUBLIC_SITE_URL=https://rawwebsite-seven.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://rawwebsiteadmin.vercel.app
```

#### Admin Panel (admin/.env.local)
```env
# MongoDB Connection (Same as main site)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamraw?retryWrites=true&w=majority

# Main Website API URL
NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app

# Admin Panel URL
NEXT_PUBLIC_ADMIN_URL=https://rawwebsiteadmin.vercel.app

# JWT Secret (for admin authentication)
JWT_SECRET=your-secure-random-string-here
```

### 3. Vercel Deployment

#### Main Website Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_ADMIN_URL`
   - `OPENROUTER_API_KEY`
4. Deploy

#### Admin Panel Deployment
1. Create a new project on Vercel
2. Import the `admin` folder from your repository
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_ADMIN_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Deploy

### 4. CORS Configuration (If Needed)

If you encounter CORS errors, add this to your main website's `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://rawwebsiteadmin.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

## How It Works

### Contact Form Submission Flow
1. User fills out contact form on main website
2. Form data is sent to `/api/contact/messages` (POST)
3. API validates the data
4. Data is stored in MongoDB `contacts` collection
5. Success response is sent back to user

### Admin Panel Retrieval Flow
1. Admin opens contact messages page
2. Admin panel fetches data from main website API: `GET https://rawwebsite-seven.vercel.app/api/contact/messages`
3. Messages are displayed in admin dashboard
4. Admin can mark as read/unread, delete, or view details

### API Endpoints

#### Main Website (https://rawwebsite-seven.vercel.app)
- `POST /api/contact/messages` - Submit new contact message
- `GET /api/contact/messages` - Get all contact messages
- `GET /api/contact/messages/[id]` - Get specific message
- `PATCH /api/contact/messages/[id]` - Update message status
- `DELETE /api/contact/messages/[id]` - Delete message

## Testing

### Local Development
1. **Main Website**: Run on `http://localhost:3000`
   ```bash
   npm run dev
   ```

2. **Admin Panel**: Run on `http://localhost:3001`
   ```bash
   cd admin
   npm run dev -- -p 3001
   ```

3. Update `.env.local` files to use local URLs:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Production Testing
1. Submit a test message on the contact form
2. Log in to admin panel
3. Check if message appears in Contact Messages section
4. Test mark as read/unread functionality
5. Test delete functionality

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check if IP whitelist includes `0.0.0.0/0`
- Ensure database user has proper permissions

### CORS Errors
- Add CORS headers to `next.config.ts`
- Verify `NEXT_PUBLIC_API_URL` is set correctly in admin panel

### Environment Variables Not Working
- Restart development server after changing `.env.local`
- On Vercel, redeploy after updating environment variables
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access

### Data Not Showing in Admin Panel
- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` points to main website
- Test API endpoint directly: `https://rawwebsite-seven.vercel.app/api/contact/messages`

## Security Considerations

1. **Never commit `.env.local` files to Git**
   - Already added to `.gitignore`

2. **Use strong JWT secrets**
   - Generate with: `openssl rand -base64 32`

3. **MongoDB security**
   - Use strong passwords
   - Restrict IP access when possible
   - Enable MongoDB Atlas security features

4. **API authentication**
   - Consider adding API key authentication
   - Rate limit contact form submissions
   - Implement CAPTCHA for spam prevention

## Support

For issues or questions:
- Email: takshgandhi4@gmail.com
- Check API logs in Vercel dashboard
- Review MongoDB Atlas logs

---

Last Updated: January 2, 2026
