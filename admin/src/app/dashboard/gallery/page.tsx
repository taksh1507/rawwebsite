'use client';

import { useEffect, useState } from 'react';
import styles from '../contact/contact.module.css';

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

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rawwebsite-seven.vercel.app';
      const response = await fetch(`${apiUrl}/api/gallery`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery');
      }

      const data = await response.json();
      setGalleryItems(data.data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'all') return galleryItems.length;
    return galleryItems.filter(item => item.category === category).length;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gallery Management</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gallery Management</h1>
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
        <h1 className={styles.title}>📸 Gallery Management</h1>
        <p className={styles.subtitle}>View and manage all gallery images</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{galleryItems.length}</div>
          <div className={styles.statLabel}>Total Images</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('robots')}</div>
          <div className={styles.statLabel}>Robots</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('events')}</div>
          <div className={styles.statLabel}>Events</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{getCategoryCount('workshops')}</div>
          <div className={styles.statLabel}>Workshops</div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({galleryItems.length})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'robots' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('robots')}
        >
          Robots ({getCategoryCount('robots')})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'events' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('events')}
        >
          Events ({getCategoryCount('events')})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'workshops' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('workshops')}
        >
          Workshops ({getCategoryCount('workshops')})
        </button>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'competitions' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('competitions')}
        >
          Competitions ({getCategoryCount('competitions')})
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No images found in this category.</p>
        </div>
      ) : (
        <div className={styles.messagesGrid}>
          {filteredItems.map((item) => (
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
              <div className={styles.messageFooter}>
                <small>Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ marginBottom: '1rem' }}>ℹ️ Management Options</h3>
        <p style={{ marginBottom: '0.5rem' }}>To add, edit, or delete gallery images, you can:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Use <strong>MongoDB Compass</strong> to directly manage the <code>gallery</code> collection</li>
          <li>Use <strong>Postman</strong> or <strong>curl</strong> to call the API endpoints:
            <ul style={{ marginTop: '0.5rem' }}>
              <li><code>POST /api/gallery</code> - Upload new image</li>
              <li><code>PATCH /api/gallery/[id]</code> - Update image details</li>
              <li><code>DELETE /api/gallery/[id]</code> - Delete image</li>
            </ul>
          </li>
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
          Full CRUD interface with image upload coming soon!
        </p>
      </div>
    </div>
  );
}
