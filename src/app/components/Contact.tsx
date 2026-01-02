/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    interest: 'general',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📤 Submitting form data:', {
        fullName: formData.name,
        email: formData.email,
        inquiryType: formData.interest,
        message: formData.message,
      });

      const response = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          inquiryType: formData.interest,
          message: formData.message,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      console.log('📥 Response content-type:', contentType);
      console.log('📥 Response status:', response.status);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Expected JSON but got:', text.substring(0, 200));
        throw new Error('Server returned an invalid response. Please try again later.');
      }

      const data = await response.json();
      console.log('📥 Response:', data);

      if (!response.ok) {
        // Show detailed validation errors if available
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join('. '));
        }
        throw new Error(data.message || 'Failed to send message');
      }

      // Success
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '', interest: 'general' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'membership', label: 'Join as Member' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'collaboration', label: 'Collaboration' },
  ];

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      value: 'contact@teamraw.com',
      description: 'Send us your queries',
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'SFIT, Mumbai',
      description: 'Visit our workshop',
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      value: 'Open to Projects',
      description: 'Partner with us',
    },
    {
      icon: '⏱️',
      title: 'Response Time',
      value: '24-48 Hours',
      description: 'We reply quickly',
    },
  ];

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.gridBackground}></div>
      <div className={styles.container}>
        {/* Left Side - Form */}
        <motion.div
          className={styles.formContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={leftVariants}
        >
          <div className={styles.formHeader}>
            <h2>Let's Build <span className={styles.redAccent}>Together</span></h2>
            <p className={styles.tagline}>Innovation starts with a conversation. Reach out to collaborate, inquire, or join our robotics journey.</p>
          </div>

          {isSubmitted ? (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className={styles.successIcon}>✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <motion.div
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className={styles.errorIcon}>⚠️</span>
                  {error}
                </motion.div>
              )}
              
              <motion.div
                className={styles.formGroup}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <label htmlFor="name">
                  Full Name
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '0.5rem', fontWeight: 400 }}>
                    (minimum 2 characters)
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  minLength={2}
                />
              </motion.div>

              <motion.div
                className={styles.formGroup}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </motion.div>

              <motion.div
                className={styles.formGroup}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="interest">What brings you here?</label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                >
                  {interestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                className={styles.formGroup}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="message">
                  Your Message
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: formData.message.length >= 10 ? '#22c55e' : '#94a3b8',
                    marginLeft: '0.5rem',
                    fontWeight: 400
                  }}>
                    ({formData.message.length}/10 characters minimum)
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your ideas, questions, or how we can collaborate... (minimum 10 characters)"
                  rows={6}
                  required
                  style={{
                    borderColor: formData.message.length > 0 && formData.message.length < 10 
                      ? '#ef4444' 
                      : undefined
                  }}
                ></textarea>
                {formData.message.length > 0 && formData.message.length < 10 && (
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#ef4444', 
                    marginTop: '0.5rem',
                    marginBottom: 0
                  }}>
                    ⚠️ Please enter at least {10 - formData.message.length} more character{10 - formData.message.length !== 1 ? 's' : ''}
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || formData.name.length < 2 || formData.message.length < 10 || !formData.email}
                whileHover={!isSubmitting && formData.name.length >= 2 && formData.message.length >= 10 && formData.email ? { scale: 1.02, boxShadow: '0 8px 30px rgba(225, 6, 0, 0.3)' } : {}}
                whileTap={!isSubmitting && formData.name.length >= 2 && formData.message.length >= 10 && formData.email ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <span className={styles.buttonIcon}>→</span>
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Right Side - Contact Info Cards */}
        <motion.div
          className={styles.infoContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rightVariants}
        >
          <div className={styles.infoHeader}>
            <h3>Get in <span className={styles.redAccent}>Touch</span></h3>
            <p>Connect with Team RAW and explore opportunities in robotics innovation</p>
          </div>

          <div className={styles.contactCards}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className={styles.contactCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(10, 26, 58, 0.15)' }}
              >
                <div className={styles.cardIcon}>{info.icon}</div>
                <div className={styles.cardContent}>
                  <h4>{info.title}</h4>
                  <p className={styles.cardValue}>{info.value}</p>
                  <p className={styles.cardDescription}>{info.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.inspirationBox}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.inspirationIcon}>💡</div>
            <p className={styles.inspirationText}>
              "Together, we build robots that push boundaries and redefine what's possible in automation and engineering."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
