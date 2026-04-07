/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './contact.module.css';

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  inquiryType: 'general' | 'membership' | 'sponsorship' | 'collaboration';
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
  replied?: boolean;
}

type FilterType = 'all' | 'unread' | 'read';

export default function ContactMessagesPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the main site API (port 3000)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      console.log('📡 Fetching contacts from:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/contact/messages`);
      console.log('📡 Fetch response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Failed to fetch messages');
      }

      const data = await response.json();
      console.log('✅ Contacts fetched:', data.data?.length || 0, 'messages');

      setContacts(data.data || []);
    } catch (err) {
      console.error('❌ Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on status
  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return contact.status === 'unread';
    if (filter === 'read') return contact.status === 'read';
    return true;
  });

  // Mark as read/unread
  const handleMarkAsRead = async (id: string, currentStatus: 'read' | 'unread') => {
    try {
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      console.log('🔄 Updating message status:', { id, apiUrl, newStatus });
      
      const response = await fetch(`${apiUrl}/api/contact/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to update message';
        try {
          const data = await response.json();
          console.error('❌ API Error:', data);
          errorMessage = data.message || errorMessage;
        } catch (parseErr) {
          console.error('❌ Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Message updated successfully:', data);

      // Update local state
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );

      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (err) {
      console.error('❌ Error updating message:', err);
      // Just log the error, don't show alert to user
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message';
      console.error('Error details:', errorMessage);
    }
  };

  // Delete message
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      console.log('🗑️ Deleting message:', { id, apiUrl });
      
      const response = await fetch(`${apiUrl}/api/contact/messages/${id}`, {
        method: 'DELETE',
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to delete message';
        try {
          const data = await response.json();
          console.error('❌ API Error:', data);
          errorMessage = data.message || errorMessage;
        } catch (parseErr) {
          console.error('❌ Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Message deleted successfully:', data);

      // Update local state
      setContacts((prev) => prev.filter((c) => c._id !== id));

      // Clear selection if deleted message was selected
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error('❌ Error deleting message:', err);
      // Just log the error
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      console.error('Error details:', errorMessage);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate statistics
  const stats = {
    total: contacts.length,
    unread: contacts.filter((c) => c.status === 'unread').length,
    general: contacts.filter((c) => c.inquiryType === 'general').length,
    membership: contacts.filter((c) => c.inquiryType === 'membership').length,
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Messages</h1>
        <p className={styles.subtitle}>
          Manage and respond to inquiries from your website
        </p>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Messages</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Unread</div>
          <div className={styles.statValue}>{stats.unread}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>General Inquiries</div>
          <div className={styles.statValue}>{stats.general}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Memberships</div>
          <div className={styles.statValue}>{stats.membership}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Message List Panel */}
        <div className={styles.messageListPanel}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Messages</h2>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${
                  filter === 'all' ? styles.active : ''
                }`}
                onClick={() => setFilter('all')}
              >
                All ({contacts.length})
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === 'unread' ? styles.active : ''
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread ({stats.unread})
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === 'read' ? styles.active : ''
                }`}
                onClick={() => setFilter('read')}
              >
                Read ({stats.total - stats.unread})
              </button>
            </div>
          </div>

          <div className={styles.messageList}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading messages...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3 className={styles.emptyTitle}>No messages</h3>
                <p className={styles.emptyText}>
                  {filter === 'all'
                    ? 'No contact messages yet'
                    : `No ${filter} messages`}
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`${styles.messageItem} ${
                    contact.status === 'unread' ? styles.unread : ''
                  } ${
                    selectedContact?._id === contact._id ? styles.selected : ''
                  }`}
                  onClick={() => {
                    setSelectedContact(contact);
                    // Auto-mark as read when opened
                    if (contact.status === 'unread') {
                      handleMarkAsRead(contact._id, 'unread');
                    }
                  }}
                >
                  <div className={styles.messageHeader}>
                    <div className={styles.messageName}>{contact.fullName}</div>
                    <div className={styles.messageTime}>
                      {formatTime(contact.timestamp)}
                    </div>
                  </div>
                  <div className={styles.messageEmail}>{contact.email}</div>
                  <div className={styles.messagePreview}>{contact.message}</div>
                  <div className={styles.messageBadges}>
                    <span
                      className={`${styles.badge} ${styles[contact.status]}`}
                    >
                      {contact.status}
                    </span>
                    <span className={`${styles.badge} ${styles.type}`}>
                      {contact.inquiryType}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className={styles.detailPanel}>
          {!selectedContact ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👈</div>
              <h3 className={styles.emptyTitle}>Select a message</h3>
              <p className={styles.emptyText}>
                Choose a message from the list to view details
              </p>
            </div>
          ) : (
            <>
              <div className={styles.detailHeader}>
                <h2 className={styles.detailTitle}>Message Details</h2>
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.markReadButton}`}
                    onClick={() =>
                      handleMarkAsRead(
                        selectedContact._id,
                        selectedContact.status
                      )
                    }
                  >
                    {selectedContact.status === 'read'
                      ? '📧 Mark Unread'
                      : '✓ Mark Read'}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(selectedContact._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className={styles.detailContent}>
                <div className={styles.metaGrid}>
                  <div className={styles.detailSection}>
                    <div className={styles.sectionLabel}>Full Name</div>
                    <div className={`${styles.sectionValue} ${styles.large}`}>
                      {selectedContact.fullName}
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <div className={styles.sectionLabel}>Email Address</div>
                    <div className={styles.sectionValue}>
                      <a href={`mailto:${selectedContact.email}`}>
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <div className={styles.sectionLabel}>Inquiry Type</div>
                    <div className={styles.sectionValue}>
                      <span className={`${styles.badge} ${styles.type}`}>
                        {selectedContact.inquiryType}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <div className={styles.sectionLabel}>Received</div>
                    <div className={styles.sectionValue}>
                      {formatFullDate(selectedContact.timestamp)}
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.sectionLabel}>Message</div>
                  <div className={styles.messageText}>
                    {selectedContact.message}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.sectionLabel}>Status</div>
                  <span
                    className={`${styles.badge} ${
                      styles[selectedContact.status]
                    }`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
