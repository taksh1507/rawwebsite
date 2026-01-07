/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from '../styles/Competitions.module.css';

const competitionsData = [
  {
    id: 1,
    name: 'e-Yantra Robotics Competition 2026',
    organizer: 'IIT Bombay',
    year: 2026,
    achievement: 'Participated',
    description: 'Participating in IIT Bombay\'s prestigious e-Yantra 2026 competition. Successfully completed Task 1A with 47/50 marks and Task 1B with 48/50 marks, demonstrating strong capabilities in embedded systems and algorithmic problem-solving.',
    tags: ['Embedded Systems', 'Control', 'Algorithms', 'High Score'],
    imageUrl: '/eyantra.png',
  },
  {
    id: 2,
    name: 'DD Robocon 2026',
    organizer: 'Doordarshan & Ministry of Education',
    year: 2026,
    achievement: 'Qualified',
    description: 'Successfully registered and qualified for DD Robocon 2026 - India\'s most prestigious robotics competition. Ready to compete at the national level with our innovative robot design.',
    tags: ['Mechanical Design', 'Autonomous Control', 'Electronics'],
    imageUrl: '/Robocon2026.jpg',
  },
  {
    id: 3,
    name: 'DD Robocon 2025 - Stage 3',
    organizer: 'Doordarshan & Ministry of Education',
    year: 2025,
    achievement: 'Top 15',
    description: 'Secured position in Top 15 teams nationwide in DD Robocon 2025. Demonstrated exceptional technical excellence and innovation in mechanical design and autonomous control systems across three challenging stages.',
    tags: ['Mechanical Design', 'Autonomous Control', 'Electronics', 'Top 15'],
    imageUrl: '/robocon2025.png',
  },
  {
    id: 4,
    name: 'DD Robocon 2025 - Stage 2',
    organizer: 'Doordarshan & Ministry of Education',
    year: 2025,
    achievement: 'Qualified',
    description: 'Advanced to Stage 2 in May 2025 with outstanding performance score of 90/100 marks. Showcased superior robotics skills in autonomous navigation, precision control, and mechanical reliability.',
    tags: ['Mechanical Design', 'Autonomous Control', 'High Score'],
    imageUrl: '/robocon2025.png',
  },
  {
    id: 5,
    name: 'DD Robocon 2025 - Stage 1',
    organizer: 'Doordarshan & Ministry of Education',
    year: 2025,
    achievement: 'Qualified',
    description: 'Qualified Stage 1 in February 2025 with exceptional score of 95/100 marks. Demonstrated outstanding performance in initial qualification round, showcasing strong fundamentals in robotics design and execution.',
    tags: ['Mechanical Design', 'Autonomous Control', 'High Score'],
    imageUrl: '/robocon2025.png',
  },
  {
    id: 6,
    name: 'IIT Techfest 2025',
    organizer: 'IIT Bombay',
    year: 2025,
    achievement: 'Participated',
    description: 'Participated in Asia\'s largest science and technology festival featuring multiple robotics challenges including autonomous navigation, speed competitions, and innovative design events. Gained valuable experience competing against top teams.',
    tags: ['Design', 'Innovation', 'Autonomous'],
    imageUrl: '/Techfeast.jpg',
  },
  {
    id: 7,
    name: 'e-Yantra Robotics Competition 2025',
    organizer: 'IIT Bombay',
    year: 2025,
    achievement: 'Participated',
    description: 'Participated in IIT Bombay\'s prestigious e-Yantra multi-stage national robotics competition focusing on embedded systems, control algorithms, and real-world problem solving. An initiative promoting robotics education and innovation.',
    tags: ['Embedded Systems', 'Control', 'Algorithms'],
    imageUrl: '/eyantra.png',
  },
];

const ACHIEVEMENT_BADGES = {
  'Coming Soon': '⏳ Coming Soon',
  'Participated': '✓ Participated',
  'Qualified': '✓ Qualified',
  'Top 15': '🏆 Top 15',
  'Top 10': '🏆 Top 10',
  'Finalist': '⭐ Finalist',
  'Winner': '🥇 Winner',
  'National Participation': '🇮🇳 National',
};

