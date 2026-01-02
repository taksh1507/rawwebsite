/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import FloatingChatbot from "./components/FloatingChatbot";

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
  title: "Team RAW - Robotics & Automation Wing",
  description: "Official website of Team RAW - Robotics & Automation Wing. Building the next generation of autonomous robots.",
  keywords: "robotics, automation, engineering, competitions, ROBOCON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <DataProvider>
          {children}
          <FloatingChatbot />
        </DataProvider>
      </body>
    </html>
  );
}
