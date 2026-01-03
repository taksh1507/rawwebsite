# 📐 Latest Updates - Architecture & Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LATEST UPDATES SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                            ADMIN PANEL FLOW                                │
└───────────────────────────────────────────────────────────────────────────┘

    Admin Dashboard (http://localhost:3001/dashboard/updates)
                              │
                              ▼
            ┌─────────────────────────────────┐
            │   Click "+ New Update"          │
            └─────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────────────────────┐
            │            FILL FORM FIELDS                     │
            ├─────────────────────────────────────────────────┤
            │  ✓ Title (required)                             │
            │  ✓ Description (required)                       │
            │  ✓ Category (required)                          │
            │  ✓ Priority (required)                          │
            │  ✓ Author (optional)                            │
            │  ✓ Active Status (checkbox)                     │
            │                                                 │
            │  ━━━ User Action Settings ━━━                   │
            │  ✓ Action Type (dropdown)                       │
            │     • None                                      │
            │     • View Details                              │
            │     • Open External Link                        │
            │  ✓ External Link URL (if link type)             │
            │  ✓ CTA Button Label (optional)                  │
            │  ✓ Image URL (optional)                         │
            └─────────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │      LIVE PREVIEW CARD          │
            │  (Updates as you type)          │
            └─────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │   Click "Create Update"         │
            └─────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────┐
    │            POST /api/updates                         │
    │  ┌────────────────────────────────────────────────┐  │
    │  │  Body:                                         │  │
    │  │  {                                             │  │
    │  │    title: "...",                               │  │
    │  │    description: "...",                         │  │
    │  │    category: "event",                          │  │
    │  │    priority: "high",                           │  │
    │  │    isActive: true,                             │  │
    │  │    actionType: "link",                         │  │
    │  │    actionUrl: "https://...",                   │  │
    │  │    ctaLabel: "Register",                       │  │
    │  │    imageUrl: "https://..."                     │  │
    │  │  }                                             │  │
    │  └────────────────────────────────────────────────┘  │
    └──────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │    MongoDB Collection           │
            │      "updates"                  │
            │  [Document Saved]               │
            └─────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND USER FLOW                                │
└───────────────────────────────────────────────────────────────────────────┘

    User visits website (http://localhost:3000)
                              │
                              ▼
            ┌─────────────────────────────────┐
            │   Page loads                    │
            │   Wait 1.5 seconds...           │
            └─────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────┐
    │         GET /api/updates?active=true                 │
    │  Returns: First 3 active updates                     │
    └──────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────────────────┐
            │      UPDATES POPUP APPEARS                  │
            │                                             │
            │  ╔═══════════════════════════════════════╗  │
            │  ║  Latest Updates              [×]      ║  │
            │  ╠═══════════════════════════════════════╣  │
            │  ║  📢  Dec 10, 2025                     ║  │
            │  ║  TechFest Registration                ║  │
            │  ║  Register now for India's...          ║  │
            │  ║  [Register Now ↗]                     ║  │
            │  ║                                       ║  │
            │  ║  🏆  Dec 5, 2025                      ║  │
            │  ║  Team Wins Championship               ║  │
            │  ║  Our team secured first place...      ║  │
            │  ║  [View Photos]                        ║  │
            │  ║                                       ║  │
            │  ║  📝  Dec 1, 2025                      ║  │
            │  ║  Workshop Schedule                    ║  │
            │  ║  Join our Python workshop...          ║  │
            │  ╚═══════════════════════════════════════╝  │
            └─────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │  actionType: 'link'  │    │  actionType: 'modal' │
    │  Click [Button ↗]    │    │  Click [Button]      │
    └──────────────────────┘    └──────────────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────────┐    ┌─────────────────────────────────┐
    │  window.open()       │    │     DETAIL MODAL OPENS          │
    │  Opens in new tab    │    │                                 │
    │  with security       │    │  ╔═══════════════════════════╗  │
    │  (noopener)          │    │  ║  📅 Dec 5, 2025      [×] ║  │
    └──────────────────────┘    │  ╠═══════════════════════════╣  │
                                │  ║  [━━━━ Image ━━━━━━━━]   ║  │
                                │  ║                           ║  │
                                │  ║  Team Wins Championship   ║  │
                                │  ║                           ║  │
                                │  ║  Our team secured first   ║  │
                                │  ║  place at the National... ║  │
                                │  ║  (Full description here)  ║  │
                                │  ║                           ║  │
                                │  ╠═══════════════════════════╣  │
                                │  ║     [Visit Link ↗]        ║  │
                                │  ╚═══════════════════════════╝  │
                                └─────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│                         MOBILE USER FLOW                                   │
└───────────────────────────────────────────────────────────────────────────┘

    User on mobile device (width ≤ 768px)
                              │
                              ▼
            ┌─────────────────────────────────┐
            │   isMobile = true               │
            │   (detected via window.width)   │
            └─────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────┐
    │       DETAIL MODAL (Full Screen)                     │
    │  ┌────────────────────────────────────────────────┐  │
    │  │  [━━━━━━━━━ Full Screen ━━━━━━━━━━]          │  │
    │  │                                                │  │
    │  │  📅 Dec 5, 2025                          [×]  │  │
    │  │  ──────────────────────────────────────       │  │
    │  │  [━━━━━━━━━ Image ━━━━━━━━━]                 │  │
    │  │                                                │  │
    │  │  Team Wins Championship                        │  │
    │  │                                                │  │
    │  │  Full description text here...                 │  │
    │  │  Scrollable content area...                    │  │
    │  │                                                │  │
    │  │                                                │  │
    │  │  ──────────────────────────────────────       │  │
    │  │  [━━━━━━ Visit Link ↗ ━━━━━━]  (Sticky)      │  │
    │  └────────────────────────────────────────────────┘  │
    └──────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW DIAGRAM                                 │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Admin UI  │────────>│   API Route │────────>│   MongoDB   │
│   (Admin)   │  POST   │   /updates  │  Save   │  Collection │
└─────────────┘         └─────────────┘         └─────────────┘
                                                        │
                                                        │ GET
                                                        ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │<────────│   API Route │<────────│   MongoDB   │
│   (Users)   │  JSON   │   /updates  │  Fetch  │  Collection │
└─────────────┘         └─────────────┘         └─────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│                      ACTION TYPE DECISION TREE                             │
└───────────────────────────────────────────────────────────────────────────┘

                    User clicks update card
                              │
                              ▼
                    Check actionType field
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
  actionType:           actionType:           actionType:
    'none'                'modal'               'link'
        │                     │                     │
        ▼                     ▼                     ▼
  No button           Open detail modal    Open external URL
   shown              with full content    in new tab
                              │                     │
                              ▼                     ▼
                    Show image if exists    Use security attrs
                    Show full description   (noopener, noreferrer)
                              │
                              ▼
                    If actionUrl exists:
                    Show CTA in footer


┌───────────────────────────────────────────────────────────────────────────┐
│                         RESPONSIVE BREAKPOINTS                             │
└───────────────────────────────────────────────────────────────────────────┘

    Desktop (>768px)                    Mobile (≤768px)
    ────────────────                    ───────────────
    
    Modal Style:                        Modal Style:
    • Width: 600px max                  • Width: 100%
    • Height: 90vh max                  • Height: 100vh
    • Border radius: 20px               • Border radius: 0
    • Centered                          • Full screen
    
    CTA Button:                         CTA Button:
    • Padding: 0.75rem 1.5rem           • Padding: 1rem 2rem
    • Font size: 1rem                   • Font size: 1.125rem
    • Width: auto                       • Width: 100%
    • Position: relative                • Position: sticky
    
    Tap Targets:                        Tap Targets:
    • Standard                          • Extra large (44px min)


┌───────────────────────────────────────────────────────────────────────────┐
│                         SECURITY ARCHITECTURE                              │
└───────────────────────────────────────────────────────────────────────────┘

    External Link Click
            │
            ▼
    ┌─────────────────────────┐
    │  window.open()          │
    │  Parameters:            │
    │  • target: "_blank"     │  ← Opens in new tab
    │  • "noopener"           │  ← Prevents window.opener access
    │  • "noreferrer"         │  ← Hides referrer information
    └─────────────────────────┘
            │
            ▼
    User safely navigates to
    external site with no
    access back to origin

    
    MongoDB Queries
            │
            ▼
    ┌─────────────────────────┐
    │  ObjectId validation    │  ← Prevents NoSQL injection
    │  Input sanitization     │  ← Next.js built-in
    │  Type checking          │  ← TypeScript validation
    └─────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│                         ANIMATION TIMELINE                                 │
└───────────────────────────────────────────────────────────────────────────┘

    Page Load
    │
    ├─ t=0ms     : Component mounts
    ├─ t=50ms    : Fetch API call
    ├─ t=200ms   : Data received
    ├─ t=1500ms  : Popup appears (delayed)
    │             • Fade in (opacity 0→1)
    │             • Scale up (0.95→1)
    │             • Duration: 350ms
    │
    ├─ User clicks "View"
    │
    ├─ t=0ms     : Detail modal starts
    │             • Backdrop fade in
    │             • Modal scale + fade
    │             • Duration: 300ms
    │
    └─ User closes modal
                 • Scale down (1→0.9)
                 • Fade out (1→0)
                 • Duration: 300ms
                 • Cleanup after 300ms


┌───────────────────────────────────────────────────────────────────────────┐
│                      FILE STRUCTURE & DEPENDENCIES                         │
└───────────────────────────────────────────────────────────────────────────┘

src/app/
├── api/
│   └── updates/
│       ├── route.ts                    ← POST, GET endpoints
│       └── [id]/
│           └── route.ts                ← PATCH, DELETE endpoints
│
├── components/
│   └── UpdatesPopup.tsx                ← Main frontend component
│       ├── Uses: framer-motion
│       ├── Uses: React hooks
│       └── Renders: Popup + Detail Modal
│
└── page.tsx                            ← Imports UpdatesPopup

admin/src/app/dashboard/updates/
├── page.tsx                            ← Admin CRUD interface
│   ├── Uses: React hooks
│   ├── Fetches: /api/updates
│   └── Renders: Form + List + Preview
│
└── updates.module.css                  ← Component styles

lib/
└── mongodb.ts                          ← Database connection

Dependencies:
├── next@14+
├── react@18+
├── framer-motion@latest
├── mongodb@latest
└── typescript@5+


Legend:
────────────────────────────────────────
│   Flow direction
▼   Next step
├─  Branch point
└─  End point
┌─┐ Container
╔═╗ UI element
[×] Button
━━  Divider
```
