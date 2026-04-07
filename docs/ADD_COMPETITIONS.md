# How to Add Competitions

This guide explains how to add new competitions and achievements to the Team RAW website.

## Location

Competition data is stored in: `src/app/components/Competitions.tsx`

## Steps to Add a New Competition

### 1. Prepare Competition Image

1. Get a high-quality image representing the competition (logo, poster, or robot photo)
2. Recommended size: 800x500px (16:10 aspect ratio)
3. Save it in the `public/` folder (e.g., `robocon-2027.jpg`)

### 2. Add Competition Entry

Open `src/app/components/Competitions.tsx` and locate the `competitionsData` array. Add a new entry:

```typescript
{
  id: 8, // Use next available ID number
  name: 'Competition Name',
  organizer: 'Organizing Body',
  year: 2026, // Competition year
  achievement: 'Achievement Status', // See achievement types below
  description: 'Detailed description of the competition and our achievement. Include what made this competition significant and what we accomplished.',
  tags: ['Tag1', 'Tag2', 'Tag3'], // Technical domains/themes
  imageUrl: '/competition-image.jpg', // Path to image in public folder
},
```

### 3. Achievement Types

Choose the appropriate achievement status (must match exactly):

- **`'Pre-Registration Done'`** - Completed pre-registration
- **`'Participated'`** - Participated in the competition
- **`'Qualified'`** - Qualified for the competition
- **`'Top 15'`** - Secured position in top 15
- **`'Top 10'`** - Secured position in top 10
- **`'Finalist'`** - Reached finals
- **`'Winner'`** - Won the competition
- **`'National Participation'`** - Participated at national level
- **`'Coming Soon'`** - Upcoming competition

### 4. Achievement Badge Colors

Each achievement type automatically gets a colored badge:

- **Pre-Registration Done** - Cyan gradient
- **Participated** - Purple gradient
- **Qualified** - Green gradient
- **Top 15 / Top 10** - Orange/Gold gradient
- **Finalist** - Red gradient
- **Winner** - Gold gradient
- **Coming Soon** - Gray

### 5. Tags

Use consistent tag names from existing domains:

**Core Tech:**
- `Algorithms`
- `Control`
- `Autonomous Control`

**Hardware:**
- `Electronics`
- `Embedded Systems`
- `Mechanical Design`

**Themes:**
- `Robotics`
- `Innovation`
- `Speed Challenge`
- `Design`
- `Autonomous`

### 6. Complete Example

```typescript
{
  id: 8,
  name: 'DD Robocon 2027',
  organizer: 'Doordarshan & Ministry of Education',
  year: 2027,
  achievement: 'Pre-Registration Done',
  description: 'Completed pre-registration for DD Robocon 2027 - India\'s most prestigious robotics competition. Preparing to compete at the national level with our innovative robot design focused on the Harvest Day theme.',
  tags: ['Mechanical Design', 'Autonomous Control', 'Electronics'],
  imageUrl: '/robocon2027.jpg',
},
```

### 7. Adding New Achievement Type

If you need a new achievement type not in the list:

1. **Add to ACHIEVEMENT_BADGES** object:

```typescript
const ACHIEVEMENT_BADGES = {
  'Coming Soon': '⏳ Coming Soon',
  'Pre-Registration Done': '📝 Pre-Registration',
  'New Achievement': '🎯 New Badge Text', // Add here
  // ... rest
};
```

2. **Add CSS styling** in `src/app/styles/Competitions.module.css`:

```css
.achievement[data-type="new-achievement"] {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
  color: white;
}

.detailsAchievement[data-type="new-achievement"] {
  background: linear-gradient(135deg, #color1, #color2);
}
```

### 8. Ordering Competitions

Competitions are displayed newest first by default. To prioritize:

- Add newer competitions at the **top** of the array
- Keep older competitions toward the bottom
- Users can filter by year and domain tags

### 9. Writing Good Descriptions

**Do:**
- Mention the significance of the competition
- Highlight specific achievements (scores, stages, rankings)
- Include technical challenges overcome
- Keep it concise but informative (2-3 sentences)

**Don't:**
- Use vague phrases like "did well"
- Include unnecessary details
- Make it too long (>150 words)

**Example Good Description:**
```
Secured position in Top 15 teams nationwide in DD Robocon 2025. 
Demonstrated exceptional technical excellence and innovation in 
mechanical design and autonomous control systems across three 
challenging stages.
```

### 10. Testing

After adding a competition:

1. Save the file
2. Check for TypeScript errors
3. Refresh the website
4. Navigate to the Competitions page
5. Verify:
   - Image displays correctly
   - Badge shows with proper color
   - Description is readable
   - Tags appear correctly
   - Clicking opens detail modal

## Updating Existing Competitions

To update achievement status (e.g., from Pre-Registration to Qualified):

1. Find the competition entry by ID or name
2. Change the `achievement` field
3. Update the `description` to reflect new status
4. Save and test

## Troubleshooting

**Competition not showing:**
- Check for syntax errors (missing commas)
- Ensure ID is unique
- Verify array is properly closed

**Image not loading:**
- Confirm image is in `public/` folder
- Check filename matches exactly
- Ensure path starts with `/`

**Badge color not showing:**
- Verify achievement text matches exactly (case-sensitive)
- Check data-type transformation (spaces to hyphens)
- Confirm CSS styles exist for that achievement type

**Tags not filtering:**
- Use existing tag names from the domain list
- Check spelling matches other entries

## Commit Changes

After adding competitions:

```bash
git add .
git commit -m "Add [Competition Name] to competitions page"
git push
```

---

**Need help?** Refer to existing competition entries in the code as examples.
