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
      { label: 'Facebook', href: 'https://www.facebook.com/teamrawsfit', icon: 'f' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/team-raw-sfit', icon: 'in' },
      { label: 'Instagram', href: 'https://www.instagram.com/team.raw', icon: '@' },
      { label: 'YouTube', href: 'https://www.youtube.com/@teamrawsfit', icon: 'Y' },
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
                src="/logo.png"
                alt="Team RAW Logo"
                width={180}
                height={120}
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className={styles.description}>
              Building the next generation of autonomous robots through innovation, engineering excellence, and 
              collaborative teamwork.
            </p>
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
                  {social.icon}
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
            © {currentYear} Team RAW - Robotics & Automation Wing. All rights reserved.
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
