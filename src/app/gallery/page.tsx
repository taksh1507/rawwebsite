/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse through TEAM RAW\'s photo gallery featuring our robots, competitions, workshops, and team events at SFIT Mumbai.',
  openGraph: {
    title: 'TEAM RAW Gallery | Robots & Events',
    description: 'View photos of TEAM RAW\'s robotics projects, competition moments, and team activities.',
  },
};

'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

export default function GalleryPage() {
  return (
    <main>
      <Navbar />
      <motion.section
        style={{
          paddingTop: '100px',
          paddingBottom: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <motion.h1
            style={{
              fontSize: '3.5rem',
              fontFamily: 'Orbitron, sans-serif',
              color: 'var(--color-navy)',
              marginBottom: '1rem',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Photo <span style={{ color: 'var(--color-red)' }}>Gallery</span>
          </motion.h1>
          <motion.p
            style={{
              fontSize: '1.2rem',
              color: 'var(--color-gray-dark)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Capturing moments of innovation, achievement, and teamwork
          </motion.p>
        </div>
      </motion.section>
      <Gallery />
      <Footer />
    </main>
  );
}
