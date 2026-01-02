'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function UpdatesPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
            }}
          />

          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(10, 26, 58, 0.1)',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0a1a3a 0%, #1a3254 100%)',
                padding: '2rem',
                borderTopLeftRadius: '18px',
                borderTopRightRadius: '18px',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(178, 0, 29, 0.8)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ×
              </button>

              <h2
                style={{
                  fontSize: '2rem',
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ffffff',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Latest <span style={{ color: '#B2001D' }}>Updates</span> 🚀
              </h2>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { date: 'Dec 5, 2025', title: 'New Autonomous Bot Released', icon: '🚀', description: 'Our latest autonomous robot is now ready for competitions!' },
                  { date: 'Dec 1, 2025', title: 'Won RoboRace Championship 2025', icon: '🥇', description: 'Team RAW secured first place in the national championship.' },
                  { date: 'Nov 25, 2025', title: '5 New Members Joined the Team', icon: '👥', description: 'Welcome to our new talented team members!' },
                ].map((update, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    style={{
                      padding: '1.5rem',
                      background: '#ffffff',
                      border: '2px solid rgba(10, 26, 58, 0.08)',
                      borderLeft: '4px solid #B2001D',
                      borderRadius: '12px',
                      transition: 'all 0.3s',
                    }}
                    whileHover={{
                      boxShadow: '0 8px 24px rgba(178, 0, 29, 0.15)',
                      borderColor: 'rgba(178, 0, 29, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '2rem' }}>{update.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: '#B2001D',
                            fontWeight: '600',
                            margin: '0 0 0.5rem 0',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {update.date}
                        </p>
                        <h3
                          style={{
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '1.1rem',
                            color: '#0a1a3a',
                            margin: '0 0 0.5rem 0',
                          }}
                        >
                          {update.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            margin: 0,
                            lineHeight: 1.6,
                          }}
                        >
                          {update.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Button */}
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #B2001D 0%, #8a0016 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(178, 0, 29, 0.3)',
                }}
              >
                Got it, thanks! 👍
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
