/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 * 
 * Copyright (c) 2024-2026 TEAM RAW - Robotics and Automation Wing, SFIT Mumbai
 * All Rights Reserved. Proprietary and Confidential.
 * 
 * This code is the property of TEAM RAW. Unauthorized copying, modification,
 * distribution, or use of this code is strictly prohibited without written
 * permission from TEAM RAW.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import FloatingChatbot from "./components/FloatingChatbot";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rawwebsite-seven.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'TEAM RAW – Robotics and Automation Wing | SFIT Mumbai',
    template: '%s | TEAM RAW – SFIT Mumbai'
  },
  description: 'TEAM RAW is the Robotics and Automation Wing of St. Francis Institute of Technology (SFIT), Mumbai. We participate in national robotics competitions, build innovative automation projects, and drive technological excellence.',
  keywords: [
    'TEAM RAW',
    'SFIT Robotics',
    'Robotics and Automation Wing SFIT',
    'College Robotics Team Mumbai',
    'St. Francis Institute of Technology',
    'SFIT Mumbai',
    'ABU Robocon',
    'Robotics Competition',
    'Engineering Projects Mumbai',
    'Automation Wing SFIT',
    'Team RAW SFIT'
  ],
  authors: [{ name: 'TEAM RAW', url: 'https://rawwebsite-seven.vercel.app' }],
  creator: 'TEAM RAW - St. Francis Institute of Technology',
  publisher: 'TEAM RAW',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rawwebsite-seven.vercel.app',
    title: 'TEAM RAW – Robotics and Automation Wing | SFIT Mumbai',
    description: 'Official website of TEAM RAW - Robotics and Automation Wing of St. Francis Institute of Technology, Mumbai. Building the next generation of autonomous robots.',
    siteName: 'TEAM RAW',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TEAM RAW - Robotics and Automation Wing SFIT Mumbai'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEAM RAW – Robotics and Automation Wing | SFIT Mumbai',
    description: 'TEAM RAW - Robotics and Automation Wing of SFIT Mumbai. National robotics competitions, innovative automation projects, and engineering excellence.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google67b4bb5228cd029f',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#B2001D" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StructuredData />
        <DataProvider>
          {children}
          <FloatingChatbot />
        </DataProvider>
      </body>
    </html>
  );
}
