/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Target, Zap, Layers, Users, Trophy, Factory, Handshake, Rocket, Cog, Cpu, Code, Briefcase, Calendar, ChevronDown } from 'lucide-react';
import styles from '../styles/AboutUs.module.css';
import { teamMembers } from '@/data/teamData';

export default function AboutUs() {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

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
                  const isActive = expandedDomain === domain.id;
                  const memberData = teamMembers.find(m => m._id === domain.memberId);
                  
                  return (
                    <motion.div
                      key={domain.id}
                      className={`${styles.domainCard} ${isActive ? styles.active : ''} ${isActive ? styles.expanded : ''}`}
                      onClick={() => setExpandedDomain(isActive ? null : domain.id)}
                      whileHover={{ 
                        x: 5,
                        boxShadow: '0 4px 16px rgba(225, 6, 0, 0.12)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.domainCardContent}>
                        <div className={styles.domainIconWrapper}>
                          <IconComponent size={20} strokeWidth={2.5} />
                        </div>
                        <h4 className={styles.domainTitle}>{domain.title}</h4>
                        <ChevronDown 
                          className={styles.chevronIcon} 
                          size={18} 
                          style={{
                            transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </div>
                      
                      {/* Mobile Member Details - Shows on mobile only */}
                      <AnimatePresence>
                        {isActive && memberData && (
                          <motion.div
                            className={styles.memberDetails}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={styles.memberContent}>
                              <div className={styles.memberImageWrapper}>
                                <Image
                                  src={memberData.imageUrl}
                                  alt={memberData.name}
                                  width={100}
                                  height={100}
                                  className={styles.memberImage}
                                  unoptimized
                                />
                              </div>
                              <div className={styles.memberInfo}>
                                <h5 className={styles.memberName}>{memberData.name}</h5>
                                {domain.role && (
                                  <p className={styles.memberRole}>{domain.role}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column - Member Details Panel */}
              <div className={styles.detailsPanel}>
                {/* Decorative Background Elements */}
                <div className={styles.detailsPanelDecor}>
                  <div className={styles.decorAccentLine}></div>
                  <div className={styles.decorShape1}></div>
                  <div className={styles.decorShape2}></div>
                  <motion.div 
                    className={styles.decorLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    <Rocket size={24} strokeWidth={1.5} className={styles.decorIcon} />
                    <span>TEAM RAW</span>
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  {expandedDomain ? (
                    (() => {
                      const domains = [
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
                      ];
                      const activeDomain = domains.find(d => d.id === expandedDomain);
                      const memberData = activeDomain ? teamMembers.find(m => m._id === activeDomain.memberId) : null;
                      
                      return (memberData && activeDomain) ? (
                        <motion.div
                          key={expandedDomain}
                          className={styles.detailsContent}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.detailsImageWrapper}>
                            <Image
                              src={memberData.imageUrl}
                              alt={memberData.name}
                              width={200}
                              height={200}
                              className={styles.detailsImage}
                              unoptimized
                            />
                          </div>
                          <div className={styles.detailsInfo}>
                            <h3 className={styles.detailsName}>{memberData.name}</h3>
                            <p className={styles.detailsRole}>{activeDomain.title}</p>
                          </div>
                          
                          {/* Team Focus Section */}
                          <div className={styles.focusSection}>
                            <h4 className={styles.focusTitle}>Team Focus</h4>
                            <p className={styles.focusDescription}>{activeDomain.focus}</p>
                          </div>

                          {/* Skills Tags */}
                          <div className={styles.skillsSection}>
                            <div className={styles.skillsTags}>
                              {activeDomain.skills.map((skill, index) => (
                                <motion.span
                                  key={skill}
                                  className={styles.skillTag}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Quote */}
                          <div className={styles.quoteSection}>
                            <p className={styles.quote}>"Building Innovation at Team RAW"</p>
                          </div>
                        </motion.div>
                      ) : null;
                    })()
                  ) : (
                    <motion.div
                      className={styles.detailsPlaceholder}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Users size={48} strokeWidth={1.5} className={styles.placeholderIcon} />
                      <p>Select a team domain to view details</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
