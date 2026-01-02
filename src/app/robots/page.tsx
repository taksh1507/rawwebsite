/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import RobotsShowcase from '../components/RobotsShowcase';
import Footer from '../components/Footer';

export default function RobotsPage() {
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
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontFamily: 'Orbitron, sans-serif',
              color: 'var(--color-navy)',
              marginBottom: '1rem',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Meet Our <span style={{ color: 'var(--color-red)' }}>Robots</span>
          </motion.h1>
          <motion.p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--color-gray-dark)',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 1rem',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Precision-engineered machines designed and built by Team RAW
          </motion.p>
        </div>
      </motion.section>
      <RobotsShowcase />
      <Footer />
    </main>
  );
}
