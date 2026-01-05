'use client';

import { useState, useEffect } from 'react';
import styles from './send-email.module.css';

export default function SendEmailPage() {
  const [recipients, setRecipients] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    checkEmailConfig();
  }, []);

  const checkEmailConfig = async () => {
    try {
      const response = await fetch('/api/check-email-config');
      const result = await response.json();
      setEmailConfigured(result.configured);
    } catch (error) {
      console.error('Error checking email config:', error);
      setEmailConfigured(false);
    }
  };

  const validateEmails = (emailString: string): string[] => {
    const emails = emailString
      .split(/[,\n;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter(email => emailRegex.test(email));
    
    return validEmails;
  };

  const handleSendEmails = async () => {
    if (!subject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    if (!message.trim()) {
      alert('Please enter an email message');
      return;
    }

    if (!recipients.trim()) {
      alert('Please enter at least one email address');
      return;
    }

    const validEmails = validateEmails(recipients);
    
    if (validEmails.length === 0) {
      alert('No valid email addresses found. Please check your input.');
      return;
    }

    const invalidCount = recipients.split(/[,\n;]/).length - validEmails.length;
    if (invalidCount > 0) {
      if (!confirm(`Found ${invalidCount} invalid email(s). Continue sending to ${validEmails.length} valid email(s)?`)) {
        return;
      }
    }

    setSending(true);
    try {
      const response = await fetch('/api/send-direct-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: validEmails,
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${result.sentCount} recipient(s)!`);
        // Clear form
        setRecipients('');
        setSubject('');
        setMessage('');
      } else {
        alert('Failed to send emails: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Error sending emails. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const recipientCount = validateEmails(recipients).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📧 Send Email</h1>
        <p className={styles.subtitle}>Send emails directly with Team RAW template</p>
      </div>

      {emailConfigured === false && (
        <div className={styles.warningBanner}>
          <span className={styles.warningIcon}>⚠️</span>
          <span>
            Email is not configured. To send emails, please set up EMAIL_USER and EMAIL_PASS environment variables. 
            See <strong>EMAIL_SETUP.md</strong> for instructions.
          </span>
        </div>
      )}

      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          <h3>Recipients</h3>
          <p className={styles.helpText}>
            Enter email addresses separated by commas, semicolons, or new lines
          </p>
          <textarea
            className={styles.recipientsInput}
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="example1@email.com, example2@email.com&#10;example3@email.com"
            rows={6}
            disabled={sending}
          />
          {recipients && (
            <p className={styles.recipientCount}>
              Valid email addresses: <strong>{recipientCount}</strong>
            </p>
          )}
        </div>

        <div className={styles.formSection}>
          <h3>Subject</h3>
          <input
            type="text"
            className={styles.subjectInput}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            disabled={sending}
          />
        </div>

        <div className={styles.formSection}>
          <h3>Message</h3>
          <p className={styles.helpText}>
            Compose your message. It will be sent with Team RAW's professional email template.
          </p>
          <textarea
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={12}
            disabled={sending}
          />
        </div>

        <div className={styles.templatePreview}>
          <h4>📋 Template Features</h4>
          <ul>
            <li>Team RAW branded header with gradient</li>
            <li>Professional layout with responsive design</li>
            <li>Contact information footer</li>
            <li>Mobile-friendly HTML formatting</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleSendEmails}
            className={styles.sendBtn}
            disabled={sending || emailConfigured === false || !recipients.trim() || !subject.trim() || !message.trim()}
          >
            {sending ? '⏳ Sending...' : '📨 Send Email'}
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all fields?')) {
                setRecipients('');
                setSubject('');
                setMessage('');
              }
            }}
            className={styles.clearBtn}
            disabled={sending}
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
}
