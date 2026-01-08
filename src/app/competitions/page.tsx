/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Competitions & Achievements',
  description: 'Explore TEAM RAW\'s participation in ABU Robocon, e-Yantra, and other national robotics competitions. View our achievements and competition history.',
  openGraph: {
    title: 'Robotics Competitions & Achievements | TEAM RAW SFIT',
    description: 'TEAM RAW\'s journey through national robotics competitions including ABU Robocon and e-Yantra Robotics Competition.',
  },
};

'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Competitions from '../components/Competitions';
import Footer from '../components/Footer';

export default function CompetitionsPage() {
  return (
    <main>
      <Navbar />
      <Competitions />
      <Footer />
    </main>
  );
}
