/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/RobotsGallery.module.css';
import { useGlobalData } from '@/context/DataContext';

export default function RobotsGalleryEnhanced() {
  const { robots, galleryImages, isLoading, error } = useGlobalData();
  const [robotsData, setRobotsData] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detailViewItem, setDetailViewItem] = useState<any | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Temporary filter states for modal
  const [tempCategory, setTempCategory] = useState('all');
  const [tempYear, setTempYear] = useState<number | 'all'>('all');

  useEffect(() => {
    // Transform robots data
    const transformedRobots = robots && robots.length > 0
      ? robots.map((item: any) => ({
          id: item._id,
          name: item.name,
          type: item.type,
          description: item.description || 'High-performance robot',
          specs: item.specs?.slice(0, 3) || ['Autonomous', 'Precision Control', 'Advanced Sensors'],
          tags: item.tags?.slice(0, 2) || ['Innovation', 'Engineering'],
          category: 'robots',
          year: item.year,
        }))
      : galleryImages
          .filter((item: any) => item.category === 'robots')
          .map((item: any) => ({
            id: item._id,
            name: item.title,
            type: 'Robot',
            description: item.description || 'High-performance robot',
            specs: ['Autonomous', 'Precision Control', 'Advanced Sensors'],
            tags: ['Innovation', 'Engineering'],
            category: 'robots',
            year: item.year,
          }));

    // Transform gallery items
    const transformedGallery = galleryImages.map((item: any) => ({
      id: item._id,
      category: item.category || 'general',
      title: item.title,
      description: item.description,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      year: item.year,
    }));

    setRobotsData(transformedRobots);
    setGalleryItems(transformedGallery);
    setAllItems([...transformedRobots, ...transformedGallery]);
  }, [robots, galleryImages]);

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

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'robots', label: 'Robots' },
    { id: 'events', label: 'Events' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'team', label: 'Team' },
  ];

  // Get unique years from all items
  const availableYears = Array.from(
    new Set([...robotsData, ...galleryItems]
      .map(item => item.year)
      .filter(year => year !== undefined && year !== null))
  ).sort((a, b) => (b as number) - (a as number));

  // Apply both category and year filters
  const getFilteredItems = () => {
    let filtered = allItems;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === selectedYear);
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();
  
  // Calculate filtered counts - DYNAMIC
  const filteredRobots = filteredItems.filter(item => item.category === 'robots');
  const filteredGallery = filteredItems.filter(item => item.category !== 'robots');

  const openFilterModal = () => {
    setTempCategory(selectedCategory);
    setTempYear(selectedYear);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedYear(tempYear);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setTempCategory('all');
    setTempYear('all');
  };

  const removeFilter = (type: 'category' | 'year') => {
    if (type === 'category') {
      setSelectedCategory('all');
    } else {
      setSelectedYear('all');
    }
  };

  if (isLoading) {
    return (
      <section id="robots-gallery" style={{ marginBottom: '4rem', textAlign: 'center', padding: '2rem' }}>
        <p>Loading robots and gallery...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="robots-gallery" style={{ marginBottom: '4rem', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.2rem', color: '#B2001D', marginBottom: '1rem', fontWeight: '600' }}>
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Meet Our <span className={styles.redAccent}>Robots & Gallery</span>
          </h2>
          <p>Precision-engineered machines and moments that showcase our innovation</p>
          
          {/* Dynamic counter - FIXED */}
          <p className={styles.count}>
            {filteredRobots.length} robot{filteredRobots.length !== 1 ? 's' : ''} • {filteredGallery.length} gallery item{filteredGallery.length !== 1 ? 's' : ''} • Total: {filteredItems.length}
          </p>
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
          {availableYears.length > 0 && (
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Year:</span>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterButton} ${selectedYear === 'all' ? styles.active : ''}`}
                  onClick={() => setSelectedYear('all')}
                >
                  All
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    className={`${styles.filterButton} ${selectedYear === year ? styles.active : ''}`}
                    onClick={() => setSelectedYear(year as number)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Category:</span>
            <div className={styles.filterButtons}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.filterButton} ${selectedCategory === category.id ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
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
          Filter & Sort
          {(selectedYear !== 'all' || selectedCategory !== 'all') && (
            <span className={styles.filterBadge}>
              {(selectedYear !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
            </span>
          )}
        </motion.button>

        {/* Active Filter Summary */}
        {(selectedYear !== 'all' || selectedCategory !== 'all') && (
          <motion.div
            className={styles.activeFilters}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className={styles.activeFiltersLabel}>Filters:</span>
            {selectedYear !== 'all' && (
              <button
                className={styles.activeFilterTag}
                onClick={() => removeFilter('year')}
              >
                {selectedYear}
                <span className={styles.removeIcon}>✕</span>
              </button>
            )}
            {selectedCategory !== 'all' && (
              <button
                className={styles.activeFilterTag}
                onClick={() => removeFilter('category')}
              >
                {categories.find(c => c.id === selectedCategory)?.label}
                <span className={styles.removeIcon}>✕</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Content Grid - Placeholder for actual robot/gallery content */}
        <div className={styles.grid}>
          <p>Robot and gallery items will be displayed here...</p>
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
                  <h3>Filter & Sort</h3>
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
                  {availableYears.length > 0 && (
                    <div className={styles.modalFilterSection}>
                      <h4 className={styles.modalFilterLabel}>Year</h4>
                      <div className={styles.segmentedControl}>
                        <button
                          className={`${styles.segmentButton} ${tempYear === 'all' ? styles.segmentActive : ''}`}
                          onClick={() => setTempYear('all')}
                        >
                          All
                        </button>
                        {availableYears.map((year) => (
                          <button
                            key={year}
                            className={`${styles.segmentButton} ${tempYear === year ? styles.segmentActive : ''}`}
                            onClick={() => setTempYear(year as number)}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Filter Section */}
                  <div className={styles.modalFilterSection}>
                    <h4 className={styles.modalFilterLabel}>Category</h4>
                    <div className={styles.categoryGrid}>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          className={`${styles.categoryChip} ${tempCategory === category.id ? styles.categoryChipActive : ''}`}
                          onClick={() => setTempCategory(category.id)}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className={styles.modalActions}>
                  <button
                    className={styles.resetButton}
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                  <button
                    className={styles.applyButton}
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
