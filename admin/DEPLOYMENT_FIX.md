# Deployment Fix Guide for Admin Panel

## Problem
The admin panel was getting "Failed to fetch" errors when trying to connect to the main site's API endpoints (`/api/robots` and `/api/gallery`).

## Root Causes

### Local Development
- **Admin app** runs on port 3001
- **Main app** runs on port 3000
- Admin needs to fetch from main app's API at `http://localhost:3000`
- Both apps must be running simultaneously

### Production Deployment
- Admin panel deployed at `https://rawwebsiteadmin.vercel.app`
- Main site deployed at `https://rawwebsite-seven.vercel.app`
- Admin needs to fetch from main site's API
- CORS must be properly configured

## Solutions Implemented

### 1. Enhanced Error Handling
Added detailed logging to track:
- Request URLs
- Response status codes
- Network errors
- CORS issues

### 2. Environment Configuration

#### Local Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
```

### 3. Updated Fetch Calls
Added proper headers and error handling:
```typescript
const response = await fetch(url, {
  method: 'GET/POST/PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors',
  credentials: 'omit',
});
```

## Deployment Steps for Vercel

### Main Site (rawwebsite-seven.vercel.app)
1. Ensure all API routes are deployed:
   - `/api/robots` (GET, POST)
   - `/api/robots/[id]` (GET, PATCH, DELETE)
   - `/api/gallery` (GET, POST)
   - `/api/gallery/[id]` (GET, PATCH, DELETE)

2. Set environment variables in Vercel Dashboard:
   ```
   
   OPENROUTER_API_KEY=your_key_here
   NEXT_PUBLIC_SITE_URL=https://rawwebsite-seven.vercel.app
   NEXT_PUBLIC_ADMIN_URL=https://rawwebsiteadmin.vercel.app
   NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
   ```

3. Verify CORS is enabled in all API routes (already implemented)

### Admin Panel (rawwebsiteadmin.vercel.app)
1. Set environment variables in Vercel Dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
   MONGODB_URI=mongodb+srv://teamraw:TeamRaw@cluster0.jroqyqd.mongodb.net/?appName=Cluster0
   JWT_SECRET=8fQ9zRkM2H7VdP4A6XWJmC5SBNLqE0Yt1UoIeKRaGZsFhDw3j
   EMAIL_USER=teamraw@sfit.ac.in
   EMAIL_PASS=ifklepbqakgfubfi
   NEXT_PUBLIC_ADMIN_URL=https://rawwebsiteadmin.vercel.app
   NODE_ENV=production
   ```

2. Redeploy the admin panel after setting environment variables

## Testing

### Local Testing
1. Start main app: `npm run dev` (runs on port 3000)
2. Start admin app: `cd admin && npm run dev` (runs on port 3001)
3. Open admin at `http://localhost:3001`
4. Check browser console for detailed logs
5. Try creating/editing a robot or gallery item

### Production Testing
1. Open browser developer tools (F12)
2. Go to admin panel: `https://rawwebsiteadmin.vercel.app`
3. Check Console tab for any errors
4. Check Network tab to see:
   - Request URLs (should go to rawwebsite-seven.vercel.app)
   - Response status codes
   - CORS headers
5. Try CRUD operations on robots/gallery

## Common Issues & Solutions

### Issue: "Failed to fetch" in local development
**Solution**: Make sure BOTH apps are running:
- Main app on port 3000
- Admin app on port 3001

### Issue: "Failed to fetch" in production
**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check that main site is accessible and not returning errors
3. Verify CORS headers are present in API responses
4. Check Network tab in browser DevTools for actual error

### Issue: CORS errors
**Solution**: All API routes already have CORS headers:
```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### Issue: Environment variables not working
**Solution**: 
1. Restart dev server after changing .env.local
2. In Vercel, redeploy after updating environment variables
3. Variables starting with `NEXT_PUBLIC_` are exposed to browser

## Verification Checklist

- [ ] Main app running on http://localhost:3000 (local)
- [ ] Admin app running on http://localhost:3001 (local)
- [ ] .env.local files configured correctly
- [ ] Can fetch robots/gallery in local admin panel
- [ ] Can create/edit/delete items in local admin panel
- [ ] Main site API accessible at https://rawwebsite-seven.vercel.app/api/robots
- [ ] Admin panel environment variables set in Vercel
- [ ] Admin panel redeployed after env var changes
- [ ] Can fetch robots/gallery in production admin panel
- [ ] No CORS errors in browser console
- [ ] Can create/edit/delete items in production admin panel

## Files Modified

1. `admin/src/app/dashboard/robots-gallery/page.tsx` - Enhanced error handling and logging
2. `admin/.env.local` - Set to use localhost:3000 for development
3. `admin/.env.production` - Configured for production deployment
4. `.env.production` - Added NEXT_PUBLIC_API_URL for main site

## Next Steps

1. **Local Development**: Test the admin panel with both apps running
2. **Production**: Update Vercel environment variables and redeploy
3. **Monitor**: Check browser console logs for detailed error information
4. **Optimize**: Once working, you can remove some console.log statements if desired
