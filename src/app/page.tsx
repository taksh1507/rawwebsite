/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Users, Bot, BarChart3 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import UpdatesPopup from './components/UpdatesPopup';
import AnimatedStat from './components/AnimatedStat';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <UpdatesPopup />
      <Navbar />
      <Hero />

      {/* Team RAW Info Section - SEO H1 */}
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
            <h1 style={{
              fontSize: '2.5rem',
              fontFamily: 'Orbitron, sans-serif',
              color: 'var(--color-navy)',
              marginBottom: '1rem',
            }}>
              TEAM RAW – Robotics and Automation Wing of <span style={{ color: 'var(--color-red)', textShadow: '0 0 10px rgba(225, 6, 0, 0.2)' }}>SFIT</span>
            </h1>
            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, var(--color-red), var(--color-navy))', margin: '1rem auto', borderRadius: '2px' }} />
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-gray-dark)',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '2',
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
              { icon: '🎯', title: 'Our Mission', text: 'To provide a supportive environment for students to develop technical skills, conduct robotics research, and work on long-term innovative projects, while collaborating with industries and institutions to enhance learning and exposure in the field of robotics.', link: '/about#mission' },
              { icon: '🚀', title: 'Our Vision', text: 'To be a leading student robotics committee that drives innovation, represents SFIT globally, and cultivates a strong and lasting robotics culture within the institute.', link: '/about#vision' },
              { icon: '🧠', title: 'What We Do', text: 'Autonomous robotics, embedded systems, mechanical design, AI & computer vision, ROS, mechatronics, and industrial automation.', link: '/team' },
              { icon: '🏆', title: 'Competitions', text: 'e-Yantra Robotics Competition (IIT Bombay), ABU Robocon, and Techfest IIT Bombay.', link: '/competitions' },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(10, 26, 58, 0.1)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                  cursor: 'pointer',
                  minHeight: '280px',
                  position: 'relative',
                }}
                whileHover={{
                  y: -10,
                  borderColor: 'var(--color-red)',
                  boxShadow: '0 20px 40px rgba(225, 6, 0, 0.15), 0 0 20px rgba(225, 6, 0, 0.1)',
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
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <AboutUs />

      {/* Highlights Section */}
      <motion.section
        style={{
          padding: '6rem 0',
          background: 'linear-gradient(180deg, #f5f7fa 0%, #e8ebf0 50%, #f5f7fa 100%)',
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
            <AnimatedStat 
              icon={Trophy}
              value={15} 
              suffix="+" 
              label="Competitions Participated" 
              description="National & inter-university robotics events"
              ariaLabel="Trophy icon representing competitions"
              delay={0}
            />
            <AnimatedStat 
              icon={Users}
              value={20} 
              suffix="+" 
              label="Active Members" 
              description="Multidisciplinary engineering team"
              ariaLabel="Users icon representing team members"
              delay={100}
            />
            <AnimatedStat 
              icon={Bot}
              value={4} 
              suffix="" 
              label="Competition Robots Built" 
              description="Mechanical, autonomous, and control systems"
              ariaLabel="Robot icon representing built robots"
              delay={200}
            />
            <AnimatedStat 
              icon={BarChart3}
              value={90} 
              suffix="%+" 
              label="Task Completion Rate" 
              description="Reliable on-field performance"
              ariaLabel="Bar chart icon representing success rate"
              delay={300}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Links Section - Explore More */}
      <motion.section
        style={{
          padding: '5rem 0',
          background: 'radial-gradient(ellipse at center, rgba(225, 6, 0, 0.05) 0%, rgba(10, 26, 58, 0.03) 50%, #ffffff 100%)',
          position: 'relative',
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
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              border: '2px solid rgba(225, 6, 0, 0.15)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
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
                    padding: '1rem 2rem',
                    background: 'var(--color-red)',
                    color: 'var(--color-white)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '600',
                    fontSize: '1rem',
                    border: '2px solid var(--color-red)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 4px 12px rgba(225, 6, 0, 0.2)',
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: 'transparent',
                    color: 'var(--color-red)',
                    boxShadow: '0 0 25px rgba(225, 6, 0, 0.4), 0 8px 20px rgba(225, 6, 0, 0.2)',
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