export default function Competitions() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<typeof competitionsData[0] | null>(null);
  
  // Temporary filter states for modal
  const [tempYear, setTempYear] = useState<number | null>(null);
  const [tempDomains, setTempDomains] = useState<string[]>([]);

  // Get unique years and domains for filters
  const years = Array.from(new Set(competitionsData.map(c => c.year))).sort((a, b) => b - a);
  const allDomains = Array.from(new Set(competitionsData.flatMap(c => c.tags))).sort();

  // Domain groups for better organization
  const domainGroups = {
    'Core Tech': ['Algorithms', 'Control', 'Autonomous Control'],
    'Hardware': ['Electronics', 'Embedded Systems', 'Mechanical Design'],
    'Themes': ['Robotics', 'Innovation', 'Speed Challenge', 'Design', 'Autonomous']
  };

  // Check if filters have changed
  const hasChanges = tempYear !== selectedYear || 
    JSON.stringify([...tempDomains].sort()) !== JSON.stringify([...selectedDomains].sort());

  // Get active filter count
  const activeFilterCount = (selectedYear ? 1 : 0) + selectedDomains.length;

  // Filter competitions
  const filteredCompetitions = competitionsData.filter(comp => {
    const yearMatch = !selectedYear || comp.year === selectedYear;
    const domainMatch = selectedDomains.length === 0 || comp.tags.some(tag => selectedDomains.includes(tag));
    return yearMatch && domainMatch;
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showFilterModal || selectedCompetition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilterModal, selectedCompetition]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCompetition) {
          setSelectedCompetition(null);
        } else if (showFilterModal) {
          setShowFilterModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedCompetition, showFilterModal]);

  const openFilterModal = () => {
    setTempYear(selectedYear);
    setTempDomains([...selectedDomains]);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setSelectedYear(tempYear);
    setSelectedDomains([...tempDomains]);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setTempYear(null);
    setTempDomains([]);
  };

  const clearAllFilters = () => {
    setSelectedYear(null);
    setSelectedDomains([]);
    setTempYear(null);
    setTempDomains([]);
  };

  const removeFilter = (type: 'year' | 'domain', value?: string) => {
    if (type === 'year') {
      setSelectedYear(null);
    } else if (value) {
      setSelectedDomains(prev => prev.filter(d => d !== value));
    }
  };

  const toggleDomain = (domain: string) => {
    setTempDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain) 
        : [...prev, domain]
    );
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="competitions" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Competitions & <span className={styles.redAccent}>Achievements</span></h2>
          <p>Our participation in India's premier national robotics competitions</p>
        </motion.div>

        {/* Desktop Filters */}
        <motion.div
          className={styles.filtersDesktop}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Year Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Year:</span>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${!selectedYear ? styles.active : ''}`}
                onClick={() => setSelectedYear(null)}
              >
                All
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`${styles.filterButton} ${selectedYear === year ? styles.active : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Domain:</span>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${selectedDomains.length === 0 ? styles.active : ''}`}
                onClick={() => setSelectedDomains([])}
              >
                All
              </button>
              {allDomains.map(domain => (
                <button
                  key={domain}
                  className={`${styles.filterButton} ${selectedDomains.includes(domain) ? styles.active : ''}`}
                  onClick={() => {
                    if (selectedDomains.includes(domain)) {
                      setSelectedDomains(prev => prev.filter(d => d !== domain));
                    } else {
                      setSelectedDomains(prev => [...prev, domain]);
                    }
                  }}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Filter Button */}
        <motion.button
          className={styles.mobileFilterButton}
          onClick={openFilterModal}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="2" fill="currentColor" />
            <circle cx="16" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>
          Filters
          {(selectedYear || selectedDomains.length > 0) && (
            <span className={styles.filterBadge}>
              {(selectedYear ? 1 : 0) + selectedDomains.length}
            </span>
          )}
        </motion.button>

        {/* Active Filter Summary */}
        {(selectedYear || selectedDomains.length > 0) && (
          <motion.div
            className={styles.activeFilters}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className={styles.activeFiltersLabel}>Filters:</span>
            {selectedYear && (
              <button
                className={styles.activeFilterTag}
                onClick={() => removeFilter('year')}
              >
                {selectedYear}
                <span className={styles.removeIcon}>✕</span>
              </button>
            )}
            {selectedDomains.map(domain => (
              <button
                key={domain}
                className={styles.activeFilterTag}
                onClick={() => removeFilter('domain', domain)}
              >
                {domain}
                <span className={styles.removeIcon}>✕</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Results Counter */}
        <motion.p
          className={styles.resultCount}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Showing <span>{filteredCompetitions.length}</span> competition{filteredCompetitions.length !== 1 ? 's' : ''}
        </motion.p>

        {filteredCompetitions.length > 0 ? (
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredCompetitions.map((comp) => (
              <motion.div
                key={comp.id}
                className={styles.card}
                variants={itemVariants}
                onClick={() => setSelectedCompetition(comp)}
                whileHover={{
                  y: -10,
                  boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)',
                  borderColor: 'var(--color-red)',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {comp.imageUrl && (
                  <div className={styles.imageContainer}>
                    <Image
                      src={comp.imageUrl}
                      alt={comp.name}
                      width={400}
                      height={250}
                      className={styles.competitionImage}
                    />
                  </div>
                )}
                <div className={styles.cardHeader}>
                  <span className={styles.year}>{comp.year}</span>
                  <span className={styles.achievement} data-type={comp.achievement.toLowerCase().replace(/ /g, '-')}>{ACHIEVEMENT_BADGES[comp.achievement as keyof typeof ACHIEVEMENT_BADGES]}</span>
                </div>

                <h3 className={styles.title}>{comp.name}</h3>
                <p className={styles.organizer}>by {comp.organizer}</p>
                <p className={styles.description}>{comp.description}</p>

                <div className={styles.tags}>
                  {comp.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.border}></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className={styles.noResults}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p>No competitions found with the selected filters.</p>
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.filterModalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className={styles.filterModal}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setShowFilterModal(false);
                }
              }}
            >
              {/* Drag Handle */}
              <div className={styles.dragHandle} />

              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderLeft}>
                  <h3>Filters {activeFilterCount > 0 && <span className={styles.filterCount}>({activeFilterCount})</span>}</h3>
                  {activeFilterCount > 0 && (
                    <button
                      className={styles.clearAllButton}
                      onClick={clearAllFilters}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowFilterModal(false)}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className={styles.modalContent}>
                {/* Year Filter Section */}
                <div className={styles.modalFilterSection}>
                  <h4 className={styles.modalFilterLabel}>Year</h4>
                  <div className={styles.segmentedControl}>
                    <button
                      className={`${styles.segmentButton} ${!tempYear ? styles.segmentActive : ''}`}
                      onClick={() => setTempYear(null)}
                    >
                      All
                    </button>
                    {years.map(year => (
                      <button
                        key={year}
                        className={`${styles.segmentButton} ${tempYear === year ? styles.segmentActive : ''}`}
                        onClick={() => setTempYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Domain Filter Section - Grouped */}
                <div className={styles.modalFilterSection}>
                  <h4 className={styles.modalFilterLabel}>Domain</h4>
                  <div className={styles.domainScrollContainer}>
                    {Object.entries(domainGroups).map(([groupName, domains]) => (
                      <div key={groupName} className={styles.domainGroup}>
                        <h5 className={styles.domainGroupLabel}>{groupName}</h5>
                        <div className={styles.domainPillGrid}>
                          {domains.filter(d => allDomains.includes(d)).map(domain => (
                            <button
                              key={domain}
                              className={`${styles.domainPill} ${tempDomains.includes(domain) ? styles.domainPillActive : ''}`}
                              onClick={() => toggleDomain(domain)}
                            >
                              {tempDomains.includes(domain) && <span className={styles.checkIcon}>✓</span>}
                              {domain}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className={styles.modalActions}>
                <button
                  className={styles.resetButton}
                  onClick={resetFilters}
                  disabled={!tempYear && tempDomains.length === 0}
                >
                  Reset
                </button>
                <button
                  className={styles.applyButton}
                  onClick={applyFilters}
                  disabled={!hasChanges}
                >
                  Apply {(tempYear || tempDomains.length > 0) && `(${(tempYear ? 1 : 0) + tempDomains.length})`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Competition Details Modal */}
      <AnimatePresence>
        {selectedCompetition && (
          <motion.div
            className={styles.detailsModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCompetition(null)}
          >
            {/* Details Modal */}
            <motion.div
              className={styles.detailsModal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className={styles.detailsCloseButton}
                onClick={() => setSelectedCompetition(null)}
                aria-label="Close details"
              >
                ✕
              </button>

              {/* Modal Content */}
              <div className={styles.detailsContent}>
                {selectedCompetition.imageUrl && (
                  <div className={styles.detailsImageContainer}>
                    <Image
                      src={selectedCompetition.imageUrl}
                      alt={selectedCompetition.name}
                      width={800}
                      height={400}
                      className={styles.detailsImage}
                    />
                  </div>
                )}

                <div className={styles.detailsInfo}>
                  <div className={styles.detailsHeader}>
                    <div>
                      <h2 className={styles.detailsTitle}>{selectedCompetition.name}</h2>
                      <p className={styles.detailsOrganizer}>Organized by {selectedCompetition.organizer}</p>
                    </div>
                    <div className={styles.detailsBadges}>
                      <span className={styles.detailsYear}>{selectedCompetition.year}</span>
                      <span 
                        className={styles.detailsAchievement}
                        data-type={selectedCompetition.achievement.toLowerCase().replace(/ /g, '-')}
                      >
                        {ACHIEVEMENT_BADGES[selectedCompetition.achievement as keyof typeof ACHIEVEMENT_BADGES]}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailsDescription}>
                    <h3>About the Competition</h3>
                    <p>{selectedCompetition.description}</p>
                  </div>

                  <div className={styles.detailsTags}>
                    <h3>Focus Areas</h3>
                    <div className={styles.detailsTagsGrid}>
                      {selectedCompetition.tags.map((tag) => (
                        <span key={tag} className={styles.detailsTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className={styles.detailsStats}>
                    <div className={styles.detailsStatItem}>
                      <span className={styles.detailsStatIcon}>📅</span>
                      <div>
                        <h4>Year</h4>
                        <p>{selectedCompetition.year}</p>
                      </div>
                    </div>
                    <div className={styles.detailsStatItem}>
                      <span className={styles.detailsStatIcon}>🏆</span>
                      <div>
                        <h4>Achievement</h4>
                        <p>{selectedCompetition.achievement}</p>
                      </div>
                    </div>
                    <div className={styles.detailsStatItem}>
                      <span className={styles.detailsStatIcon}>🎓</span>
                      <div>
                        <h4>Organizer</h4>
                        <p>{selectedCompetition.organizer}</p>
                      </div>
                    </div>
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
