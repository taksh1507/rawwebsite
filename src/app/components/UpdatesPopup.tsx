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
  actionType?: 'none' | 'modal' | 'link';
  actionUrl?: string | null;
  ctaLabel?: string;
  imageUrl?: string | null;
}

export default function UpdatesPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch updates from API
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/updates?active=true');
        
        if (!response.ok) {
          console.error(`API Error: ${response.status} ${response.statusText}`);
          setUpdates([]);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Take only the first 3 updates
          setUpdates(data.data.slice(0, 3));
        } else {
          setUpdates([]);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();

    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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
      if (e.key === 'Escape') {
        if (showDetailModal) {
          handleCloseDetailModal();
        } else if (showPopup) {
          setShowPopup(false);
        }
      }
    };

    if (showPopup || showDetailModal) {
      document.addEventListener('keydown', handleEscape);
      // Lock body scroll when modals are open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    };
  }, [showPopup, showDetailModal]);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleViewDetails = (update: Update) => {
    setSelectedUpdate(update);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedUpdate(null), 300);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to detect and linkify URLs in text
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: '#B2001D',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
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
                              {linkifyText(update.description)}
                            </p>

                            {/* View Button */}
                            {update.actionType && update.actionType !== 'none' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  if (update.actionType === 'modal') {
                                    handleViewDetails(update);
                                  } else if (update.actionType === 'link' && update.actionUrl) {
                                    handleExternalLink(update.actionUrl);
                                  }
                                }}
                                style={{
                                  marginTop: '0.75rem',
                                  padding: '0.5rem 1rem',
                                  background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  fontFamily: 'Inter, sans-serif',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                {update.ctaLabel || 'View'}
                                {update.actionType === 'link' && (
                                  <span style={{ fontSize: '0.75rem' }}>↗</span>
                                )}
                              </motion.button>
                            )}
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

      {/* Detail Modal */}
      {showDetailModal && selectedUpdate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseDetailModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isMobile ? '100%' : '100%',
              maxWidth: isMobile ? '100%' : '600px',
              height: isMobile ? '100vh' : 'auto',
              maxHeight: isMobile ? '100vh' : '90vh',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: isMobile ? '0' : '20px',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(10, 26, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {selectedUpdate.category === 'announcement' && '📢'}
                  {selectedUpdate.category === 'achievement' && '🏆'}
                  {selectedUpdate.category === 'event' && '📅'}
                  {selectedUpdate.category === 'general' && '📝'}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#B2001D',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {new Date(selectedUpdate.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <button
                onClick={handleCloseDetailModal}
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

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
              }}
            >
              {/* Image */}
              {selectedUpdate.imageUrl && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={selectedUpdate.imageUrl}
                    alt={selectedUpdate.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <h2
                style={{
                  fontSize: '1.75rem',
                  color: '#0a1a3a',
                  margin: '0 0 1rem 0',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {selectedUpdate.title}
              </h2>

              {/* Full Description */}
              <p
                style={{
                  fontSize: '1rem',
                  color: '#475569',
                  margin: 0,
                  lineHeight: 1.7,
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {linkifyText(selectedUpdate.description)}
              </p>
            </div>

            {/* Footer with CTA */}
            {selectedUpdate.actionType === 'link' && selectedUpdate.actionUrl && (
              <div
                style={{
                  padding: isMobile ? '1rem 1.5rem' : '1.5rem 2rem',
                  borderTop: '1px solid rgba(10, 26, 58, 0.1)',
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  position: isMobile ? 'sticky' : 'relative',
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExternalLink(selectedUpdate.actionUrl!)}
                  style={{
                    padding: isMobile ? '1rem 2rem' : '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '1.125rem' : '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {selectedUpdate.ctaLabel || 'Visit Link'}
                  <span style={{ fontSize: '0.875rem' }}>↗</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
