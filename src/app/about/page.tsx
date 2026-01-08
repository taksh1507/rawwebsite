/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TEAM RAW',
  description: 'Learn about TEAM RAW - the Robotics and Automation Wing of St. Francis Institute of Technology, Mumbai. Our mission, vision, and journey in robotics innovation.',
  openGraph: {
    title: 'About TEAM RAW – Robotics and Automation Wing | SFIT Mumbai',
    description: 'Discover TEAM RAW\'s mission, vision, and impact in robotics competitions and automation projects at SFIT Mumbai.',
  },
};

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';

export default function AboutPage() {
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
            About <span style={{ color: 'var(--color-red)' }}>TEAM RAW</span>
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
            Learn about Team RAW's mission, journey, and vision
          </motion.p>
        </div>
      </motion.section>
      
      {/* SFIT Identity Section */}
      <motion.section
        style={{
          padding: '3rem 1.5rem',
          background: 'linear-gradient(135deg, #0a1a3a 0%, #1a2f5a 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          maxWidth: '900px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/collegelogo.jpg"
              alt="St. Francis Institute of Technology"
              width={120}
              height={120}
              style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(225, 6, 0, 0.3)' }}
            />
          </motion.div>
          <motion.p
            style={{
              fontSize: '1.3rem',
              color: '#ffffff',
              lineHeight: '1.8',
              fontWeight: 500,
              maxWidth: '700px',
            }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Team RAW is the official <span style={{ color: '#e10600', fontWeight: 700 }}>Robotics & Automation Wing</span> of <br/>
            <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>St. Francis Institute of Technology</span>
          </motion.p>
          <motion.p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '650px',
            }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Fostering innovation, technical excellence, and collaborative robotics research under the guidance of SFIT's distinguished faculty.
          </motion.p>
        </div>
      </motion.section>
      
      <AboutUs />
      <Footer />
    </main>
  );
}
