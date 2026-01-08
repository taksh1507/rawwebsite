/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

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
