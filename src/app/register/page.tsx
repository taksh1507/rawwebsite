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
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value,
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
                  {competitionsData.map((comp) => (
                    <motion.div
                      key={comp._id}
                      className={`${styles.competitionCard} ${
                        selectedCompetition?._id === comp._id ? styles.competitionCardActive : ''
                      }`}
                      onClick={() => handleCompetitionSelect(comp)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.competitionHeader}>
                        <h4>{comp.name}</h4>
                        {selectedCompetition?._id === comp._id && (
                          <span className={styles.selectedBadge}>✓ Selected</span>
                        )}
                      </div>
                      <p className={styles.competitionOrganizer}>{comp.organizer}</p>
                      <p className={styles.competitionDate}>📅 {comp.date}</p>
                      <p className={styles.competitionDescription}>{comp.description}</p>
                      <div className={styles.competitionFooter}>
                        <span className={styles.competitionDeadline}>Deadline: {comp.deadline}</span>
                        <span className={styles.competitionTeamSize}>Team: {comp.teamSize}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Fields - Show only after competition selection */}
              {selectedCompetition && (
                <>
                  {/* Custom Fields from Competition */}
                  {selectedCompetition?.customFields && selectedCompetition.customFields.length > 0 && (
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Additional Information</h3>
                      
                      {selectedCompetition.customFields.map((field) => (
                        <div key={field.id} className={styles.formGroup}>
                          <label htmlFor={field.id}>
                            {field.label} {field.required && '*'}
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.id}
                              value={customFieldValues[field.id] || ''}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              required={field.required}
                              placeholder={field.placeholder}
                              rows={4}
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
                  )}

                  {/* Competition Notes Agreement */}
                  {selectedCompetition?.notes && selectedCompetition.notes.trim() !== '' && (
                    <div className={styles.formSection}>
                      <div className={styles.notesAgreement}>
                        <label className={styles.notesCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={notesAgreed}
                            onChange={(e) => setNotesAgreed(e.target.checked)}
                            required
                          />
                          <span className={styles.notesText}>
                            <strong>Important Note:</strong> {selectedCompetition.notes}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting || (selectedCompetition?.notes && selectedCompetition.notes.trim() !== '' && !Boolean(notesAgreed))}
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
                </>
              )}
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            className={styles.infoSidebar}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📞</div>
              <h3>Need Help?</h3>
              <p>
                For any queries regarding registration, feel free to contact us at{' '}
                <a href="mailto:teamraw@sfit.ac.in">teamraw@sfit.ac.in</a>
              </p>
            </div>
          </motion.div>
        </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
