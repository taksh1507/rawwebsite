/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from '../styles/Gallery.module.css';
import { useGlobalData } from '@/context/DataContext';

export default function Gallery() {
  const { galleryImages, isLoading, error } = useGlobalData();
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    // Transform data to match component's expected format
    const transformedData = galleryImages.map((item: any) => ({
      id: item._id,
      category: item.category || 'general',
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }));

    setGalleryItems(transformedData);
  }, [galleryImages]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'robots', label: 'Robots' },
    { id: 'events', label: 'Events' },
    { id: 'workshops', label: 'Workshops' },
  ];

  // Get dynamic counts for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return galleryItems.length;
    return galleryItems.filter(item => item.category === categoryId).length;
  };

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <section id="gallery" className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our <span className={styles.redAccent}>Gallery</span></h2>
          </motion.div>
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '2rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#B2001D', marginBottom: '1rem', fontWeight: '600' }}>
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Our <span className={styles.redAccent}>Gallery</span></h2>
          <p>Capturing moments of innovation and achievement</p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className={styles.filterContainer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => {
            const count = getCategoryCount(category.id);
            return (
              <motion.button
                key={category.id}
                className={`${styles.filterButton} ${selectedCategory === category.id ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label} <span style={{ opacity: 0.7, fontSize: '0.9em' }}>({count})</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className={styles.masonryGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => {
              const spans = Math.random() > 0.5 ? 1 : 1;
              return (
                <motion.div
                  key={item.id}
                  className={`${styles.gridItem} ${styles[`span${spans}`]}`}
                  style={{ gridColumn: `span ${spans}` }}
                  variants={itemVariants}
                  exit="exit"
                  layoutId={`gallery-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <motion.div
                    className={styles.itemContent}
                    style={{ backgroundColor: item.imageUrl ? 'transparent' : item.color }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px',
                        }}
                      />
                    ) : (
                      <div className={styles.itemEmoji}>📸</div>
                    )}
                    <div className={styles.itemOverlay}>
                      <h3>{item.title}</h3>
                      <p>{item.category}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className={styles.lightboxBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className={styles.lightboxContent}
                layoutId={`gallery-${selectedItem.id}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={styles.lightboxImage}
                  style={{ backgroundColor: selectedItem.imageUrl ? 'transparent' : selectedItem.color }}
                >
                  {selectedItem.imageUrl ? (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxHeight: '80vh',
                      }}
                    />
                  ) : (
                    <div className={styles.lightboxEmoji}>📸</div>
                  )}
                </div>
                <div className={styles.lightboxInfo}>
                  <h3>{selectedItem.title}</h3>
                  <p>{selectedItem.category}</p>
                  <motion.button
                    className={styles.closeButton}
                    onClick={() => setSelectedItem(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
