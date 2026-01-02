'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Team RAW Info Section */}
      <motion.section
        className="team-raw-intro"
        style={{
          padding: '4rem 0',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          borderTop: '1px solid rgba(10, 26, 58, 0.1)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '2rem' }}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Orbitron, sans-serif',
              color: 'var(--color-navy)',
              marginBottom: '1rem',
            }}>
              Welcome to <span style={{ color: 'var(--color-red)', textShadow: '0 0 10px rgba(225, 6, 0, 0.2)' }}>TEAM RAW</span>
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-gray-dark)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.8',
            }}>
              The official robotics research and competition team of St. Francis Institute of Technology (SFIT). 
              We design, develop, and innovate robotics systems for national and international competitions.
            </p>
          </motion.div>

          <motion.div
            style={{
              maxWidth: '800px',
              margin: '2rem auto 0',
              padding: '1.5rem',
              background: 'rgba(225, 6, 0, 0.08)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--color-red)',
              textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-navy)',
              fontStyle: 'italic',
              margin: 0,
              fontWeight: '500',
            }}>
              ⭐ Where innovation meets engineering — building the future, one robot at a time.
            </p>
          </motion.div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: '🎯', title: 'Our Mission', text: 'To provide a supportive environment for students to develop technical skills, conduct robotics research, and work on long-term innovative projects, while collaborating with industries and institutions to enhance learning and exposure in the field of robotics.' },
              { icon: '🚀', title: 'Our Vision', text: 'To be a leading student robotics committee that drives innovation, represents SFIT globally, and cultivates a strong and lasting robotics culture within the institute.' },
              { icon: '🧠', title: 'What We Do', text: 'Autonomous robotics, embedded systems, mechanical design, AI & computer vision, ROS, mechatronics, and industrial automation.' },
              { icon: '🏆', title: 'Competitions', text: 'ABU Robocon, eYRC, IRC, SAE AeroX, National Robotics Championship, and Technovation Project Expo.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(10, 26, 58, 0.1)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                }}
                whileHover={{
                  y: -10,
                  borderColor: 'var(--color-red)',
                  boxShadow: '0 20px 40px rgba(225, 6, 0, 0.15)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '1.25rem',
                  color: 'var(--color-navy)',
                  marginBottom: '0.5rem',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-gray-dark)',
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>



      {/* Highlights Section */}
      <motion.section
        style={{
          padding: '6rem 0',
          background: 'linear-gradient(180deg, #E6E9EE 0%, #F0F2F7 100%)',
          color: 'var(--color-navy)',
          position: 'relative',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '3rem' }}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Orbitron, sans-serif',
              marginBottom: '1rem',
              color: 'var(--color-navy)',
              letterSpacing: '0.02em',
            }}>
              Team RAW <span style={{ color: '#B2001D' }}>Highlights</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
            }}>
              Our achievements and impact
            </p>
          </motion.div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: '🏆', stat: '15+', label: 'Competitions Participated', description: 'National & inter-university robotics events' },
              { icon: '👥', stat: '20+', label: 'Active Members', description: 'Multidisciplinary engineering team' },
              { icon: '🤖', stat: '4', label: 'Competition Robots Built', description: 'Mechanical, autonomous, and control systems' },
              { icon: '📊', stat: '90%+', label: 'Task Completion Rate', description: 'Reliable on-field performance' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderRadius: '14px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#E5E7EB',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(10, 26, 58, 0.08)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  y: -3,
                  borderColor: '#E10600',
                  boxShadow: '0 8px 25px rgba(225, 6, 0, 0.2), 0 0 15px rgba(225, 6, 0, 0.15)',
                }}
              >
                
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  paddingTop: '0.5rem',
                  filter: 'grayscale(0.2)',
                }}>
                  {item.icon}
                </div>
                
                <h3 style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  margin: '0 0 0.5rem 0',
                  color: '#E10600',
                }}>
                  {item.stat}
                </h3>
                
                <p style={{
                  fontSize: '1.05rem',
                  margin: '0 0 0.5rem 0',
                  color: '#0A1A3A',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                }}>
                  {item.label}
                </p>
                
                <p style={{
                  fontSize: '0.875rem',
                  margin: 0,
                  color: '#6B7280',
                  fontWeight: '400',
                  lineHeight: '1.5',
                }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Structure Section */}
      <motion.section
        style={{
          padding: '6rem 0',
          background: 'linear-gradient(180deg, #E6E9EE 0%, #F0F2F7 100%)',
          color: 'var(--color-navy)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '3rem' }}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontFamily: 'Orbitron, sans-serif',
              marginBottom: '0.75rem',
              color: 'var(--color-navy)',
              letterSpacing: '0.02em',
              fontWeight: '900',
            }}>
              Team <span style={{ color: '#B2001D' }}>Structure</span>
            </h2>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              color: '#888',
              margin: 0,
              fontWeight: '500',
              letterSpacing: '0.3px',
            }}>
              Multi-disciplinary divisions working together
            </p>
          </motion.div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              { division: '🔧 Mechanical Division', color: '#0A1A3A' },
              { division: '⚡ Electronics & Embedded Systems', color: '#0A1A3A' },
              { division: '💻 Programming Division', color: '#B2001D' },
              { division: '👁️ AI & Computer Vision', color: '#B2001D' },
              { division: '📐 CAD & Simulation', color: '#0A1A3A' },
              { division: '📊 Strategy & Management', color: '#0A1A3A' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 1.5rem)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderRadius: '12px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: item.color,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(10, 26, 58, 0.08)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 'clamp(140px, 20vw, 160px)',
                }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 12px 35px rgba(10, 26, 58, 0.15)',
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: item.color,
                  }}
                />
                
                <p style={{
                  fontSize: '1rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '700',
                  margin: 0,
                  color: item.color,
                  letterSpacing: '0.5px',
                  paddingTop: '0.5rem',
                  lineHeight: '1.4',
                }}>
                  {item.division}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Links Section - Explore More */}
      <motion.section
        style={{
          padding: '4rem 0',
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div
            style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(225, 6, 0, 0.05)',
              borderRadius: '8px',
              border: '2px solid rgba(225, 6, 0, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1.5rem',
              color: 'var(--color-navy)',
              marginBottom: '1.5rem',
            }}>
              Explore More
            </h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {[
                { label: 'Robots & Gallery', href: '/robots-gallery' },
                { label: 'Meet the Team', href: '/team' },
                { label: 'Competitions', href: '/competitions' },
                { label: 'Contact', href: '/contact' },
              ].map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--color-red)',
                    color: 'var(--color-white)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: '2px solid var(--color-red)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: 'transparent',
                    color: 'var(--color-red)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>



      <Footer />
    </main>
  );
}
