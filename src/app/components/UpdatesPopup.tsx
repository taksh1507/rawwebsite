/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Update {
  _id: string;
  title: string;
  description: string;
  category: 'announcement' | 'achievement' | 'event' | 'general';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isActive: boolean;
  author?: string;
}

export default function UpdatesPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch updates from API
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/updates?active=true');
        const data = await response.json();
        
        if (data.success) {
          // Take only the first 3 updates
          setUpdates(data.data.slice(0, 3) || []);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  useEffect(() => {
    // Show popup after a short delay if there are updates
    if (!loading && updates.length > 0) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [loading, updates]);

  useEffect(() => {
    // ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPopup) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          {/* Centered Latest Updates Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '420px',
              maxWidth: '90vw',
              maxHeight: '75vh',
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRadius: '18px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header - Premium & Corporate */}
            <div
              style={{
                padding: '1.75rem 2rem',
                borderBottom: '1px solid rgba(10, 26, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'Orbitron, sans-serif',
                flexShrink: 0,
                  color: '#0a1a3a',
                  margin: 0,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Latest <span style={{ color: '#B2001D' }}>Updates</span>
              </h2>

              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(10, 26, 58, 0.15)',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '1.25rem',
                  transition: 'all 0.3s',
                  fontWeight: 300,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(178, 0, 29, 0.1)';
                  e.currentTarget.style.color = '#B2001D';
                  e.currentTarget.style.borderColor = '#B2001D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = 'rgba(10, 26, 58, 0.15)';
                }}
              >
                ×
              </button>
            </div>

            {/* Body - Internal Scrolling Container */}
            <div 
              style={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
              className="updates-scroll"
            >
              <style jsx>{`
                .updates-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(178, 0, 29, 0.3) rgba(10, 26, 58, 0.05);
                }
                .updates-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .updates-scroll::-webkit-scrollbar-track {
                  background: rgba(10, 26, 58, 0.05);
                  border-radius: 10px;
                }
                .updates-scroll::-webkit-scrollbar-thumb {
                  background: rgba(178, 0, 29, 0.3);
                  border-radius: 10px;
                  transition: background 0.2s;
                }
                .updates-scroll::-webkit-scrollbar-thumb:hover {
                  background: rgba(178, 0, 29, 0.5);
                }
                
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                  .updates-scroll {
                    padding: 1rem 1.5rem 1.5rem !important;
                  }
                }
              `}</style>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid rgba(178, 0, 29, 0.2)',
                      borderTopColor: '#B2001D',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      margin: '0 auto',
                    }}></div>
                  </div>
                ) : updates.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>📭</p>
                    <p style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>No updates available</p>
                  </div>
                ) : (
                  updates.map((update, idx) => {
                    const getCategoryIcon = (category: string) => {
                      switch (category) {
                        case 'announcement': return '📢';
                        case 'achievement': return '🏆';
                        case 'event': return '📅';
                        default: return '📝';
                      }
                    };

                    const formatDate = (timestamp: string) => {
                      return new Date(timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                    };

                    return (
                      <motion.div
                        key={update._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (0.1 * idx) }}
                        style={{
                          position: 'relative',
                          padding: '1.25rem 1.25rem 1.25rem 1.75rem',
                          background: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '12px',
                          border: '1px solid rgba(10, 26, 58, 0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'default',
                        }}
                        whileHover={{
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                          y: -2,
                        }}
                      >
                        {/* Left Accent Strip */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            background: update.priority === 'high' 
                              ? 'linear-gradient(180deg, #B2001D 0%, #8a0016 100%)'
                              : 'linear-gradient(180deg, #64748b 0%, #475569 100%)',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                          }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          {/* Icon */}
                          <div 
                            style={{ 
                              fontSize: '1.75rem',
                              flexShrink: 0,
                              lineHeight: 1,
                            }}
                          >
                            {getCategoryIcon(update.category)}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            {/* Date */}
                            <p
                              style={{
                                fontSize: '0.75rem',
                                color: '#B2001D',
                                fontWeight: 600,
                                margin: '0 0 0.5rem 0',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                fontFamily: 'Inter, sans-serif',
                              }}
                            >
                              {formatDate(update.timestamp)}
                            </p>

                            {/* Title */}
                            <h3
                              style={{
                                fontSize: '1rem',
                                color: '#0a1a3a',
                                margin: '0 0 0.5rem 0',
                                fontWeight: 700,
                                lineHeight: 1.4,
                                fontFamily: 'Inter, sans-serif',
                              }}
                            >
                              {update.title}
                            </h3>

                            {/* Description */}
                            <p
                              style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                margin: 0,
                                lineHeight: 1.6,
                                fontFamily: 'Inter, sans-serif',
                              }}
                            >
                              {update.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
