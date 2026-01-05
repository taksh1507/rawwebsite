/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Layers, Users, Trophy, Factory, Handshake, Rocket, Cog, Cpu, Code, Briefcase, Calendar } from 'lucide-react';
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
            className={styles.mainHeading}
          >
            About <span className={styles.redAccent}>Team RAW</span>
            <div className={styles.headingUnderline}></div>
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
            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(225, 6, 0, 0.15)' }}
          >
            <div className={styles.missionIcon}>
              <Target size={28} strokeWidth={2.5} />
            </div>
            <div className={styles.missionContent}>
              <h3>Our Mission</h3>
              <p>
                To provide a supportive environment for students to develop technical skills, conduct robotics research, and work on long-term innovative projects, while collaborating with industries and institutions to enhance learning and exposure in the field of robotics.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={styles.statsContainer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className={styles.statItem}
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(225, 6, 0, 0.15)' }}
            >
              <Layers className={styles.statIcon} size={32} strokeWidth={2} />
              <span className={styles.statValue}>3+</span>
              <span className={styles.statLabel}>Domains</span>
            </motion.div>
            <motion.div 
              className={styles.statItem}
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(225, 6, 0, 0.15)' }}
            >
              <Users className={styles.statIcon} size={32} strokeWidth={2} />
              <span className={styles.statValue}>20+</span>
              <span className={styles.statLabel}>Members</span>
            </motion.div>
            <motion.div 
              className={styles.statItem}
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(225, 6, 0, 0.15)' }}
            >
              <Trophy className={styles.statIcon} size={32} strokeWidth={2} />
              <span className={styles.statValue}>2+</span>
              <span className={styles.statLabel}>Competitions</span>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.domainsBox}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <h3>Our Domains</h3>
            <div className={styles.domainDivider}></div>
            <div className={styles.domainsList}>
              {[
                { name: 'Mechanical Design', icon: Cog },
                { name: 'Electronics & Control', icon: Cpu },
                { name: 'Embedded Systems & AI', icon: Code },
                { name: 'Public Relations & Logistics', icon: Briefcase },
              ].map((domain) => {
                const IconComponent = domain.icon;
                return (
                  <motion.div
                    key={domain.name}
                    className={styles.domainPill}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: 'var(--color-red)', 
                      borderColor: 'var(--color-red)',
                      boxShadow: '0 4px 16px rgba(225, 6, 0, 0.3)'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent size={18} strokeWidth={2.5} />
                    {domain.name}
                  </motion.div>
                );
              })}
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
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(225, 6, 0, 0.25)',
                borderColor: 'var(--color-red)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.collageIcon} aria-label="Lab Setup">
                <Factory size={48} strokeWidth={1.5} />
              </div>
              <p>Lab Setup</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item2}`}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(225, 6, 0, 0.25)',
                borderColor: 'var(--color-red)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.collageIcon} aria-label="Team Work">
                <Handshake size={48} strokeWidth={1.5} />
              </div>
              <p>Team Work</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item3}`}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(225, 6, 0, 0.25)',
                borderColor: 'var(--color-red)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.collageIcon} aria-label="Victories">
                <Trophy size={48} strokeWidth={1.5} />
              </div>
              <p>Victories</p>
            </motion.div>
            <motion.div
              className={`${styles.collageItem} ${styles.item4}`}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(225, 6, 0, 0.25)',
                borderColor: 'var(--color-red)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.collageIcon} aria-label="Innovation">
                <Rocket size={48} strokeWidth={1.5} />
              </div>
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
