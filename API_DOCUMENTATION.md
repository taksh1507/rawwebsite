# API Documentation - Robots & Gallery

## Overview
MongoDB-backed API routes for managing robots and gallery content dynamically.

## Base URL
- **Production**: `https://rawwebsite-seven.vercel.app/api`
- **Local Development**: `http://localhost:3000/api`

---

## 🤖 Robots API

### GET /api/robots
Fetch all robots with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category - `competition`, `research`, `development`
- `status` (optional): Filter by status - `active`, `retired`, `development`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "AutoTrace Pro",
      "type": "Line Follower",
      "category": "competition",
      "description": "High-speed autonomous line-following robot",
      "longDescription": "Detailed description...",
      "imageUrl": "https://...",
      "specs": ["8 IR Sensors", "PID Control", "45cm/s Max Speed"],
      "tags": ["Autonomous", "Competition"],
      "features": ["Real-time tracking", "Adaptive speed"],
      "achievements": ["1st Place TechFest 2024"],
      "year": 2024,
      "status": "active",
      "teamLead": "Taksh Gandhi",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/robots
Create a new robot.

**Request Body:**
```json
{
  "name": "RobotName",
  "type": "Robot Type",
  "category": "competition",
  "description": "Short description",
  "longDescription": "Detailed description (optional)",
  "imageUrl": "https://...",
  "specs": ["Spec 1", "Spec 2"],
  "tags": ["Tag 1", "Tag 2"],
  "features": ["Feature 1"],
  "achievements": ["Achievement 1"],
  "year": 2024,
  "status": "active",
  "teamLead": "Name"
}
```

### PATCH /api/robots/[id]
Update an existing robot.

### DELETE /api/robots/[id]
Delete a robot.

---

## 📸 Gallery API

### GET /api/gallery
Fetch all gallery images with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category - `robots`, `events`, `workshops`, `competitions`, `team`, `milestones`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "title": "TechFest 2024",
      "description": "Competition event",
      "imageUrl": "https://...",
      "category": "events",
      "uploadedBy": "Admin",
      "year": 2024,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/gallery
Upload a new gallery image.

**Request Body:**
```json
{
  "title": "Image Title",
  "description": "Description (optional)",
  "imageUrl": "https://...",
  "category": "events",
  "uploadedBy": "Admin",
  "year": 2024
}
```

### PATCH /api/gallery/[id]
Update gallery image details.

### DELETE /api/gallery/[id]
Delete a gallery image.

---

## 🔧 Data Seeding

To populate the database with sample data:

```bash
node scripts/seed-robots-gallery.js
```

This will insert:
- 3 sample robots (competition, research, development)
- 5 sample gallery items (events, workshops, competitions, team, robots)

---

## 🎯 Frontend Integration

The main website uses **DataContext** to fetch data from these APIs:

```tsx
// src/context/DataContext.tsx
const { robots, galleryImages, isLoading } = useGlobalData();
```

**Components using API data:**
- `RobotsGallery.tsx` - Combined view of robots + gallery (filtered by category)
- `RobotsShowcase.tsx` - Robot cards display
- `Gallery.tsx` - Gallery masonry grid

**Admin Panel Components:**
- `/dashboard/robots` - View all robots with filtering
- `/dashboard/gallery` - View all gallery images with filtering

---

## 🌐 CORS Configuration

All API routes include CORS headers for cross-origin access:
```typescript
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

---

## 📝 Data Flow

```
MongoDB Atlas
    ↓
API Routes (/api/robots, /api/gallery)
    ↓
DataContext (src/context/DataContext.tsx)
    ↓
Components (RobotsGallery, Gallery, RobotsShowcase)
    ↓
User Interface
```

---

## 🚀 Testing APIs

### Using curl:

**Get all robots:**
```bash
curl https://rawwebsite-seven.vercel.app/api/robots
```

**Filter by category:**
```bash
curl "https://rawwebsite-seven.vercel.app/api/robots?category=competition"
```

**Create robot:**
```bash
curl -X POST https://rawwebsite-seven.vercel.app/api/robots \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestBot",
    "type": "Test",
    "category": "development",
    "description": "Test robot",
    "imageUrl": "https://example.com/image.jpg",
    "specs": ["Test spec"],
    "tags": ["Test"]
  }'
```

### Using Postman:
Import the collection or manually create requests to the endpoints above.

---

## 🔐 Environment Variables

Required in `.env.local`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app
```

---

## 📊 Database Collections

### `robots` collection:
- Stores all robot data
- Indexed by: category, status, year

### `gallery` collection:
- Stores all gallery images
- Indexed by: category, year

---

## ⚠️ Notes

1. **Image Storage**: Currently uses URL strings. For file uploads, integrate Cloudinary or similar service.
2. **Authentication**: Admin API routes will need authentication middleware in production.
3. **Validation**: Add comprehensive validation for user inputs.
4. **Rate Limiting**: Implement rate limiting for production API.
