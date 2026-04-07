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
              <h3>Our Objective</h3>
             <p>
                To represent SFIT in prestigious national and international robotics competitions such as DD Robocon, showcasing the technical excellence, teamwork and innovation of the institute.
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
              <span className={styles.statValue}>7</span>
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
            <h3>Team / Domains</h3>
            <div className={styles.domainDivider}></div>
            <div className={styles.domainsContainer}>
              {/* Left Column - Domain Cards */}
              <div className={styles.domainsList}>
                {/* Decorative Background Elements */}
                <div className={styles.domainsListDecor}>
                  <div className={styles.decorGradientBg}></div>
                  <div className={styles.decorCircle1}></div>
                  <div className={styles.decorCircle2}></div>
                  <div className={styles.decorGrid}></div>
                </div>
                {[
                  { 
                    id: 'rt', 
                    title: 'R&D Team', 
                    role: 'CRC', 
                    member: 'Siddhant Monde', 
                    memberId: 'core2', 
                    icon: Zap,
                    focus: 'Leading research and development initiatives for innovative robotics solutions',
                    skills: ['Innovation', 'Leadership', 'Research', 'Strategy']
                  },
                  { 
                    id: 'dt', 
                    title: 'Documentation Team', 
                    role: 'Secretary', 
                    member: 'Dikshi Adani', 
                    memberId: 'core6', 
                    icon: Briefcase,
                    focus: 'Managing documentation, records, and official team communications',
                    skills: ['Documentation', 'Organization', 'Communication', 'Record Keeping']
                  },
                  { 
                    id: 'et', 
                    title: 'Event Team', 
                    role: 'Event Head', 
                    member: 'Nandini Salunkhe', 
                    memberId: 'core8', 
                    icon: Calendar,
                    focus: 'Organizing and coordinating team events, competitions, and workshops',
                    skills: ['Event Planning', 'Coordination', 'Management', 'Logistics']
                  },
                  { 
                    id: 'pt', 
                    title: 'Publicity Team', 
                    role: 'Publicity Head', 
                    member: 'Dittino Thomas', 
                    subtitle: '(Co-CRC)', 
                    memberId: 'core3', 
                    icon: Users,
                    focus: 'Building team presence through marketing, social media, and outreach',
                    skills: ['Marketing', 'Social Media', 'Design', 'Outreach']
                  },
                  { 
                    id: 'eht', 
                    title: 'Electronics & Hardware Coding Team', 
                    role: '', 
                    member: 'Saish Loke', 
                    memberId: 'core5', 
                    icon: Cpu,
                    focus: 'Developing embedded systems, hardware integration, and electronic circuits',
                    skills: ['Embedded Systems', 'Hardware Design', 'PCB Design', 'Microcontrollers']
                  },
                  { 
                    id: 'st', 
                    title: 'Software Coding Team', 
                    role: '', 
                    member: 'Taksh Gandhi', 
                    memberId: 'core4', 
                    icon: Code,
                    focus: 'Creating software solutions, control systems, and automation frameworks',
                    skills: ['Programming', 'Algorithms', 'Control Systems', 'Automation']
                  },
                  { 
                    id: 'mt', 
                    title: 'Mechanical Design Team', 
                    role: '', 
                    member: 'Shail Raut', 
                    memberId: 'core12', 
                    icon: Cog,
                    focus: 'Designing mechanical structures, CAD modeling, and prototyping',
                    skills: ['CAD Design', 'Prototyping', '3D Modeling', 'Manufacturing']
                  },
                ].map((domain) => {
                  const IconComponent = domain.icon;
                  // Map AboutUs domain IDs to actual TeamSection domain IDs
                  const domainIdMap: { [key: string]: string } = {
                    'rt': 'rnd',
                    'dt': 'documentation',
                    'et': 'event',
                    'pt': 'publicity',
                    'eht': 'electronics',
                    'st': 'software',
                    'mt': 'mechanical'
                  };
                  const actualDomainId = domainIdMap[domain.id] || domain.id;
                  
                  return (
                    <motion.a
                      key={domain.id}
                      href={`/team?domain=${actualDomainId}`}
                      className={`${styles.domainCard}`}
                      whileHover={{ 
                        y: -5,
                        boxShadow: '0 8px 20px rgba(225, 6, 0, 0.2)'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                    >
                      <div className={styles.domainCardContent}>
                        <div className={styles.domainIconWrapper}>
                          <IconComponent size={20} strokeWidth={2.5} />
                        </div>
                        <h4 className={styles.domainTitle}>{domain.title}</h4>
                      </div>
                    </motion.a>
                  );
                })}
              </div>


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
