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
  specs?: string[];
  tags?: string[];
  year?: number;
  status?: string;
  createdAt?: string;
}

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  uploadedBy?: string;
  year?: number;
  createdAt?: string;
}

type ViewMode = 'robots' | 'gallery';
type FilterCategory = 'all' | 'competition' | 'research' | 'development' | 'events' | 'workshops' | 'competitions' | 'team' | 'milestones';

export default function RobotsGalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('robots');
  const [robots, setRobots] = useState<Robot[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rawwebsite-seven.vercel.app';
      
      if (viewMode === 'robots') {
        const response = await fetch(`${apiUrl}/api/robots`);
        if (!response.ok) throw new Error('Failed to fetch robots');
        const data = await response.json();
        setRobots(data.data || []);
        console.log('✅ Fetched robots:', data.data?.length);
      } else {
        const response = await fetch(`${apiUrl}/api/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery');
        const data = await response.json();
        setGalleryItems(data.data || []);
        console.log('✅ Fetched gallery items:', data.data?.length);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${viewMode === 'robots' ? 'robot' : 'gallery item'}?`)) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rawwebsite-seven.vercel.app';
      const endpoint = viewMode === 'robots' ? 'robots' : 'gallery';
      const response = await fetch(`${apiUrl}/api/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${viewMode}`);
      
      alert(`${viewMode === 'robots' ? 'Robot' : 'Gallery item'} deleted successfully!`);
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filteredRobots = selectedCategory === 'all' 
    ? robots 
    : robots.filter(r => r.category === selectedCategory);

  const filteredGallery = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(g => g.category === selectedCategory);

  const currentData = viewMode === 'robots' ? filteredRobots : filteredGallery;

  const robotCategories = ['all', 'competition', 'research', 'development'];
  const galleryCategories = ['all', 'robots', 'events', 'workshops', 'competitions', 'team', 'milestones'];
  const categories = viewMode === 'robots' ? robotCategories : galleryCategories;

  const getCategoryCount = (category: string) => {
    if (category === 'all') {
      return viewMode === 'robots' ? robots.length : galleryItems.length;
    }
    return viewMode === 'robots'
      ? robots.filter(r => r.category === category).length
      : galleryItems.filter(g => g.category === category).length;
  };

  const getTotalStats = () => {
    if (viewMode === 'robots') {
      return {
        total: robots.length,
        competition: robots.filter(r => r.category === 'competition').length,
        research: robots.filter(r => r.category === 'research').length,
        development: robots.filter(r => r.category === 'development').length,
      };
    } else {
      return {
        total: galleryItems.length,
        robots: galleryItems.filter(g => g.category === 'robots').length,
        events: galleryItems.filter(g => g.category === 'events').length,
        workshops: galleryItems.filter(g => g.category === 'workshops').length,
      };
    }
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🤖📸 Robots & Gallery Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🤖📸 Robots & Gallery Management</h1>
        <p className={styles.subtitle}>Manage all robots and gallery content</p>
      </div>

      {/* View Mode Toggle */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => {
            setViewMode('robots');
            setSelectedCategory('all');
          }}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: viewMode === 'robots' ? 'var(--color-red, #E10600)' : '#e9ecef',
            color: viewMode === 'robots' ? 'white' : '#495057',
            transition: 'all 0.3s ease',
          }}
        >
          🤖 Robots
        </button>
        <button
          onClick={() => {
            setViewMode('gallery');
            setSelectedCategory('all');
          }}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: viewMode === 'gallery' ? 'var(--color-red, #E10600)' : '#e9ecef',
            color: viewMode === 'gallery' ? 'white' : '#495057',
            transition: 'all 0.3s ease',
          }}
        >
          📸 Gallery
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.total}</div>
          <div className={styles.statLabel}>Total {viewMode === 'robots' ? 'Robots' : 'Images'}</div>
        </div>
        {viewMode === 'robots' ? (
          <>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.competition}</div>
              <div className={styles.statLabel}>Competition</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.research}</div>
              <div className={styles.statLabel}>Research</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.development}</div>
              <div className={styles.statLabel}>Development</div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.robots}</div>
              <div className={styles.statLabel}>Robots</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.events}</div>
              <div className={styles.statLabel}>Events</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.workshops}</div>
              <div className={styles.statLabel}>Workshops</div>
            </div>
          </>
        )}
      </div>

      {/* Category Filter */}
      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterButton} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat as FilterCategory)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({getCategoryCount(cat)})
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {/* Content Grid */}
      {currentData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No {viewMode === 'robots' ? 'robots' : 'gallery items'} found{selectedCategory !== 'all' ? ` in category "${selectedCategory}"` : ''}.</p>
        </div>
      ) : (
        <div className={styles.messagesGrid}>
          {viewMode === 'robots' ? (
            filteredRobots.map((robot) => (
              <div key={robot._id} className={styles.messageCard}>
                <div className={styles.messageHeader}>
                  <h3>{robot.name}</h3>
                  <span className={styles.badge}>{robot.category}</span>
                </div>
                <div className={styles.messageBody}>
                  <p><strong>Type:</strong> {robot.type}</p>
                  <p><strong>Description:</strong> {robot.description}</p>
                  {robot.specs && robot.specs.length > 0 && (
                    <p><strong>Specs:</strong> {robot.specs.join(', ')}</p>
                  )}
                  {robot.year && <p><strong>Year:</strong> {robot.year}</p>}
                  {robot.status && <p><strong>Status:</strong> {robot.status}</p>}
                  {robot.imageUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={robot.imageUrl} 
                        alt={robot.name}
                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.messageFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small>Added: {robot.createdAt ? new Date(robot.createdAt).toLocaleDateString() : 'N/A'}</small>
                  <button
                    onClick={() => handleDelete(robot._id)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredGallery.map((item) => (
              <div key={item._id} className={styles.messageCard}>
                <div className={styles.messageHeader}>
                  <h3>{item.title}</h3>
                  <span className={styles.badge}>{item.category}</span>
                </div>
                <div className={styles.messageBody}>
                  {item.description && <p><strong>Description:</strong> {item.description}</p>}
                  {item.imageUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {item.uploadedBy && <p><strong>Uploaded By:</strong> {item.uploadedBy}</p>}
                  {item.year && <p><strong>Year:</strong> {item.year}</p>}
                </div>
                <div className={styles.messageFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small>Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</small>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Management Info */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ marginBottom: '1rem' }}>ℹ️ Management Options</h3>
        <p style={{ marginBottom: '0.5rem' }}>To add or edit items, you can:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Use <strong>MongoDB Compass</strong> to directly manage the collections</li>
          <li>Use <strong>Postman</strong> or <strong>curl</strong> to call the API endpoints:
            <ul style={{ marginTop: '0.5rem' }}>
              <li><code>POST /api/{viewMode}</code> - Create new item</li>
              <li><code>PATCH /api/{viewMode}/[id]</code> - Update item</li>
              <li><code>DELETE /api/{viewMode}/[id]</code> - Delete item (available above)</li>
            </ul>
          </li>
          <li>Run seed script: <code>node scripts/seed-robots-gallery.js</code></li>
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
          Full CRUD interface with forms coming soon!
        </p>
      </div>
    </div>
  );
}
