/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import styles from '@/app/styles/Sponsors.module.css';

// Sponsor Hero Banner Component
const SponsorHeroBanner = () => {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroTitle}
        >
          Power the Future of <span className={styles.redAccent}>Robotics Innovation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.heroSubtitle}
        >
          Partner with Team RAW and gain national visibility, access top engineering talent, and drive innovation in STEM education
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.heroButtonGroup}
        >
          <motion.button
            className={styles.ctaButtonPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Sponsor
          </motion.button>
          <motion.button
            className={styles.ctaButtonSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Coming Soon! Our sponsorship deck will be available shortly.')}
          >
            Download Sponsorship Deck
          </motion.button>
        </motion.div>
      </div>

      <div className={styles.videoOverlay} />
    </section>
  );
};

// Sponsorship Benefits Grid
const BenefitsGrid = () => {
  const benefits = [
    // Visibility & Branding
    {
      icon: '🎯',
      title: 'National Brand Visibility',
      description: 'Logo placement on team uniforms, robots, trailers, and digital platforms reaching 50K+ annual impressions.',
      category: 'Visibility',
      color: 'cyan',
    },
    {
      icon: '🏆',
      title: 'Competition Exposure',
      description: 'Recognition at 15+ regional/national events with sponsor spotlights and awards ceremonies nationwide.',
      category: 'Visibility',
      color: 'cyan',
    },
    // Talent Access
    {
      icon: '👥',
      title: 'Talent Pipeline Access',
      description: 'Direct recruitment access to 200+ top engineering students for internships, co-ops, and full-time roles.',
      category: 'Talent',
      color: 'green',
    },
    {
      icon: '🎓',
      title: 'Educational Partnership',
      description: 'Co-branded workshops and STEM outreach programs reaching 500+ students annually.',
      category: 'Talent',
      color: 'green',
    },
    // Innovation & Analytics
    {
      icon: '⚙️',
      title: 'Innovation Collaboration',
      description: 'Joint technology development and exclusive access to cutting-edge robotics research and projects.',
      category: 'Innovation',
      color: 'gold',
    },
    {
      icon: '📊',
      title: 'Marketing Analytics & ROI',
      description: 'Detailed metrics on brand exposure, reach, engagement, and measurable sponsorship return on investment.',
      category: 'Innovation',
      color: 'gold',
    },
  ];

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.sectionTitle}
        >
          Sponsorship <span className={styles.redAccent}>Benefits</span>
        </motion.h2>
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`${styles.benefitCard} ${styles[`color${benefit.color}`]}`}
              whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              <div className={styles.benefitIcon}>{benefit.icon}</div>
              <div className={styles.benefitCategory}>{benefit.category}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Impact in Numbers
