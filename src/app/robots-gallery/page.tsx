/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Robots Gallery',
  description: 'Explore TEAM RAW\'s collection of innovative robots and automation projects. View detailed specifications, features, and competition history of our robots.',
  openGraph: {
    title: 'Robots Gallery | TEAM RAW SFIT Mumbai',
    description: 'Discover TEAM RAW\'s innovative robotics projects and competition robots built at SFIT Mumbai.',
  },
};

'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RobotsGallery from '../components/RobotsGallery';

export default function RobotsGalleryPage() {
  return (
    <main>
      <Navbar />
      <RobotsGallery />
      <Footer />
    </main>
  );
}
