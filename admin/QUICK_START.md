# Quick Start Guide - Fixed Issues

## ✅ Fixed Issues

### 1. "Failed to fetch" Error
**Problem**: Admin panel couldn't connect to main app's API
**Solution**: 
- Enhanced error handling with detailed logging
- Configured environment variables correctly
- Added proper CORS headers
- Started main app on port 3000

### 2. Multiple Images Not Saving
**Problem**: Gallery items with multiple images weren't being saved/loaded
**Solution**:
- Updated API routes to support `images[]` array
- Added support for extended fields (detailedDescription, highlights, location, date, participants)
- Both admin dashboard and main website now fully support multiple images

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js installed
- MongoDB connection string configured
- Both `.env.local` files configured

### Start Both Applications

```bash
# Terminal 1 - Start Main App (Port 3000)
cd C:\Users\admin\Desktop\Task\Raw-main
npm run dev

# Terminal 2 - Start Admin App (Port 3001)
cd C:\Users\admin\Desktop\Task\Raw-main\admin
npm run dev
```

### Access Applications
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Gallery Page**: http://localhost:3000/gallery
- **Robots Gallery**: http://localhost:3000/robots-gallery
- **Admin Dashboard**: http://localhost:3001/dashboard/robots-gallery

## 📝 Creating Gallery Items with Multiple Images

### Step-by-Step Guide

1. **Access Admin Dashboard**
   - Go to http://localhost:3001/dashboard/robots-gallery
   - Login if required
   - Click "Gallery" tab

2. **Click "Add New Gallery Item"**

3. **Fill Required Fields**
   - Title: "Robotics Workshop 2026"
   - Category: Select "Workshops" 
   - Short Description: Brief description
   - Main Image: Upload or drag & drop

4. **Add Multiple Images**
   - Scroll to "Additional Images (Multiple)" section
   - Click to upload multiple images
   - Each image will show a preview
   - Can remove individual images with ✕ button
   - Maximum 5MB per image

5. **Fill Optional Fields**
   - Detailed Description
   - Location
   - Date
   - Participants
   - Highlights (comma-separated)

6. **Save**
   - Click "Save Gallery Item"
   - Wait for success message
   - Check browser console for detailed logs

7. **Verify on Main Site**
   - Go to http://localhost:3000/gallery
   - Find your gallery item
   - Click to open lightbox
   - Navigate through images using arrows
   - Should see image counter (e.g., "2 / 5")

## 🔍 Troubleshooting

### "Failed to fetch" Error

**Check:**
1. Is main app running on port 3000?
   ```bash
   netstat -ano | findstr :3000
   ```

2. Check admin `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Check browser console for detailed error logs:
   - 🔄 Request URL
   - 📦 Payload
   - 📡 Response status
   - ❌ Error message

### Multiple Images Not Appearing

**Check:**
1. Images were uploaded in admin (see preview grid)
2. Save was successful (check success toast)
3. Browser console shows `images` array in payload
4. MongoDB document has `images` field:
   ```javascript
   // Connect to MongoDB and check:
   db.gallery.findOne({ _id: ObjectId("...") })
   // Should have: images: ["base64...", "base64..."]
   ```

### Cannot Connect to MongoDB

**Check:**
1. `.env.local` has correct `MONGODB_URI`
2. MongoDB cluster is accessible
3. IP whitelist includes your IP (or use 0.0.0.0/0)
4. Check terminal logs for connection errors

## 📊 Monitoring

### Browser Console Logs (Enhanced)
When you submit a form or fetch data, you'll see:

```
🔄 Making request to: http://localhost:3000/api/gallery
📦 Payload: {
  "title": "Workshop",
  "imageUrl": "data:image/...",
  "images": ["data:image/...","data:image/..."],
  ...
}
🔧 Method: POST
📡 Response status: 201
📡 Response ok: true
✅ Success: { success: true, message: "..." }
```

### Terminal Logs (API Server)
```
✅ Gallery image created in MongoDB: new ObjectId('...')
POST /api/gallery 201 in 779ms
✅ Gallery images fetched from MongoDB: 1 images
GET /api/gallery 200 in 415ms
```

## 🌐 Production Deployment

### Environment Variables (Vercel Dashboard)

**Admin Panel:**
```
NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

**Main Site:**
```
MONGODB_URI=mongodb+srv://...
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_SITE_URL=https://rawwebsite-seven.vercel.app
NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
```

### Deploy Steps
1. Push code to repository
2. Vercel automatically deploys
3. Set environment variables in Vercel dashboard
4. Redeploy to apply environment changes
5. Test API endpoints
6. Test admin panel CRUD operations

## 📚 Documentation

Refer to these guides for detailed information:

1. **[DEPLOYMENT_FIX.md](DEPLOYMENT_FIX.md)**
   - Complete deployment guide
   - Environment configuration
   - CORS setup
   - Troubleshooting

2. **[MULTIPLE_IMAGES_IMPLEMENTATION.md](MULTIPLE_IMAGES_IMPLEMENTATION.md)**
   - Multiple images feature
   - Data structure
   - API endpoints
   - Testing procedures

## ✅ Success Indicators

Everything is working correctly when:
- [ ] Both apps start without errors
- [ ] Admin can fetch robots/gallery items
- [ ] Can create new gallery item with images
- [ ] Multiple images show in preview grid
- [ ] Save completes successfully
- [ ] Gallery item appears on main website
- [ ] Can click and view all images in lightbox
- [ ] Image counter shows correctly (e.g., "3 / 5")
- [ ] No console errors in either app
- [ ] API logs show successful operations

## 🎯 Current Status

✅ **Local Development**: Fully configured and working
✅ **Error Handling**: Enhanced with detailed logging
✅ **Multiple Images**: Fully supported in API and UI
✅ **Extended Fields**: All metadata fields supported
✅ **CORS**: Properly configured
⚠️ **Production**: Needs environment variables set in Vercel

## 🆘 Need Help?

Check browser console logs (F12) for detailed error information with emojis:
- 🔄 = Request started
- 📦 = Payload/data
- 🔧 = Configuration
- 📡 = Response
- ✅ = Success
- ❌ = Error
