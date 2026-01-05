/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const containerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className={styles.hero} ref={containerRef}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.gridPattern}></div>
      
      {/* Animated background lines */}
      <div className={styles.decorativeLinesContainer}>
        <motion.svg
          className={styles.decorativeLines}
          viewBox="0 0 1200 600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <line x1="0" y1="100" x2="1200" y2="100" stroke="#E10600" strokeWidth="1" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke="#E10600" strokeWidth="1" />
          <line x1="0" y1="300" x2="1200" y2="300" stroke="#E10600" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="600" stroke="#0A1A3A" strokeWidth="1" />
          <line x1="600" y1="0" x2="600" y2="600" stroke="#0A1A3A" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1000" y2="600" stroke="#0A1A3A" strokeWidth="1" />
        </motion.svg>
      </div>

      <div className={styles.container}>
        {/* Left Side - Content */}
        <motion.div
          className={styles.leftContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className={styles.badge}>
            <span>🤖 Innovation in Motion</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className={styles.mainHeading}>
            TEAM <span className={styles.redAccent}>RAW</span>
          </motion.h1>

          <motion.h2 variants={itemVariants} className={styles.subtitle}>
            Robotics & Automation Wing
          </motion.h2>

          <motion.p variants={itemVariants} className={styles.description}>
            Building the next generation of autonomous robots. Excellence in robotics, innovation in engineering, and passion for technology.
          </motion.p>

          <motion.div variants={itemVariants} className={styles.ctaContainer}>
            <motion.a
              href="/competitions"
              className={`${styles.button} ${styles.primaryButton}`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(225, 6, 0, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              style={{ textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}
            >
              Explore Competitions
            </motion.a>

            <motion.a
              href="/robots-gallery"
              className={`${styles.button} ${styles.secondaryButton}`}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--color-navy)' }}
              whileTap={{ scale: 0.95 }}
              style={{ textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}
            >
              Meet the Robots
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>2+</span>
              <span className={styles.statLabel}>Competitions</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>20+</span>
              <span className={styles.statLabel}>Members</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4+</span>
              <span className={styles.statLabel}>Robots</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Robot Image */}
        <motion.div
          className={styles.rightContent}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className={styles.logoContainer}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/robot.png"
              alt="Team RAW Robot"
              width={300}
              height={300}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <span style={{ fontSize: '0.875rem', color: 'var(--color-gray)', fontWeight: 500 }}>Scroll to Explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
