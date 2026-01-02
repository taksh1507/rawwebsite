'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/RobotsShowcase.module.css';
import mobileStyles from '../styles/RobotsGallery.module.css';
import { useGlobalData } from '@/context/DataContext';

export default function RobotsGallery() {
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
    console.log('🔍 RobotsGallery - Data received:', { 
      robotsCount: robots?.length, 
      galleryImagesCount: galleryImages?.length 
    });

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

    console.log('✅ Transformed data:', { 
      robotsCount: transformedRobots.length, 
      galleryCount: transformedGallery.length 
    });

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
  
  // Calculate filtered counts
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

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, scale: 0.8 },
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
    <section id="robots-gallery" style={{ paddingTop: '4rem', paddingBottom: '4rem', background: 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Combined Header - Premium */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1rem', 
            color: 'var(--color-navy)', 
            fontWeight: 700,
            fontFamily: 'Orbitron, sans-serif',
          }}>
            Meet Our <span style={{ color: 'var(--color-red)' }}>Robots & Gallery</span>
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-gray-dark)', 
            maxWidth: '600px', 
            margin: '0 auto',
          }}>
            Precision-engineered machines and moments that showcase our innovation
          </p>
          {/* Dynamic counter showing filtered results */}
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            {filteredRobots.length} robot{filteredRobots.length !== 1 ? 's' : ''} • {filteredGallery.length} gallery item{filteredGallery.length !== 1 ? 's' : ''} • Total: {filteredItems.length}
          </p>
        </motion.div>

        {/* Year Filter - Compact style above category filters */}
        {availableYears.length > 0 && (
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <span style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: '#64748b',
              letterSpacing: '0.02em',
              fontFamily: 'Inter, sans-serif',
            }}>
              Year:
            </span>
            <button
              onClick={() => setSelectedYear('all')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: selectedYear === 'all' ? 'none' : '1px solid #e2e8f0',
                background: selectedYear === 'all' 
                  ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' 
                  : '#ffffff',
                color: selectedYear === 'all' ? '#ffffff' : '#64748b',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'Inter, sans-serif',
                boxShadow: selectedYear === 'all' 
                  ? '0 2px 8px rgba(100, 116, 139, 0.3)' 
                  : '0 1px 3px rgba(10, 26, 58, 0.05)',
              }}
            >
              All
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year as number)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  border: selectedYear === year ? 'none' : '1px solid #e2e8f0',
                  background: selectedYear === year 
                    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' 
                    : '#ffffff',
                  color: selectedYear === year ? '#ffffff' : '#64748b',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: selectedYear === year 
                    ? '0 2px 8px rgba(100, 116, 139, 0.3)' 
                    : '0 1px 3px rgba(10, 26, 58, 0.05)',
                }}
              >
                {year}
              </button>
            ))}
          </motion.div>
        )}

        {/* Unified Category Filters - Premium Style */}
        <motion.div
          style={{
            display: 'flex',
            gap: '0.875rem',
            justifyContent: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.75rem 1.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: selectedCategory === category.id ? 'none' : '1px solid #e2e8f0',
                background: selectedCategory === category.id 
                  ? 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)' 
                  : '#ffffff',
                color: selectedCategory === category.id ? '#ffffff' : '#475569',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'Inter, sans-serif',
                boxShadow: selectedCategory === category.id 
                  ? '0 4px 12px rgba(178, 0, 29, 0.3)' 
                  : '0 2px 8px rgba(10, 26, 58, 0.05)',
              }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Mobile Filter Button */}
        <motion.button
          className={mobileStyles.mobileFilterButton}
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
            <span className={mobileStyles.filterBadge}>
              {(selectedYear !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
            </span>
          )}
        </motion.button>

        {/* Active Filter Summary */}
        {(selectedYear !== 'all' || selectedCategory !== 'all') && (
          <motion.div
            className={mobileStyles.activeFilters}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className={mobileStyles.activeFiltersLabel}>Filters:</span>
            {selectedYear !== 'all' && (
              <button
                className={mobileStyles.activeFilterTag}
                onClick={() => removeFilter('year')}
              >
                {selectedYear}
                <span className={mobileStyles.removeIcon}>✕</span>
              </button>
            )}
            {selectedCategory !== 'all' && (
              <button
                className={mobileStyles.activeFilterTag}
                onClick={() => removeFilter('category')}
              >
                {categories.find(c => c.id === selectedCategory)?.label}
                <span className={mobileStyles.removeIcon}>✕</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Combined Gallery Grid - Responsive with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedYear}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2.5rem',
              minHeight: '200px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Render filtered robots */}
            {filteredRobots.map((robot) => (
            <motion.div
              key={robot.id}
              variants={itemVariants}
              style={{
                cursor: 'pointer',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #0d1f3e 0%, #1a3254 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(10, 26, 58, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
              whileHover={{ 
                y: -6, 
                boxShadow: '0 12px 32px rgba(178, 0, 29, 0.2), 0 0 0 1px rgba(178, 0, 29, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(178, 0, 29, 0.3)'
              }}
            >
              {/* Image Container */}
              <div style={{ 
                height: '240px', 
                overflow: 'hidden', 
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)', 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {/* Spotlight Effect */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '180px',
                  height: '180px',
                  background: 'radial-gradient(circle, rgba(178, 0, 29, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                }}></div>
                
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <Image 
                    src="/robot.png" 
                    alt={robot.name || 'Robot'}
                    width={200}
                    height={200}
                    style={{ filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3))' }}
                  />
                </motion.div>
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(178, 0, 29, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 2,
                }}>
                  ROBOT
                </div>
              </div>

              {/* Content Container */}
              <div style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                flexDirection: 'column', 
                flexGrow: 1,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
              }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.4rem', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {robot.name}
                </h3>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(178, 0, 29, 1)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: '#B2001D',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}></span>
                  {robot.type}
                </div>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '0.95rem', 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  lineHeight: 1.6, 
                  flexGrow: 1,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {robot.description}
                </p>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {robot.specs?.slice(0, 2).map((spec: string, idx: number) => (
                    <span key={idx} style={{
                      fontSize: '0.75rem',
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.85)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      fontWeight: 500,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {spec}
                    </span>
                  ))}
                </div>
                {/* View Details Button */}
                <motion.button
                  onClick={() => setDetailViewItem(robot)}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 8px 24px rgba(178, 0, 29, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '0.85rem 1.75rem',
                    background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 12px rgba(178, 0, 29, 0.3)',
                  }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Render filtered gallery items */}
          {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                style={{
                  cursor: 'pointer',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid rgba(10, 26, 58, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(10, 26, 58, 0.08)',
                }}
                whileHover={{ 
                  y: -6, 
                  boxShadow: '0 12px 32px rgba(10, 26, 58, 0.15)',
                  borderColor: 'rgba(10, 26, 58, 0.12)',
                }}
              >
                {/* Image Container */}
                <div style={{ 
                  height: '240px', 
                  overflow: 'hidden', 
                  background: item.color || 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)', 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image 
                      src="/robot.png" 
                      alt={item.title || 'Gallery Item'}
                      width={200}
                      height={200}
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' }}
                    />
                  </motion.div>
                  {/* Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 12px rgba(178, 0, 29, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    {item.category}
                  </div>
                </div>

                {/* Content Container */}
                <div style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexGrow: 1,
                  background: '#ffffff',
                }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.3rem', 
                    color: '#0a1a3a', 
                    fontWeight: 700, 
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 1.25rem 0', 
                    fontSize: '0.95rem', 
                    color: '#64748b', 
                    lineHeight: 1.6, 
                    flexGrow: 1,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {item.description}
                  </p>
                  {/* View Details Button */}
                  <motion.button
                    onClick={() => setDetailViewItem(item)}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 24px rgba(178, 0, 29, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '0.85rem 1.75rem',
                      background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.02em',
                      boxShadow: '0 4px 12px rgba(178, 0, 29, 0.3)',
                    }}
                  >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
            ))}

            {/* Empty State Message for filtered results */}
            {filteredItems.length === 0 && (
              <motion.div
                style={{ 
                  gridColumn: '1 / -1',
                  textAlign: 'center', 
                  padding: '4rem 2rem', 
                  color: '#666' 
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  No items found for the selected filters
                </p>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  Try selecting different category or year filters
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Debug Info */}
        {robotsData.length === 0 && galleryItems.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#fff3cd', borderRadius: '8px', marginTop: '2rem' }}>
            <p style={{ color: '#856404', fontWeight: 600 }}>⚠️ No data loaded</p>
            <p style={{ fontSize: '0.9rem', color: '#856404', marginTop: '0.5rem' }}>
              Robots: {robotsData.length}, Gallery: {galleryItems.length}
            </p>
          </div>
        )}
      </div>

      {/* Detailed View Modal - Premium Design */}
      <AnimatePresence>
        {detailViewItem && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setDetailViewItem(null)}
          >
            <motion.div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 40px 120px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setDetailViewItem(null)}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 90,
                  boxShadow: '0 6px 20px rgba(178, 0, 29, 0.5)',
                }}
                whileTap={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '1.75rem',
                  right: '1.75rem',
                  background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(178, 0, 29, 0.3)',
                }}
              >
                ✕
              </motion.button>

              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #0a1a3a 0%, #152845 50%, #1a3254 100%)',
                padding: '3rem 3rem 2.5rem',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle gradient overlay */}
                <div style={{
                  content: '',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'radial-gradient(circle at 20% 50%, rgba(178, 0, 29, 0.15) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}></div>

                <motion.div 
                  style={{
                    fontSize: detailViewItem.category === 'robots' ? '5rem' : '4rem',
                    width: '140px',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {detailViewItem.category === 'robots' ? '🤖' : '📸'}
                </motion.div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{
                    fontSize: '2.25rem',
                    margin: '0 0 0.75rem 0',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-1px',
                    lineHeight: 1.2,
                  }}>
                    {detailViewItem.name || detailViewItem.title}
                  </h2>
                  <motion.span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.2rem',
                      background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                      color: '#ffffff',
                      borderRadius: '24px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontFamily: 'Inter, sans-serif',
                      boxShadow: '0 4px 12px rgba(178, 0, 29, 0.4)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.span
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#ffffff',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                      animate={{
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                    {detailViewItem.type || detailViewItem.category}
                  </motion.span>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{
                padding: '3rem',
                background: '#ffffff',
                overflowY: 'auto',
                flex: 1,
              }}>
                {/* Description Section */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    Description
                  </h3>
                  <p style={{
                    fontSize: '1.05rem',
                    color: '#334155',
                    lineHeight: 1.7,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                  }}>
                    {detailViewItem.description}
                  </p>
                </div>

                {/* Specifications Section (for robots) */}
                {detailViewItem.specs && detailViewItem.specs.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginBottom: '1rem',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      Specifications
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1rem',
                    }}>
                      {detailViewItem.specs.map((spec: string, idx: number) => (
                        <motion.div
                          key={idx}
                          style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(178, 0, 29, 0.04)',
                            borderLeft: '3px solid #B2001D',
                            fontSize: '0.95rem',
                            color: '#1e293b',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            borderRadius: '6px',
                            transition: 'all 0.3s ease',
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{
                            background: 'rgba(178, 0, 29, 0.08)',
                            x: 4,
                          }}
                        >
                          <span style={{ color: '#B2001D', marginRight: '0.75rem', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                          {spec}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Section */}
                {detailViewItem.tags && detailViewItem.tags.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginBottom: '1rem',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      Tags
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}>
                      {detailViewItem.tags.map((tag: string, idx: number) => (
                        <motion.span 
                          key={idx} 
                          style={{
                            padding: '0.6rem 1.2rem',
                            background: 'transparent',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            borderRadius: '24px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            fontFamily: 'Inter, sans-serif',
                            transition: 'all 0.3s ease',
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{
                            borderColor: '#cbd5e1',
                            background: '#f8fafc',
                            color: '#1e293b',
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className={mobileStyles.filterModalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className={mobileStyles.filterModal}
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
              <div className={mobileStyles.dragHandle} />

              {/* Modal Header */}
              <div className={mobileStyles.modalHeader}>
                <h3>Filter & Sort</h3>
                <button
                  className={mobileStyles.closeButton}
                  onClick={() => setShowFilterModal(false)}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className={mobileStyles.modalContent}>
                {/* Year Filter Section */}
                {availableYears.length > 0 && (
                  <div className={mobileStyles.modalFilterSection}>
                    <h4 className={mobileStyles.modalFilterLabel}>Year</h4>
                    <div className={mobileStyles.segmentedControl}>
                      <button
                        className={`${mobileStyles.segmentButton} ${tempYear === 'all' ? mobileStyles.segmentActive : ''}`}
                        onClick={() => setTempYear('all')}
                      >
                        All
                      </button>
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          className={`${mobileStyles.segmentButton} ${tempYear === year ? mobileStyles.segmentActive : ''}`}
                          onClick={() => setTempYear(year as number)}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Filter Section */}
                <div className={mobileStyles.modalFilterSection}>
                  <h4 className={mobileStyles.modalFilterLabel}>Category</h4>
                  <div className={mobileStyles.categoryGrid}>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`${mobileStyles.categoryChip} ${tempCategory === category.id ? mobileStyles.categoryChipActive : ''}`}
                        onClick={() => setTempCategory(category.id)}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className={mobileStyles.modalActions}>
                <button
                  className={mobileStyles.resetButton}
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
                <button
                  className={mobileStyles.applyButton}
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
