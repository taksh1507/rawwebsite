'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles/RobotsShowcase.module.css';
import { useGlobalData } from '@/context/DataContext';

// Fallback local data for when context is not available
const fallbackRobotsData = [
  {
    id: 1,
    name: 'AutoTrace',
    type: 'Line Follower',
    image: '🤖',
    description: 'Autonomous line-following robot with precision sensors',
    specs: ['IR Sensors', 'PWM Control', '30cm/s Max Speed'],
    tags: ['Autonomous', 'Sensor-based'],
    year: 2024,
  },
  {
    id: 2,
    name: 'MazeSolver',
    type: 'Maze Navigator',
    image: '🔍',
    description: 'Intelligent maze-solving robot using wall following',
    specs: ['Ultrasonic Sensors', 'Left-hand Rule', 'Real-time Decision'],
    tags: ['Navigation', 'AI Logic'],
    year: 2024,
  },
  {
    id: 3,
    name: 'PickBot',
    type: 'Pick & Place',
    image: '🦾',
    description: 'Robotic arm for precise object manipulation',
    specs: ['4-DOF Arm', '5kg Payload', 'Servo Control'],
    tags: ['Manipulation', 'Precision'],
    year: 2023,
  },
  {
    id: 4,
    name: 'VisionBot',
    type: 'Computer Vision',
    image: '👁️',
    description: 'Robot with advanced vision processing capabilities',
    specs: ['HD Camera', 'OpenCV', 'Real-time Detection'],
    tags: ['Vision', 'ML'],
    year: 2023,
  },
];

export default function RobotsShowcase() {
  const { robots: contextRobots, isLoading } = useGlobalData();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  
  // Use context robots if available and has data, otherwise use fallback
  const robotsSource = contextRobots && contextRobots.length > 0 
    ? contextRobots.slice(0, 8).map((robot, idx) => ({
        id: idx + 1,
        name: robot.name,
        type: robot.type,
        image: '🤖', // Default emoji for all context robots
        description: robot.description,
        specs: robot.specs.slice(0, 3), // Show only first 3 specs
        tags: robot.tags.slice(0, 2), // Show only first 2 tags
        year: robot.year,
      }))
    : fallbackRobotsData;

  // Get unique years from robots data
  const availableYears = Array.from(
    new Set(robotsSource.map(robot => robot.year).filter(year => year !== undefined))
  ).sort((a, b) => (b as number) - (a as number));

  // Filter robots by selected year
  const filteredRobots = selectedYear === 'all' 
    ? robotsSource 
    : robotsSource.filter(robot => robot.year === selectedYear);

  const [selectedRobot, setSelectedRobot] = useState<typeof robotsSource[0] | null>(null);
  const [detailViewRobot, setDetailViewRobot] = useState<typeof robotsSource[0] | null>(null);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' as any },
    },
  };

  if (isLoading) {
    return (
      <section id="robots" className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading robots...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="robots" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Meet Our <span className={styles.redAccent}>Robots</span></h2>
          <p>Precision-engineered machines that push the boundaries of automation</p>
        </motion.div>

        {/* Year Filter */}
        {availableYears.length > 0 && (
          <motion.div
            className={styles.filterContainer}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.filterLabel}>Filter by Year:</div>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${selectedYear === 'all' ? styles.activeFilter : ''}`}
                onClick={() => setSelectedYear('all')}
              >
                All Years
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  className={`${styles.filterBtn} ${selectedYear === year ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedYear(year as number)}
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredRobots.map((robot) => (
            <motion.div
              key={robot.id}
              className={`${styles.card} ${selectedRobot?.id === robot.id ? styles.selected : ''}`}
              variants={itemVariants}
              onClick={() => setSelectedRobot(selectedRobot?.id === robot.id ? null : robot)}
            >
              {/* Robot Badge */}
              <div className={styles.robotBadge}>
                ROBOT
              </div>
              
              <div className={styles.imageContainer}>
                <motion.div
                  className={styles.image}
                  animate={{
                    y: selectedRobot?.id === robot.id ? [-5, 5, -5] : [0, 0, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {robot.image}
                </motion.div>
                <div className={styles.glowBorder}></div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.header2}>
                  <h3 className={styles.title}>{robot.name}</h3>
                  <span className={styles.type}>{robot.type}</span>
                </div>

                <p className={styles.description}>{robot.description}</p>

                <div className={styles.tags}>
                  {robot.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedRobot?.id === robot.id && (
                  <motion.div
                    className={styles.specsOverlay}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4>Specifications</h4>
                    <ul>
                      {robot.specs.map((spec) => (
                        <li key={spec}>
                          <span className={styles.bullet}>▸</span> {spec}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <motion.button
                  className={styles.viewDetailsBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailViewRobot(robot);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {detailViewRobot && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailViewRobot(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setDetailViewRobot(null)}
              >
                ✕
              </button>

              <div className={styles.modalHeader}>
                <div className={styles.modalImage}>{detailViewRobot.image}</div>
                <div>
                  <h2 className={styles.modalTitle}>{detailViewRobot.name}</h2>
                  <span className={styles.modalType}>{detailViewRobot.type}</span>
                </div>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <h3>Description</h3>
                  <p>{detailViewRobot.description}</p>
                </div>

                <div className={styles.modalSection}>
                  <h3>Specifications</h3>
                  <ul className={styles.modalSpecsList}>
                    {detailViewRobot.specs.map((spec) => (
                      <li key={spec}>
                        <span className={styles.checkmark}>✓</span> {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>Tags</h3>
                  <div className={styles.modalTags}>
                    {detailViewRobot.tags.map((tag) => (
                      <span key={tag} className={styles.modalTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
