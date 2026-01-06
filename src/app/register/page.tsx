/**
 * Competition Registration Page
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Register.module.css';

interface FormData {
  // Student Information
  fullName: string;
  email: string;
  phone: string;
  
  // Competition Details
  competition: string;
}

interface Competition {
  _id: string;
  name: string;
  organizer: string;
  date: string;
  description: string;
  deadline: string;
  teamSize: string;
  imageUrl?: string;
  notes?: string;
  isActive: boolean;
  customFields: CustomField[];
}

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export default function RegisterPage() {
  const [competitionsData, setCompetitionsData] = useState<Competition[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    competition: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [notesAgreed, setNotesAgreed] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [formProgress, setFormProgress] = useState(0);

  // Fetch competitions from API
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions?active=true');
        const result = await response.json();
        if (result.success) {
          setCompetitionsData(result.data);
        }
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    };

    fetchCompetitions();
  }, []);

  // Calculate form progress for mobile indicator
  useEffect(() => {
    let progress = 0;
    const totalFields = 4; // name, email, phone, competition
    
    if (formData.fullName) progress += 25;
    if (formData.email) progress += 25;
    if (formData.phone && formData.phone.length === 10) progress += 25;
    if (selectedCompetition) progress += 25;
    
    setFormProgress(progress);
  }, [formData, selectedCompetition]);

  // Auto-redirect countdown after successful submission
  useEffect(() => {
    if (submitStatus === 'success') {
      let countdown = 20;
      const countdownElement = document.getElementById('countdown');
      
      const interval = setInterval(() => {
        countdown--;
        if (countdownElement) {
          countdownElement.textContent = countdown.toString();
        }
        
        if (countdown === 0) {
          clearInterval(interval);
          window.location.href = '/';
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [submitStatus]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  const handleCompetitionSelect = (competition: Competition) => {
    setSelectedCompetition(competition);
    setCustomFieldValues({});
    setNotesAgreed(false);
    setFormData((prev) => ({
      ...prev,
      competition: competition.name,
    }));
    
    // Smooth scroll to next section on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const nextSection = document.querySelector('#additional-fields');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const toggleDescription = (competitionId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [competitionId]: !prev[competitionId],
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to actual API endpoint
      const submissionData = {
        ...formData,
        phone: `+91${formData.phone}`, // Add +91 prefix to phone number
        customFields: customFieldValues,
        competitionId: selectedCompetition?._id,
      };
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        // Form will be reset after auto-redirect (20 seconds)
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />
      
      {/* Mobile Progress Indicator */}
      <div className={styles.mobileProgressBar}>
        <div 
          className={styles.mobileProgressFill} 
          style={{ width: `${formProgress}%` }}
        />
      </div>
      
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Competition <span className={styles.redAccent}>Registration</span>
          </motion.h1>
        </div>
      </motion.section>

      {/* Registration Form Section */}
      <section className={styles.section}>
        <div className={styles.gridBackground}></div>
        
        {/* Mobile Desktop View Notice */}
        <motion.div
          className={styles.mobileNotice}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className={styles.mobileNoticeIcon}>💡</span>
          <div className={styles.mobileNoticeContent}>
            <strong>Better Experience on Desktop View</strong>
            <p>For the best experience, we recommend switching to desktop view on your mobile browser.</p>
          </div>
        </motion.div>
        
        {submitStatus === 'success' ? (
          /* Success Confirmation */
          <motion.div
            className={styles.successContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.successCard}>
              <motion.div
                className={styles.successIcon}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                ✓
              </motion.div>
              
              <h2>Registration Successful</h2>
              
              <p className={styles.successMessage}>
                Thank you for registering with Team RAW. Your details have been submitted successfully.
                Our team will review your application and contact you via your registered email.
              </p>

              <div className={styles.successActions}>
                <motion.a
                  href="/"
                  className={styles.primaryBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.a>
                
                <motion.a
                  href="/about"
                  className={styles.secondaryBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Team RAW
                </motion.a>
              </div>

              <p className={styles.autoRedirect}>
                Redirecting to home page in <span id="countdown">20</span> seconds...
              </p>
            </div>
          </motion.div>
        ) : (
          /* Registration Form */
        <div className={styles.container}>
          <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.formHeader}>
              <h2>Student Registration Form</h2>
              <p className={styles.tagline}>
                Fill in your details to register for upcoming robotics competitions
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Personal Information */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Student Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <div className={styles.phoneInputWrapper}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      title="Please enter exactly 10 digits"
                      maxLength={10}
                      className={styles.phoneInput}
                    />
                  </div>
                  {formData.phone && formData.phone.length < 10 && (
                    <span className={styles.phoneHint}>
                      {10 - formData.phone.length} more digit{10 - formData.phone.length !== 1 ? 's' : ''} required
                    </span>
                  )}
                </div>
              </div>

              {/* Competition Selection */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Select Competition</h3>
                <p className={styles.sectionDescription}>Choose the competition you want to register for</p>
                
                <div className={styles.competitionsGrid}>
                  {competitionsData.map((comp) => {
                    const isExpanded = expandedDescriptions[comp._id];
                    const descriptionLines = comp.description.split('\n');
                    const shouldTruncate = comp.description.length > 120;
                    const displayDescription = isExpanded || !shouldTruncate 
                      ? comp.description 
                      : comp.description.substring(0, 120) + '...';
                    
                    return (
                      <motion.div
                        key={comp._id}
                        className={`${styles.competitionCard} ${
                          selectedCompetition?._id === comp._id ? styles.competitionCardActive : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedCompetition?._id === comp._id && (
                          <span className={styles.selectedBadge}>✓ Selected</span>
                        )}
                        
                        <div onClick={() => handleCompetitionSelect(comp)} style={{ cursor: 'pointer' }}>
                          <div className={styles.competitionHeader}>
                            <h4>{comp.name}</h4>
                          </div>
                          <p className={styles.competitionOrganizer}>{comp.organizer}</p>
                          
                          <div className={styles.competitionMeta}>
                            <span className={styles.competitionMetaItem}>
                              <span className={styles.metaIcon}>📅</span>
                              <span>{comp.date}</span>
                            </span>
                            <span className={styles.competitionMetaItem}>
                              <span className={styles.metaIcon}>⏰</span>
                              <span>{comp.deadline}</span>
                            </span>
                            <span className={styles.competitionMetaItem}>
                              <span className={styles.metaIcon}>👥</span>
                              <span>{comp.teamSize}</span>
                            </span>
                          </div>
                          
                          <p className={styles.competitionDescription}>
                            {displayDescription}
                          </p>
                        </div>
                        
                        {shouldTruncate && (
                          <button
                            type="button"
                            className={styles.readMoreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(comp._id);
                            }}
                          >
                            {isExpanded ? '▲ Show less' : '▼ Read more'}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Fields - Show only after competition selection */}
              {selectedCompetition && (
                <div id="additional-fields">
                  {/* Custom Fields from Competition */}
                  {selectedCompetition?.customFields && selectedCompetition.customFields.length > 0 && (
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Additional Information</h3>
                      <p className={styles.sectionDescription}>Complete the required fields below</p>
                      
                      <div className={styles.additionalFieldsGrid}>
                        {selectedCompetition.customFields.map((field) => (
                          <div 
                            key={field.id} 
                            className={`${styles.formGroup} ${
                              field.type === 'textarea' ? styles.formGroupFull : ''
                            }`}
                          >
                            <label htmlFor={field.id}>
                              {field.label} {field.required && <span className={styles.required}>*</span>}
                            </label>
                            
                            {field.type === 'textarea' ? (
                              <textarea
                                id={field.id}
                                value={customFieldValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                required={field.required}
                                placeholder={field.placeholder}
                                rows={3}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                id={field.id}
                                value={customFieldValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                required={field.required}
                              >
                                <option value="">Select an option</option>
                                {field.options?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'checkbox' ? (
                              <label className={styles.checkboxLabel}>
                                <input
                                  type="checkbox"
                                  id={field.id}
                                  checked={customFieldValues[field.id] || false}
                                  onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                                  required={field.required}
                                />
                                <span>{field.placeholder || field.label}</span>
                              </label>
                            ) : (
                              <input
                                type={field.type}
                                id={field.id}
                                value={customFieldValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                required={field.required}
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Competition Notes Agreement */}
                  {selectedCompetition?.notes && selectedCompetition.notes.trim() !== '' && (
                    <div className={styles.formSection}>
                      <div className={styles.notesAgreement}>
                        <div className={styles.notesHeader}>
                          <span className={styles.notesToggleIcon}>⚠️</span>
                          <strong>Important Instructions</strong>
                        </div>
                        
                        <div className={styles.notesContent}>
                          <p className={styles.notesText}>{selectedCompetition.notes}</p>
                        </div>
                        
                        <label className={styles.notesCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={notesAgreed}
                            onChange={(e) => setNotesAgreed(e.target.checked)}
                            required
                          />
                          <span className={styles.notesCheckboxText}>
                            I have read and agree to the competition requirements
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={
                      isSubmitting || 
                      (!!selectedCompetition?.notes && selectedCompetition.notes.trim() !== '' && !notesAgreed)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </motion.button>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      className={styles.errorMessage}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      ✗ Something went wrong. Please try again.
                    </motion.div>
                  )}

                  {/* Need Help Section */}
                  <motion.div
                    className={styles.needHelpSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className={styles.needHelpCard}>
                      <div className={styles.needHelpIcon}>💬</div>
                      <div className={styles.needHelpContent}>
                        <h4>Need Help with Registration?</h4>
                        <p>
                          If you have any questions or need assistance, feel free to reach out to us:
                        </p>
                        <div className={styles.contactList}>
                          <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📧</span>
                            <a href="mailto:teamraw@sfit.ac.in">teamraw@sfit.ac.in</a>
                          </div>
                          <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <div className={styles.contactNumbers}>
                              <a href="tel:+918329324952">Nandini: 8329324952</a>
                              <a href="tel:+917208697241">Pal: 7208697241</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </form>
          </motion.div>

        </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
