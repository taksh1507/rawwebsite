/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', otp: '' });
  const [otpSentMessage, setOtpSentMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes and clear errors
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    setOtpSentMessage('');
    setFieldErrors({ ...fieldErrors, email: '' });
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError('');
    setFieldErrors({ ...fieldErrors, otp: '' });
  };

  // Send OTP to email
  const handleSendOtp = async () => {
    if (!email) {
      setFieldErrors({ ...fieldErrors, email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors({ ...fieldErrors, email: 'Please enter a valid email address' });
      return;
    }

    setIsSendingOtp(true);
    setError('');
    setOtpSentMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setShowOtpInput(true);
        setOtpSentMessage('OTP sent successfully! Please check your email.');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = { email: '', otp: '' };
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (showOtpInput && !otp) {
      errors.otp = 'OTP is required';
      isValid = false;
    } else if (showOtpInput && otp.length !== 6) {
      errors.otp = 'OTP must be 6 digits';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If OTP not sent yet, send it first
    if (!showOtpInput) {
      await handleSendOtp();
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  const isFormValid = email && (showOtpInput ? otp && otp.length === 6 : true) && !isLoading && !isSendingOtp;

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.loginContainer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>
            TEAM <span className={styles.logoHighlight}>RAW</span>
          </h1>
          <p className={styles.subtitle}>Secure access to the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* General Error Message */}
          {error && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {otpSentMessage && (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>✅</span>
              <span>{otpSentMessage}</span>
            </motion.div>
          )}

          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="teamraw@sfit.ac.in"
                disabled={isLoading || isSendingOtp || showOtpInput}
                autoFocus
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && (
              <p className={styles.fieldError}>
                <span>⚠️</span>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* OTP Input (shown after email verification) */}
          {showOtpInput && (
            <motion.div
              className={styles.inputGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label htmlFor="otp" className={styles.label}>
                Enter OTP
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className={styles.input}
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter 6-digit OTP"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              {fieldErrors.otp && (
                <p className={styles.fieldError}>
                  <span>⚠️</span>
                  {fieldErrors.otp}
                </p>
              )}
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isFormValid}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} />
                <span>Verifying...</span>
              </>
            ) : isSendingOtp ? (
              <>
                <div className={styles.spinner} />
                <span>Sending OTP...</span>
              </>
            ) : showOtpInput ? (
              <>
                <span>🔐</span>
                <span>Verify & Sign In</span>
              </>
            ) : (
              <>
                <span>📧</span>
                <span>Send OTP</span>
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className={styles.infoBox}>
          <strong>🔐 Secure OTP Login</strong>
          <p>Enter your authorized email address and we'll send you a one-time password to log in securely.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
