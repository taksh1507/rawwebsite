/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './profile.module.css';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
  lastLogin?: Date;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Admin User',
    email: 'admin@teamraw.com',
    role: 'Administrator',
    phone: '+91 98765 43210',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast('error', 'Validation Error', 'Please correct the errors before saving');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProfile(formData);
    setIsEditing(false);
    setIsSaving(false);
    showToast('success', 'Profile Updated', 'Your profile has been successfully updated');
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
        showToast('success', 'Avatar Updated', 'Your profile picture has been changed');
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.subtitle}>Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        {/* Card Header with Avatar */}
        <div className={styles.cardHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '50%' 
                    }} 
                  />
                ) : (
                  <span className={styles.avatarInitials}>{getInitials(profile.name)}</span>
                )}
              </div>
              <label className={styles.avatarUpload} title="Upload avatar">
                <span>📷</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h2 className={styles.userName}>{profile.name}</h2>
            <span className={styles.userRole}>🔐 {profile.role}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className={styles.cardBody}>
          {/* Last Login Info */}
          {profile.lastLogin && (
            <div className={styles.lastLogin}>
              <div className={styles.lastLoginIcon}>🕐</div>
              <div className={styles.lastLoginText}>
                <p className={styles.lastLoginLabel}>Last Login</p>
                <p className={styles.lastLoginValue}>{formatLastLogin(profile.lastLogin)}</p>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className={styles.infoGrid}>
            {/* Name */}
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>
                <span className={styles.infoIcon}>👤</span>
                Full Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.infoInput}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className={styles.errorText}>
                      <span>⚠️</span>
                      {errors.name}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.infoValue}>{profile.name}</div>
              )}
            </div>

            {/* Email */}
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>
                <span className={styles.infoIcon}>📧</span>
                Email Address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.infoInput}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <div className={styles.errorText}>
                      <span>⚠️</span>
                      {errors.email}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.infoValue}>{profile.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>
                <span className={styles.infoIcon}>📱</span>
                Phone Number
              </label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.infoInput}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && (
                    <div className={styles.errorText}>
                      <span>⚠️</span>
                      {errors.phone}
                    </div>
                  )}
                </>
              ) : (
                <div className={`${styles.infoValue} ${styles.infoValueMasked}`}>
                  {profile.phone.slice(0, -4).replace(/\d/g, '•')}
                  {profile.phone.slice(-4)}
                </div>
              )}
            </div>

            {/* Role (Read-only) */}
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>
                <span className={styles.infoIcon}>🔐</span>
                Role
              </label>
              <input
                type="text"
                value={profile.role}
                disabled
                className={styles.infoInput}
                title="Role cannot be changed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  <span className={styles.buttonIcon}>
                    {isSaving ? '⏳' : '✓'}
                  </span>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  <span className={styles.buttonIcon}>✕</span>
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <span className={styles.buttonIcon}>✏️</span>
                Edit Profile
              </button>
            )}
          </div>

          {/* Security Section */}
          <div className={styles.securitySection}>
            <h3 className={styles.sectionTitle}>
              <span>🔒</span>
              Security
            </h3>
            <div className={styles.securityInfo}>
              <span className={styles.securityIcon}>ℹ️</span>
              <p className={styles.securityText}>
                Your account is protected with secure authentication. Contact your administrator to change your role or reset your password.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${
              toast.type === 'success' ? styles.toastSuccess : styles.toastError
            }`}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className={styles.toastIcon}>
              {toast.type === 'success' ? '✓' : '⚠️'}
            </div>
            <div className={styles.toastContent}>
              <h4 className={styles.toastTitle}>{toast.title}</h4>
              <p className={styles.toastMessage}>{toast.message}</p>
            </div>
            <button
              className={styles.toastClose}
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
