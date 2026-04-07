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
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyAuth, isAuthenticated, isLoading: authLoading } = useAuth();

  // Don't auto-redirect - let user see they're logged in
  // Only redirect after explicit login action

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
        // Show success message briefly
        setSuccessMessage('✓ Login successful! Redirecting...');
        setError('');
        
        // Verify authentication and update context
        await verifyAuth();
        
        // Small delay to ensure cookie is set and auth state updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Always redirect to dashboard (avoid root redirect loop)
        let redirect = searchParams.get('redirect') || '/dashboard';
        if (redirect === '/' || redirect === '') {
          redirect = '/dashboard';
        }
        window.location.href = redirect;
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !isLoading && !isSendingOtp) {
      handleSubmit(e as any);
    }
  };

  const isFormValid = email && (showOtpInput ? otp && otp.length === 6 : true);

  return (
    <div className={styles.loginContainer}>
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Team RAW Admin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to access the admin dashboard
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
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
          {otpSentMessage && !successMessage && (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>✅</span>
              <span>{otpSentMessage}</span>
            </motion.div>
          )}

          {/* Login Success Message */}
          {successMessage && (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>✓</span>
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Email Input */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
              disabled={isLoading || isSendingOtp || showOtpInput}
              autoComplete="email"
              autoFocus
            />
            {fieldErrors.email && (
              <p className={styles.fieldError}>
                <span>⚠️</span>
                {fieldErrors.email}
              </p>
            )}
          </motion.div>

          {/* OTP Input */}
          {showOtpInput && (
            <motion.div
              className={styles.formGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter 6-digit OTP"
                disabled={isLoading}
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
              />
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
            disabled={!isFormValid || isLoading || isSendingOtp}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} />
                <span>Verifying OTP...</span>
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

        <div className={styles.footer}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} Team RAW. All rights reserved.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <div style={{ color: '#fff' }}>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
