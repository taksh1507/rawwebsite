# How to Add Team Members

This guide explains how to add new team members to the Team RAW website.

## Location

Team member data is stored in: `src/data/teamData.ts`

## Steps to Add a New Team Member

### 1. Prepare the Member's Photo

1. Take a professional photo of the team member
2. Crop it to a square aspect ratio (1:1)
3. Optimize the image size (recommended: 500x500px)
4. Save it in the `public/` folder with a descriptive name (e.g., `john-doe.jpg`)

### 2. Add Member Data

Open `src/data/teamData.ts` and add a new member object to the appropriate array:

```typescript
{
  id: 99, // Use next available ID number
  name: 'Full Name',
  role: 'Member Role', // e.g., 'Team Lead', 'Technical Head', 'Member'
  department: 'Department Name', // e.g., 'Mechanical', 'Electronics', 'Software', 'Management'
  year: 'Year of Study', // e.g., 'FE', 'SE', 'TE', 'BE'
  imageUrl: '/photo-filename.jpg', // Path to photo in public folder
  phone: '1234567890', // 10-digit phone number (optional)
  email: 'email@example.com', // Email address (optional)
  linkedin: 'https://linkedin.com/in/username', // LinkedIn URL (optional)
  github: 'https://github.com/username', // GitHub URL (optional)
},
```

### 3. Team Categories

Team members are organized into three arrays:

#### Core Team (Leaders & Heads)
Located at the top of `teamData.ts`, includes:
- Team Leads
- Department Heads
- Core coordinators

#### Team Members (Active Contributors)
Main team array, includes all active members

#### Alumni
Separate array for past members who have graduated

### 4. Example Entry

```typescript
{
  id: 25,
  name: 'Priya Sharma',
  role: 'Software Team Member',
  department: 'Software',
  year: 'SE',
  imageUrl: '/priya-sharma.jpg',
  phone: '9876543210',
  email: 'priya.sharma@sfit.ac.in',
  linkedin: 'https://linkedin.com/in/priyasharma',
  github: 'https://github.com/priyasharma',
},
```

### 5. Required Fields

**Mandatory:**
- `id` - Unique identifier
- `name` - Full name
- `role` - Position/role in team
- `department` - Department they belong to
- `year` - Current academic year
- `imageUrl` - Photo path

**Optional:**
- `phone` - Contact number
- `email` - Email address
- `linkedin` - LinkedIn profile URL
- `github` - GitHub profile URL

### 6. Department Names

Use consistent department names:
- `Mechanical`
- `Electronics`
- `Software`
- `Management`
- `Design`

### 7. Year Abbreviations

- `FE` - First Year
- `SE` - Second Year
- `TE` - Third Year
- `BE` - Final Year

## Testing

After adding a member:

1. Save the file
2. Refresh the website
3. Navigate to the Team section
4. Verify the member appears correctly
5. Check that all social links work

## Troubleshooting

**Member not appearing:**
- Check for syntax errors (missing commas, brackets)
- Ensure ID is unique
- Verify the array is properly closed

**Image not showing:**
- Confirm image is in `public/` folder
- Check filename matches exactly (case-sensitive)
- Verify image path starts with `/`

**Build errors:**
- Check TypeScript syntax
- Ensure all required fields are present
- Look for missing commas or quotes

## Commit Changes

After adding members:

```bash
git add .
git commit -m "Add new team member: [Name]"
git push
```

---

**Need help?** Contact the technical team or refer to existing member entries as examples.
