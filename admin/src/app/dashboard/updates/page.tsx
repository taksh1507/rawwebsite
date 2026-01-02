/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './updates.module.css';

interface Update {
  _id: string;
  title: string;
  description: string;
  category: 'announcement' | 'achievement' | 'event' | 'general';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isActive: boolean;
  author?: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [filter, setFilter] = useState<'all' | 'announcement' | 'achievement' | 'event' | 'general'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general' as Update['category'],
    priority: 'medium' as Update['priority'],
    isActive: true,
    author: 'Admin',
  });

  // Fetch updates
  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      console.log('📡 Fetching updates from:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/updates`);
      console.log('📡 Fetch response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Failed to fetch updates');
      }

      const data = await response.json();
      console.log('✅ Updates fetched:', data.data?.length || 0, 'updates');

      setUpdates(data.data || []);
    } catch (err) {
      console.error('❌ Error fetching updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  // Filter updates
  const filteredUpdates = updates.filter((update) => {
    if (filter === 'all') return true;
    return update.category === filter;
  });

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const url = editingUpdate
        ? `${apiUrl}/api/updates/${editingUpdate._id}`
        : `${apiUrl}/api/updates`;
      
      const method = editingUpdate ? 'PATCH' : 'POST';
      
      console.log(`🔄 ${method} update:`, formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Failed to save update');
      }

      const data = await response.json();
      console.log('✅ Update saved successfully:', data);

      // Refresh updates list
      await fetchUpdates();
      
      // Reset form
      setShowForm(false);
      setEditingUpdate(null);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        isActive: true,
        author: 'Admin',
      });
    } catch (err) {
      console.error('❌ Error saving update:', err);
      setError(err instanceof Error ? err.message : 'Failed to save update');
    }
  };

  // Handle edit
  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      description: update.description,
      category: update.category,
      priority: update.priority,
      isActive: update.isActive,
      author: update.author || 'Admin',
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      console.log('🗑️ Deleting update:', id);
      
      const response = await fetch(`${apiUrl}/api/updates/${id}`, {
        method: 'DELETE',
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Failed to delete update');
      }

      console.log('✅ Update deleted successfully');

      // Refresh updates list
      await fetchUpdates();
    } catch (err) {
      console.error('❌ Error deleting update:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete update');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (update: Update) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/updates/${update._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !update.isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle update status');
      }

      // Refresh updates list
      await fetchUpdates();
    } catch (err) {
      console.error('❌ Error toggling update:', err);
    }
  };

  // Format time
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

  const stats = {
    total: updates.length,
    active: updates.filter((u) => u.isActive).length,
    announcements: updates.filter((u) => u.category === 'announcement').length,
    achievements: updates.filter((u) => u.category === 'achievement').length,
  };

  return (
    <div className={styles.updatesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Latest Updates</h1>
          <p className={styles.subtitle}>
            Manage and publish updates for your website
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => {
            setShowForm(!showForm);
            setEditingUpdate(null);
            setFormData({
              title: '',
              description: '',
              category: 'general',
              priority: 'medium',
              isActive: true,
              author: 'Admin',
            });
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Update'}
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Updates</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statValue}>{stats.active}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Announcements</div>
          <div className={styles.statValue}>{stats.announcements}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Achievements</div>
          <div className={styles.statValue}>{stats.achievements}</div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>
            {editingUpdate ? 'Edit Update' : 'Create New Update'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter update title"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description *</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter update description"
                rows={4}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category *</label>
                <select
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Update['category'] })}
                  required
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="achievement">Achievement</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Priority *</label>
                <select
                  className={styles.select}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Update['priority'] })}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Author</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Admin"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active (visible on website)</span>
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingUpdate ? 'Update' : 'Create'} Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({updates.length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'announcement' ? styles.active : ''}`}
          onClick={() => setFilter('announcement')}
        >
          Announcements ({updates.filter(u => u.category === 'announcement').length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'achievement' ? styles.active : ''}`}
          onClick={() => setFilter('achievement')}
        >
          Achievements ({updates.filter(u => u.category === 'achievement').length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'event' ? styles.active : ''}`}
          onClick={() => setFilter('event')}
        >
          Events ({updates.filter(u => u.category === 'event').length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'general' ? styles.active : ''}`}
          onClick={() => setFilter('general')}
        >
          General ({updates.filter(u => u.category === 'general').length})
        </button>
      </div>

      {/* Updates List */}
      <div className={styles.updatesList}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading updates...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button onClick={fetchUpdates} className={styles.retryButton}>
              Retry
            </button>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📢</div>
            <h3 className={styles.emptyTitle}>No updates yet</h3>
            <p className={styles.emptyText}>
              {filter === 'all'
                ? 'Create your first update to get started'
                : `No ${filter} updates found`}
            </p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div
              key={update._id}
              className={`${styles.updateCard} ${!update.isActive ? styles.inactive : ''}`}
            >
              <div className={styles.updateHeader}>
                <div className={styles.updateMeta}>
                  <span className={`${styles.categoryBadge} ${styles[update.category]}`}>
                    {update.category}
                  </span>
                  <span className={`${styles.priorityBadge} ${styles[update.priority]}`}>
                    {update.priority}
                  </span>
                  {!update.isActive && (
                    <span className={styles.inactiveBadge}>Inactive</span>
                  )}
                </div>
                <div className={styles.updateActions}>
                  <button
                    className={styles.toggleButton}
                    onClick={() => handleToggleActive(update)}
                    title={update.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {update.isActive ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(update)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(update._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className={styles.updateTitle}>{update.title}</h3>
              <p className={styles.updateDescription}>{update.description}</p>

              <div className={styles.updateFooter}>
                <span className={styles.updateAuthor}>By {update.author}</span>
                <span className={styles.updateTime}>{formatTime(update.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
