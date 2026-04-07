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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  useEffect(() => {
    // Transform data to match component's expected format
    const transformedData = galleryImages.map((item: any) => {
      console.log('🔍 Gallery Item from API:', item);
      return {
        id: item._id,
        category: item.category || 'general',
        title: item.title,
        description: item.description,
        detailedDescription: item.detailedDescription,
        imageUrl: item.imageUrl,
        images: item.images || [],
        location: item.location,
        date: item.date,
        participants: item.participants,
        highlights: item.highlights || [],
        uploadedBy: item.uploadedBy,
        year: item.year,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
    });

    console.log('✅ Transformed Gallery Items:', transformedData);
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
                  onClick={() => {
                    console.log('🖼️ Selected Item for Modal:', item);
                    setSelectedItem(item);
                    setCurrentImageIndex(0);
                  }}
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
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              key={`lightbox-${selectedItem.id}`}
              className={styles.lightboxBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className={styles.lightboxContent}
                layoutId={`gallery-${selectedItem.id}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  maxWidth: '1000px', 
                  maxHeight: '90vh', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Gallery Section */}
                <div
                  className={styles.lightboxImage}
                  style={{ 
                    backgroundColor: selectedItem.imageUrl ? 'transparent' : selectedItem.color, 
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <>
                      <img
                        src={selectedItem.images[currentImageIndex]}
                        alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          maxHeight: '60vh',
                        }}
                      />
                      {/* Image Navigation */}
                      {selectedItem.images.length > 1 && (
                        <>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedItem.images.length - 1));
                            }}
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              position: 'absolute',
                              left: '1rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(178, 0, 29, 0.95)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '56px',
                              height: '56px',
                              fontSize: '2rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              transition: 'all 0.3s ease',
                              boxShadow: '0 6px 20px rgba(178, 0, 29, 0.5)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            ‹
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev < selectedItem.images.length - 1 ? prev + 1 : 0));
                            }}
                            whileHover={{ scale: 1.1, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              position: 'absolute',
                              right: '1rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(178, 0, 29, 0.95)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '56px',
                              height: '56px',
                              fontSize: '2rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              transition: 'all 0.3s ease',
                              boxShadow: '0 6px 20px rgba(178, 0, 29, 0.5)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            ›
                          </motion.button>
                          <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                          }}>
                            {currentImageIndex + 1} / {selectedItem.images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : selectedItem.imageUrl ? (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxHeight: '60vh',
                      }}
                    />
                  ) : (
                    <div className={styles.lightboxEmoji}>📸</div>
                  )}
                </div>
                
                {/* Thumbnail Strip for Multiple Images */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '1rem',
                    overflowX: 'auto',
                    background: '#f8f9fa',
                    flexShrink: 0,
                  }}>
                    {selectedItem.images.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: currentImageIndex === index ? '3px solid #B2001D' : '2px solid #ddd',
                          opacity: currentImageIndex === index ? 1 : 0.6,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Info Section */}
                <div className={styles.lightboxInfo} style={{ 
                  padding: '2rem',
                  overflowY: 'auto',
                  flex: 1,
                }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#0d1f3e' }}>{selectedItem.title}</h3>
                  
                  {/* Metadata Row */}
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>📂</strong> {selectedItem.category}
                    </span>
                    {selectedItem.date && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>📅</strong> {new Date(selectedItem.date).toLocaleDateString()}
                      </span>
                    )}
                    {selectedItem.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>📍</strong> {selectedItem.location}
                      </span>
                    )}
                    {selectedItem.participants && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>👥</strong> {selectedItem.participants}
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  {selectedItem.description && (
                    <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#333' }}>
                      {selectedItem.description}
                    </p>
                  )}
                  
                  {/* Detailed Description */}
                  {selectedItem.detailedDescription && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#0d1f3e' }}>About</h4>
                      <p style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                        {selectedItem.detailedDescription}
                      </p>
                    </div>
                  )}
                  
                  {/* Highlights */}
                  {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#0d1f3e' }}>Highlights</h4>
                      <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                        {selectedItem.highlights.map((highlight: string, index: number) => (
                          <li key={index} style={{ color: '#555' }}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <motion.button
                    className={styles.closeButton}
                    onClick={() => {
                      setSelectedItem(null);
                      setCurrentImageIndex(0);
                    }}
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
