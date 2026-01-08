/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Competitions', href: '/competitions' },
      { label: 'Robots', href: '/robots-gallery' },
      { label: 'Team', href: '/team' },
      { label: 'Gallery', href: '/robots-gallery' },
      { label: 'Contact', href: '/contact' },
    ],
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/teamraw_sfit', icon: '📷' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/team-raw-sfit', icon: 'in' },
      { label: 'YouTube', href: 'https://www.youtube.com/@teamrawsfit2026', icon: 'Y' },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section */}
        <motion.div
          className={styles.topSection}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo & Description */}
          <motion.div className={styles.brandSection} variants={itemVariants}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo 1.png"
                alt="Team RAW Logo"
                width={180}
                height={120}
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <h3 className={styles.brandTitle}>TEAM RAW</h3>
            <p className={styles.brandSubtitle}>Robotics & Automation Wing</p>
            <p className={styles.description}>
              Building the next generation of autonomous robots through innovation, engineering excellence, and 
              collaborative teamwork.
            </p>
            
            <div className={styles.affiliationSection}>
              <p className={styles.affiliationLabel}>Officially Affiliated With</p>
              <div className={styles.sfitLogoContainer}>
                <Image
                  src="/collegelogo.jpg"
                  alt="St. Francis Institute of Technology"
                  width={90}
                  height={90}
                  className={styles.sfitLogoFooter}
                />
              </div>
              <p className={styles.institutionName}>St. Francis Institute of Technology</p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div className={styles.linksSection} variants={itemVariants}>
            <h4>Quick Links</h4>
            <div className={styles.links}>
              {footerLinks.navigation.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <motion.span
                    style={{ display: 'block' }}
                    whileHover={{ x: 5, color: 'var(--color-red)' }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div className={styles.socialSection} variants={itemVariants}>
            <h4>Connect With Us</h4>
            <div className={styles.socialIcons}>
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.2, backgroundColor: 'var(--color-red)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{ cursor: 'pointer' }}
                >
                  {social.label === 'Instagram' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ) : (
                    social.icon
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Bottom Section */}
        <motion.div
          className={styles.bottomSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.copyright}>
            © {currentYear} TEAM RAW – Robotics and Automation Wing, St. Francis Institute of Technology (SFIT), Borivali West, Mumbai. All rights reserved.
          </p>
          <div className={styles.credits}>
            <p>Crafted with ❤️ by the Team RAW Community</p>
          </div>
        </motion.div>
      </div>

      {/* Background Gradient */}
      <div className={styles.bgGradient}></div>
    </footer>
  );
}
