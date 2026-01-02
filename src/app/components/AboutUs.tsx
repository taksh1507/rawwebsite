/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import styles from '../styles/AboutUs.module.css';

export default function AboutUs() {
  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8 } 
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8 } 
    },
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.leftContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={leftVariants}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            About <span className={styles.redAccent}>Team RAW</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Team RAW (Robotics & Automation Wing) is a dynamic student organization dedicated to 
            advancing robotics and automation technology. Founded with a vision to foster innovation, 
            our team brings together talented engineers and enthusiasts from diverse domains.
          </motion.p>

          <motion.div
            className={styles.missionBox}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3>Our Mission</h3>
            <p>
              To design, build, and deploy innovative robotic solutions that tackle real-world 
              challenges while pushing the boundaries of technical excellence and creativity.
            </p>
          </motion.div>

          <motion.div
            className={styles.statsContainer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statValue}>5+</span>
              <span className={styles.statLabel}>Domains</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Members</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>15+</span>
              <span className={styles.statLabel}>Competitions</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.domainsBox}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <h3>Our Domains</h3>
            <div className={styles.domainsList}>
              {['Mechanical Design', 'Electronics & Control', 'Software & AI', 'Business', 'Events'].map((domain) => (
                <motion.div
                  key={domain}
                  className={styles.domainTag}
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--color-red)', color: 'var(--color-white)' }}
                >
                  {domain}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rightVariants}
        >
          <div className={styles.imageCollage}>
            <motion.div
              className={`${styles.collageItem} ${styles.item1}`}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)' }}
            >
              <div className={styles.collageImage}>🏭</div>
              <p>Lab Setup</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item2}`}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)' }}
            >
              <div className={styles.collageImage}>🤝</div>
              <p>Team Work</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item3}`}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)' }}
            >
              <div className={styles.collageImage}>🏆</div>
              <p>Victories</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item4}`}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)' }}
            >
              <div className={styles.collageImage}>🚀</div>
              <p>Innovation</p>
            </motion.div>
          </div>

          <motion.div
            className={styles.blueprintBg}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