const ImpactNumbers = () => {
  const stats = [
    { number: '200+', label: 'Engineering Students', description: 'Active participation across robotics, electronics, software, and mechanical domains', icon: '�' },
    { number: '50K+', label: 'Annual Brand Impressions', description: 'National TV broadcasts, YouTube live streams, and technical event exposure', icon: '�️' },
    { number: '3+', label: 'National Robotics Competitions', description: 'DD Robocon, e-Yantra (IIT Bombay), National Techfest Robotics Events', icon: '🏆' },
    { number: '500+', label: 'Students Mentored', description: 'Workshops, lab visits, mentoring sessions, and robotics demonstrations', icon: '�' },
  ];

  return (
    <section className={styles.impactSection}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.sectionTitle}
        >
          Proven <span className={styles.redAccent}>Impact & Scale</span>
        </motion.h2>
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className={styles.statCard}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statDescription}>{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Achievements & Competition Highlights
const AchievementsHighlights = () => {
  const achievements = [
    {
      year: '2026',
      title: 'DD Robocon 2026 Pre-Registration',
      description: 'Completed pre-registration for DD Robocon 2026 competition',
      sponsorValue: '✓ Opportunity to showcase sponsor brands at national platform',
    },
    {
      year: '2025',
      title: 'DD Robocon 2025 - Stage 3 (Top 15)',
      description: 'Qualified to Stage 3 and secured position in Top 15 teams nationwide',
      sponsorValue: '✓ National-level recognition and media coverage',
    },
    {
      year: '2025',
      title: 'DD Robocon 2025 - Stage 2 (May)',
      description: 'Advanced to Stage 2 with outstanding performance - Score: 90 marks',
      sponsorValue: '✓ Demonstrates consistent excellence and innovation',
    },
    {
      year: '2025',
      title: 'DD Robocon 2025 - Stage 1 (February)',
      description: 'Qualified Stage 1 with exceptional score of 95 marks',
      sponsorValue: '✓ Powerful brand association with high-performing team',
    },
  ];

  return (
    <section className={styles.achievementsSection}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.sectionTitle}
        >
          Our Track Record & <span className={styles.redAccent}>Achievements</span>
        </motion.h2>
        <div className={styles.timeline}>
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`${styles.timelineItem} ${idx % 2 === 0 ? styles.left : styles.right}`}
            >
              <div className={styles.timelineCard}>
                <div className={styles.year}>{achievement.year}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className={styles.sponsorValue}>{achievement.sponsorValue}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Brand Exposure Mockups
const BrandExposure = () => {
  return (
    <section className={styles.brandExposureSection}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.sectionTitle}
        >
          How Your Brand Gets <span className={styles.redAccent}>Visibility</span>
        </motion.h2>
        <div className={styles.exposureGrid}>
          {/* Uniform/Jersey Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.exposureCard}
          >
            <div className={styles.mockupContainer}>
              <div className={styles.jersey}>
                <div className={styles.jerseyTop}>
                  <span className={styles.sponsor}>SPONSOR</span>
                </div>
                <div className={styles.jerseyBody}>TEAM RAW</div>
              </div>
            </div>
            <h3>Team Uniforms</h3>
            <p>Your logo worn by 40+ team members at every competition and event throughout the year</p>
          </motion.div>

          {/* Robot Chassis Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.exposureCard}
          >
            <div className={styles.mockupContainer}>
              <div className={styles.robot}>
                <div className={styles.robotTop} />
                <div className={styles.robotSponsorZone}>SPONSOR LOGO</div>
                <div className={styles.robotBottom} />
              </div>
            </div>
            <h3>Robot Chassis</h3>
            <p>Prominent placement visible during matches, livestreams, and media coverage at national competitions</p>
          </motion.div>

          {/* Trailer Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.exposureCard}
          >
            <div className={styles.mockupContainer}>
              <div className={styles.trailer}>
                <div className={styles.trailerPanel}>SPONSOR BRANDING</div>
                <div className={styles.trailerWheels}>
                  <div className={styles.wheel}></div>
                  <div className={styles.wheel}></div>
                </div>
              </div>
            </div>
            <h3>Team Transportation</h3>
            <p>High-visibility branding on team trailer and vehicles at 15+ regional and state competitions</p>
          </motion.div>

          {/* Event Banners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.exposureCard}
          >
            <div className={styles.mockupContainer}>
              <div className={styles.banner}>
                <div className={styles.bannerContent}>
                  <span className={styles.bannerSponsor}>PRESENTED BY</span>
                  <span className={styles.bannerBrand}>YOUR BRAND</span>
                </div>
              </div>
            </div>
            <h3>Event Banners & Digital</h3>
            <p>Banners at competitions and digital exposure on social media reaching 50K+ annual impressions</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



// Contact & Call-to-Action
const ContactCTA = () => {
  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.contactContent}
        >
          <h2>Ready to Partner with <span className={styles.redAccent}>Team RAW?</span></h2>
          <p>Join 45+ organizations that are investing in robotics innovation. Your sponsorship makes a direct impact on student success and industry innovation.</p>
          
          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <strong>📊</strong>
              <span>Measurable ROI & Analytics</span>
            </div>
            <div className={styles.trustItem}>
              <strong>🏆</strong>
              <span>15+ National Competitions</span>
            </div>
            <div className={styles.trustItem}>
              <strong>🤝</strong>
              <span>Dedicated Partnership Manager</span>
            </div>
          </div>
          
          <div className={styles.contactMethods}>
            <motion.button
              className={styles.contactMethod}
              whileHover={{ scale: 1.05 }}
              onClick={() => alert('Coming Soon! Our sponsorship deck will be available shortly.')}
            >
              <span className={styles.icon}>📋</span>
              <div>
                <strong>Download Sponsorship Deck</strong>
                <p>View detailed opportunities</p>
              </div>
            </motion.button>

            <motion.a
              href="mailto:sponsors@teamraw.org"
              className={styles.contactMethod}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.icon}>✉️</span>
              <div>
                <strong>Email</strong>
                <p>sponsors@teamraw.org</p>
              </div>
            </motion.a>

            <motion.a
              href="tel:+1-555-TEAMRAW"
              className={styles.contactMethod}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.icon}>📞</span>
              <div>
                <strong>Schedule Call</strong>
                <p>+1 (555) 832-6729</p>
              </div>
            </motion.a>

            <motion.a
              href="#"
              className={styles.contactMethod}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.icon}>📍</span>
              <div>
                <strong>Meet in Person</strong>
                <p>Schedule a consultation</p>
              </div>
            </motion.a>
          </div>

          <motion.button
            className={styles.downloadButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Coming Soon! Our sponsorship deck will be available shortly.')}
          >
            Download Sponsorship Packet 📥
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default function SponsorsPage() {
  return (
    <>
      <Navbar />
      <SponsorHeroBanner />
      <BenefitsGrid />
      <ImpactNumbers />
      <AchievementsHighlights />
      <BrandExposure />
      <ContactCTA />
      <Footer />
    </>
  );
}
