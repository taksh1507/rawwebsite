/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Competitions.module.css';

const competitionsData = [
  {
    id: 1,
    name: 'e-Yantra Robotics Competition',
    organizer: 'IIT Bombay',
    year: 2024,
    achievement: 'Coming Soon',
    description: 'Multi-stage national robotics competition focusing on embedded systems, control algorithms, and real-world problem solving. E-Yantra is an initiative by IIT Bombay to promote robotics education and innovation.',
    tags: ['Embedded Systems', 'Control', 'Algorithms'],
  },
  {
    id: 2,
    name: 'DD Robocon India',
    organizer: 'Doordarshan & Ministry of Education',
    year: 2024,
    achievement: 'Coming Soon',
    description: 'Premier national robotics olympiad promoting innovation in mechanical and autonomous systems. DD Robocon is India\'s most prestigious robotics competition bringing together the best engineering colleges across the nation.',
    tags: ['Mechanical Design', 'Autonomous Control', 'Electronics'],
  },
  {
    id: 3,
    name: 'IIT Techfest',
    organizer: 'IIT Bombay',
    year: 2024,
    achievement: 'Coming Soon',
    description: 'Asia\'s largest science and technology festival featuring multiple robotics challenges including autonomous navigation, speed competitions, and innovative design events. IIT Techfest brings together brilliant minds from across the world.',
    tags: ['Design', 'Innovation', 'Autonomous'],
  },
];

const ACHIEVEMENT_BADGES = {
  'Coming Soon': '⏳ Coming Soon',
  'Participated': '✓ Participated',
  'Qualified': '✓ Qualified',
  'Top 10': '🏆 Top 10',
  'Finalist': '⭐ Finalist',
  'Winner': '🥇 Winner',
  'National Participation': '🇮🇳 National',
};

export default function Competitions() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
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
    if (showFilterModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilterModal]);

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
                whileHover={{
                  y: -10,
                  boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)',
                  borderColor: 'var(--color-red)',
                }}
              >
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
    </section>
  );
}
