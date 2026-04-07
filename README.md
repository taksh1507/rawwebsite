# Team RAW - Robotics & Automation Wing Official Website

A modern, futuristic frontend website built with **Next.js 16**, **React**, **Framer Motion**, and **CSS Modules**. No Tailwind CSS - pure CSS Modules for styling with a professional, robotics-themed design.

## 🎨 Design Features

- **Color Palette**: Navy Blue (#0A1A3A), Dark Steel (#0F0F17), Red Accent (#E10600), White (#ffffff)
- **Typography**: Orbitron (headings), Montserrat/Roboto (body text)
- **Theme**: Futuristic, minimalistic, modern with soft shadows and technical grid patterns
- **Responsive**: Mobile, tablet, and desktop optimization

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: CSS Modules (`.module.css`)
- **Animations**: Framer Motion
- **UI Components**: Radix UI foundations
- **Language**: TypeScript
- **Package Manager**: npm

## 📦 Key Dependencies

```json
{
  "framer-motion": "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-tabs": "latest"
}
```

## 📁 Project Structure

```
src/app/
├── components/
│   ├── Navbar.tsx              # Sticky navbar with mobile menu
│   ├── Hero.tsx                # Hero section with floating cards
│   ├── Competitions.tsx        # Competition achievements grid
│   ├── RobotsShowcase.tsx     # Interactive robot cards
│   ├── TeamSection.tsx         # Tabbed team members grid
│   ├── AboutUs.tsx             # Mission & domains section
│   ├── Gallery.tsx             # Masonry gallery with lightbox
│   ├── Contact.tsx             # Contact form & join info
│   └── Footer.tsx              # Footer with links & socials
├── styles/
│   ├── Navbar.module.css
│   ├── Hero.module.css
│   ├── Competitions.module.css
│   ├── RobotsShowcase.module.css
│   ├── TeamSection.module.css
│   ├── AboutUs.module.css
│   ├── Gallery.module.css
│   ├── Contact.module.css
│   └── Footer.module.css
├── globals.css                 # Global styles, colors, typography
├── layout.tsx                  # Root layout
├── page.tsx                    # Home page
└── utils/                      # Utility functions
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

```bash
npm run build
npm run start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
