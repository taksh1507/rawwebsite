# 🚀 Quick Start Guide - Latest Updates Feature

## Getting Started in 3 Steps

### Step 1: Test the Admin Panel

```bash
# Navigate to admin folder
cd admin

# Install dependencies (if needed)
npm install

# Start admin server
npm run dev
```

Open: `http://localhost:3001/dashboard/updates`

### Step 2: Create Your First Update

1. Click **"+ New Update"**
2. Fill in the form:
   ```
   Title: "Welcome to RAW Robotics!"
   Description: "Join us for exciting robotics competitions and workshops"
   Category: Announcement
   Priority: High
   ```
3. Scroll to **"User Action Settings"**:
   ```
   Action Type: View Details
   CTA Button Label: Learn More
   ```
4. Click **"Create Update"**

### Step 3: View on Website

```bash
# Navigate to main project folder
cd ..

# Install dependencies (if needed)
npm install

# Start main server
npm run dev
```

Open: `http://localhost:3000`

Wait 1.5 seconds → Updates popup appears! 🎉

---

## Quick Examples

### Example 1: Competition Registration
```
Title: "TechFest 2026 - Register Now!"
Description: "India's biggest robotics competition. Win prizes worth ₹5 lakhs!"
Category: Event
Priority: High
Action Type: Open External Link
External Link URL: https://forms.google.com/techfest2026
CTA Button Label: Register Now
```

**Result:** Users see a "Register Now" button that opens the form in a new tab.

---

### Example 2: Achievement Showcase
```
Title: "Team Wins National Championship"
Description: "Our team secured 1st place at the National Robotics Championship 2026!"
Category: Achievement
Priority: High
Action Type: View Details
CTA Button Label: View Photos
Image URL: https://example.com/team-victory.jpg
```

**Result:** Users see a "View Photos" button that opens a full modal with the image.

---

### Example 3: Simple Announcement
```
Title: "Workshop Rescheduled"
Description: "Python workshop moved to next Saturday at 2 PM"
Category: Announcement
Priority: Medium
Action Type: None
```

**Result:** Users see the update card without any action button.

---

## Testing on Mobile

1. Open browser DevTools (F12)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or any mobile device
4. Refresh page
5. Click "View" button → Modal goes full-screen! 📱

---

## Pro Tips

### 1. Update Priority
- **High**: Red accent bar (important announcements)
- **Medium**: Gray accent bar (standard updates)
- **Low**: Gray accent bar (minor updates)

### 2. CTA Button Labels
- Registration: "Register Now", "Sign Up"
- Events: "Learn More", "View Details"
- External sites: "Visit Website", "Open Link"
- Galleries: "View Photos", "See Gallery"

### 3. Image Best Practices
- Recommended size: 1200x675px (16:9 ratio)
- Format: JPG or PNG
- Max size: < 500KB for fast loading
- Host on CDN for better performance

---

## Common Tasks

### Toggle Update Visibility
Click the eye icon (👁️) in the update card to activate/deactivate

### Edit Update
Click pencil icon (✏️) to edit any field

### Delete Update
Click trash icon (🗑️) to permanently delete

### Filter Updates
Use category buttons: All, Announcements, Achievements, Events, General

---

## Keyboard Shortcuts

- **ESC** - Close any modal
- **Tab** - Navigate form fields
- **Enter** - Submit form (when focused on button)

---

## Need Help?

📖 **Full Documentation:** See `UPDATES_FEATURE_GUIDE.md`  
🔧 **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`  
📧 **Support:** takshgandhi4@gmail.com

---

**Happy updating! 🎉**
