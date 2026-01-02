'use client';

import { useEffect, useState } from 'react';
import styles from '../contact/contact.module.css';

interface Robot {
  _id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  imageUrl: string;
  year?: number;
  status?: string;
  createdAt?: string;
}

export default function RobotsPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rawwebsite-seven.vercel.app';
      const response = await fetch(`${apiUrl}/api/robots`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch robots');
      }

      const data = await response.json();
      setRobots(data.data || []);
    } catch (err) {
      console.error('Error fetching robots:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch robots');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRobots = selectedCategory === 'all'
    ? robots
    : robots.filter(robot => robot.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'all') return robots.length;
    return robots.filter(r => r.category === category).length;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Robots Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading robots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Robots Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🤖 Robots Management</h1>
        <p className={styles.subtitle}>View and manage all robots</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{robots.length}</div>
          <div className={styles.statLabel}>Total Robots</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('competition')}</div>
          <div className={styles.statLabel}>Competition</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('research')}</div>
          <div className={styles.statLabel}>Research</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('development')}</div>
          <div className={styles.statLabel}>Development</div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({robots.length})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'competition' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('competition')}
        >
          Competition ({getCategoryCount('competition')})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'research' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('research')}
        >
          Research ({getCategoryCount('research')})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'development' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('development')}
        >
          Development ({getCategoryCount('development')})
        </button>
      </div>

      {filteredRobots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No robots found in this category.</p>
        </div>
      ) : (
        <div className={styles.messagesGrid}>
          {filteredRobots.map((robot) => (
            <div key={robot._id} className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <h3>{robot.name}</h3>
                <span className={styles.badge}>{robot.category}</span>
              </div>
              <div className={styles.messageBody}>
                <p><strong>Type:</strong> {robot.type}</p>
                <p><strong>Description:</strong> {robot.description}</p>
                {robot.year && <p><strong>Year:</strong> {robot.year}</p>}
                {robot.status && <p><strong>Status:</strong> {robot.status}</p>}
                {robot.imageUrl && (
                  <p><strong>Image:</strong> <a href={robot.imageUrl} target="_blank" rel="noopener noreferrer">View</a></p>
                )}
              </div>
              <div className={styles.messageFooter}>
                <small>Added: {robot.createdAt ? new Date(robot.createdAt).toLocaleDateString() : 'N/A'}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ marginBottom: '1rem' }}>ℹ️ Management Options</h3>
        <p style={{ marginBottom: '0.5rem' }}>To add, edit, or delete robots, you can:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Use <strong>MongoDB Compass</strong> to directly manage the <code>robots</code> collection</li>
          <li>Use <strong>Postman</strong> or <strong>curl</strong> to call the API endpoints:
            <ul style={{ marginTop: '0.5rem' }}>
              <li><code>POST /api/robots</code> - Create new robot</li>
              <li><code>PATCH /api/robots/[id]</code> - Update robot</li>
              <li><code>DELETE /api/robots/[id]</code> - Delete robot</li>
            </ul>
          </li>
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
          Full CRUD interface coming soon!
        </p>
      </div>
    </div>
  );
}
