/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './settings.module.css';

interface SettingsState {
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  
  // System Preferences
  autoBackup: boolean;
  dataSync: boolean;
  errorReporting: boolean;
  
  // Appearance
  darkMode: boolean;
  compactView: boolean;
  animations: boolean;
  
  // Data Management
  analyticsTracking: boolean;
  activityLogging: boolean;
}

interface ModalState {
  isOpen: boolean;
  action: 'clearData' | 'resetSettings' | null;
  confirmText: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    autoBackup: true,
    dataSync: true,
    errorReporting: true,
    darkMode: false,
    compactView: false,
    animations: true,
    analyticsTracking: true,
    activityLogging: true,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    action: null,
    confirmText: '',
  });

  const [saveIndicator, setSaveIndicator] = useState<string | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Toggle setting and save
  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
    
    // Show save indicator
    setSaveIndicator(key);
    setTimeout(() => setSaveIndicator(null), 2000);
  };

  // Open confirmation modal
  const openModal = (action: 'clearData' | 'resetSettings') => {
    setModal({
      isOpen: true,
      action,
      confirmText: '',
    });
  };

  // Close modal
  const closeModal = () => {
    setModal({
      isOpen: false,
      action: null,
      confirmText: '',
    });
  };

  // Handle dangerous action
  const handleDangerousAction = () => {
    if (modal.action === 'clearData') {
      // Clear all data
      localStorage.clear();
      alert('All data has been cleared successfully.');
    } else if (modal.action === 'resetSettings') {
      // Reset to defaults
      const defaultSettings: SettingsState = {
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        autoBackup: true,
        dataSync: true,
        errorReporting: true,
        darkMode: false,
        compactView: false,
        animations: true,
        analyticsTracking: true,
        activityLogging: true,
      };
      setSettings(defaultSettings);
      localStorage.setItem('adminSettings', JSON.stringify(defaultSettings));
      alert('Settings have been reset to defaults.');
    }
    closeModal();
  };

  // Get modal content based on action
  const getModalContent = () => {
    if (modal.action === 'clearData') {
      return {
        title: 'Clear All Data',
        message: 'This will permanently delete all stored data including contact messages, analytics history, and cached information.',
        impact: 'This will delete approximately 150+ records from the database.',
        confirmPhrase: 'DELETE ALL DATA',
      };
    } else if (modal.action === 'resetSettings') {
      return {
        title: 'Reset All Settings',
        message: 'This will reset all preferences to their default values. Your data will not be affected.',
        impact: 'All 11 settings will be restored to their factory defaults.',
        confirmPhrase: 'RESET SETTINGS',
      };
    }
    return null;
  };

  const modalContent = getModalContent();

  return (
    <div className={styles.settingsPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your preferences and system configuration
        </p>
      </div>

      {/* Notifications Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔔</span>
            Notifications
          </h2>
          <p className={styles.sectionDescription}>
            Control how and when you receive notifications
          </p>
        </div>
        <div className={styles.sectionBody}>
          <SettingItem
            label="Email Notifications"
            description="Receive important updates and alerts via email"
            icon="📧"
            checked={settings.emailNotifications}
            onChange={() => toggleSetting('emailNotifications')}
            showSaveIndicator={saveIndicator === 'emailNotifications'}
            tooltip="You'll receive notifications about new contacts, system alerts, and important updates"
          />
          <SettingItem
            label="Push Notifications"
            description="Get real-time browser notifications for urgent events"
            icon="🔔"
            checked={settings.pushNotifications}
            onChange={() => toggleSetting('pushNotifications')}
            showSaveIndicator={saveIndicator === 'pushNotifications'}
            tooltip="Browser notifications require permission and work when this tab is open"
          />
          <SettingItem
            label="Weekly Digest"
            description="Receive a summary of platform activity every Monday"
            icon="📊"
            checked={settings.weeklyDigest}
            onChange={() => toggleSetting('weeklyDigest')}
            showSaveIndicator={saveIndicator === 'weeklyDigest'}
            tooltip="A comprehensive email with analytics, new contacts, and key metrics"
          />
        </div>
      </section>

      {/* System Preferences Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⚙️</span>
            System Preferences
          </h2>
          <p className={styles.sectionDescription}>
            Configure automatic system behavior and maintenance
          </p>
        </div>
        <div className={styles.sectionBody}>
          <SettingItem
            label="Automatic Backup"
            description="Automatically backup data every 24 hours"
            icon="💾"
            checked={settings.autoBackup}
            onChange={() => toggleSetting('autoBackup')}
            showSaveIndicator={saveIndicator === 'autoBackup'}
            tooltip="Backups are stored locally and can be restored from the data management panel"
          />
          <SettingItem
            label="Data Synchronization"
            description="Keep data synced across all your devices"
            icon="🔄"
            checked={settings.dataSync}
            onChange={() => toggleSetting('dataSync')}
            showSaveIndicator={saveIndicator === 'dataSync'}
            tooltip="Uses browser sync storage to keep settings consistent across devices"
          />
          <SettingItem
            label="Error Reporting"
            description="Automatically send error reports to help improve the platform"
            icon="🐛"
            checked={settings.errorReporting}
            onChange={() => toggleSetting('errorReporting')}
            showSaveIndicator={saveIndicator === 'errorReporting'}
            tooltip="Anonymous error reports help us fix bugs and improve stability"
          />
        </div>
      </section>

      {/* Appearance Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎨</span>
            Appearance
          </h2>
          <p className={styles.sectionDescription}>
            Customize the look and feel of the admin panel
          </p>
        </div>
        <div className={styles.sectionBody}>
          <SettingItem
            label="Dark Mode"
            description="Switch to a darker color scheme for reduced eye strain"
            icon="🌙"
            checked={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
            showSaveIndicator={saveIndicator === 'darkMode'}
            tooltip="Dark mode is coming soon - currently in development"
          />
          <SettingItem
            label="Compact View"
            description="Display more content by reducing spacing and padding"
            icon="📱"
            checked={settings.compactView}
            onChange={() => toggleSetting('compactView')}
            showSaveIndicator={saveIndicator === 'compactView'}
            tooltip="Compact view optimizes layout for smaller screens"
          />
          <SettingItem
            label="Animations"
            description="Enable smooth transitions and animated UI elements"
            icon="✨"
            checked={settings.animations}
            onChange={() => toggleSetting('animations')}
            showSaveIndicator={saveIndicator === 'animations'}
            tooltip="Disable animations for better performance on slower devices"
          />
        </div>
      </section>

      {/* Data Management Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📊</span>
            Data Management
          </h2>
          <p className={styles.sectionDescription}>
            Control data collection and storage preferences
          </p>
        </div>
        <div className={styles.sectionBody}>
          <SettingItem
            label="Analytics Tracking"
            description="Allow collection of usage data to improve the platform"
            icon="📈"
            checked={settings.analyticsTracking}
            onChange={() => toggleSetting('analyticsTracking')}
            showSaveIndicator={saveIndicator === 'analyticsTracking'}
            tooltip="Analytics help us understand feature usage and make informed improvements"
          />
          <SettingItem
            label="Activity Logging"
            description="Log all admin actions for audit and security purposes"
            icon="📝"
            checked={settings.activityLogging}
            onChange={() => toggleSetting('activityLogging')}
            showSaveIndicator={saveIndicator === 'activityLogging'}
            tooltip="Activity logs can be reviewed in the security settings panel"
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <h2 className={styles.dangerTitle}>
            <span className={styles.dangerWarningIcon}>⚠️</span>
            Danger Zone
          </h2>
          <p className={styles.dangerDescription}>
            Irreversible actions that permanently affect your data and settings
          </p>
        </div>
        <div className={styles.dangerBody}>
          <div className={styles.dangerActions}>
            <div className={styles.dangerAction}>
              <div className={styles.dangerActionInfo}>
                <h4>Clear All Data</h4>
                <p>
                  Permanently delete all contact messages, analytics data, and cached information.
                </p>
                <div className={styles.dangerImpact}>
                  <span>⚠️</span>
                  <span>This will delete 150+ records</span>
                </div>
              </div>
              <button
                className={styles.dangerButton}
                onClick={() => openModal('clearData')}
              >
                <span>🗑️</span>
                Clear Data
              </button>
            </div>

            <div className={styles.dangerAction}>
              <div className={styles.dangerActionInfo}>
                <h4>Reset All Settings</h4>
                <p>
                  Restore all preferences to their factory default values. Your data will remain intact.
                </p>
                <div className={styles.dangerImpact}>
                  <span>⚠️</span>
                  <span>This will reset all 11 settings</span>
                </div>
              </div>
              <button
                className={styles.dangerButton}
                onClick={() => openModal('resetSettings')}
              >
                <span>🔄</span>
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modal.isOpen && modalContent && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  <span className={styles.modalIcon}>⚠️</span>
                  {modalContent.title}
                </h3>
                <p className={styles.modalMessage}>{modalContent.message}</p>
                <div className={styles.modalImpact}>
                  <strong>Impact:</strong>
                  <p>{modalContent.impact}</p>
                </div>
              </div>
              <div className={styles.modalBody}>
                <label htmlFor="confirmInput">
                  <p style={{ margin: '0 0 0.75rem 0', color: '#0a1a3a', fontWeight: 600 }}>
                    Type <code style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: 'rgba(10, 26, 58, 0.1)', 
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>{modalContent.confirmPhrase}</code> to confirm:
                  </p>
                </label>
                <input
                  id="confirmInput"
                  type="text"
                  className={styles.confirmInput}
                  value={modal.confirmText}
                  onChange={(e) => setModal({ ...modal, confirmText: e.target.value })}
                  placeholder={modalContent.confirmPhrase}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && modal.confirmText === modalContent.confirmPhrase) {
                      handleDangerousAction();
                    } else if (e.key === 'Escape') {
                      closeModal();
                    }
                  }}
                />
                <p className={styles.confirmHint}>
                  This action cannot be undone. Please be certain.
                </p>
                <div className={styles.modalActions}>
                  <button
                    className={`${styles.modalButton} ${styles.modalButtonCancel}`}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
                    onClick={handleDangerousAction}
                    disabled={modal.confirmText !== modalContent.confirmPhrase}
                  >
                    {modalContent.title}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Setting Item Component */
interface SettingItemProps {
  label: string;
  description: string;
  icon: string;
  checked: boolean;
  onChange: () => void;
  showSaveIndicator: boolean;
  tooltip: string;
}

function SettingItem({
  label,
  description,
  icon,
  checked,
  onChange,
  showSaveIndicator,
  tooltip,
}: SettingItemProps) {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h3 className={styles.settingLabel}>
          <span className={styles.settingLabelIcon}>{icon}</span>
          {label}
          <span className={styles.tooltipIcon} title={tooltip}>
            ?
          </span>
        </h3>
        <p className={styles.settingDescription}>{description}</p>
      </div>
      <div className={styles.toggleWrapper}>
        <label className={`${styles.toggle} ${checked ? styles.active : ''}`}>
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={checked}
            onChange={onChange}
            aria-label={label}
          />
          <span className={styles.toggleSlider} />
        </label>
        {showSaveIndicator && (
          <span className={styles.saveIndicator}>Saved ✓</span>
        )}
      </div>
    </div>
  );
}
