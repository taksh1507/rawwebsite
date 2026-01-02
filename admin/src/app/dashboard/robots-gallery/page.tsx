'use client';

import { useEffect, useState } from 'react';
import styles from '../contact/contact.module.css';

interface Robot {
  _id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  specs?: string[];
  tags?: string[];
  features?: string[];
  achievements?: string[];
  year?: number;
  status?: string;
  teamLead?: string;
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
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Robot | GalleryItem | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
      } else {
        const response = await fetch(`${apiUrl}/api/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery');
        const data = await response.json();
        setGalleryItems(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview('');
    if (viewMode === 'robots') {
      setFormData({
        name: '',
        type: '',
        category: 'competition',
        description: '',
        longDescription: '',
        imageUrl: '',
        specs: '',
        tags: '',
        features: '',
        achievements: '',
        year: new Date().getFullYear(),
        status: 'active',
        teamLead: 'Team RAW',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        category: 'events',
        uploadedBy: 'Admin',
        year: new Date().getFullYear(),
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      setImageFile(file);

      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: Robot | GalleryItem) => {
    setEditingItem(item);
    setImageFile(null);
    if (viewMode === 'robots') {
      const robot = item as Robot;
      setImagePreview(robot.imageUrl);
      setFormData({
        name: robot.name,
        type: robot.type,
        category: robot.category,
        description: robot.description,
        longDescription: robot.longDescription || '',
        imageUrl: robot.imageUrl,
        specs: robot.specs?.join(', ') || '',
        tags: robot.tags?.join(', ') || '',
        features: robot.features?.join(', ') || '',
        achievements: robot.achievements?.join(', ') || '',
        year: robot.year || new Date().getFullYear(),
        status: robot.status || 'active',
        teamLead: robot.teamLead || 'Team RAW',
      });
    } else {
      const gallery = item as GalleryItem;
      setImagePreview(gallery.imageUrl);
      setFormData({
        title: gallery.title,
        description: gallery.description || '',
        imageUrl: gallery.imageUrl,
        category: gallery.category,
        uploadedBy: gallery.uploadedBy || 'Admin',
        year: gallery.year || new Date().getFullYear(),
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate image
    if (!formData.imageUrl && !imageFile) {
      alert('Please upload an image');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rawwebsite-seven.vercel.app';
      const endpoint = viewMode === 'robots' ? 'robots' : 'gallery';
      
      let payload = { ...formData };
      if (viewMode === 'robots') {
        payload = {
          ...formData,
          specs: formData.specs.split(',').map((s: string) => s.trim()).filter(Boolean),
          tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean),
          achievements: formData.achievements.split(',').map((a: string) => a.trim()).filter(Boolean),
        };
      }

      const url = editingItem 
        ? `${apiUrl}/api/${endpoint}/${editingItem._id}`
        : `${apiUrl}/api/${endpoint}`;
      
      const response = await fetch(url, {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save');
      }

      alert(`${viewMode === 'robots' ? 'Robot' : 'Gallery item'} ${editingItem ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving:', err);
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
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

      if (!response.ok) throw new Error(`Failed to delete`);
      
      alert(`${viewMode === 'robots' ? 'Robot' : 'Gallery item'} deleted successfully!`);
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filteredRobots = selectedCategory === 'all' ? robots : robots.filter(r => r.category === selectedCategory);
  const filteredGallery = selectedCategory === 'all' ? galleryItems : galleryItems.filter(g => g.category === selectedCategory);
  const currentData = viewMode === 'robots' ? filteredRobots : filteredGallery;

  const robotCategories = ['all', 'competition', 'research', 'development'];
  const galleryCategories = ['all', 'robots', 'events', 'workshops', 'competitions', 'team', 'milestones'];
  const categories = viewMode === 'robots' ? robotCategories : galleryCategories;

  const getCategoryCount = (category: string) => {
    if (category === 'all') return viewMode === 'robots' ? robots.length : galleryItems.length;
    return viewMode === 'robots' ? robots.filter(r => r.category === category).length : galleryItems.filter(g => g.category === category).length;
  };

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
        <p className={styles.subtitle}>Full CRUD - Create, Read, Update, Delete</p>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setViewMode('robots');
            setSelectedCategory('all');
            setShowForm(false);
            setEditingItem(null);
          }}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: viewMode === 'robots' ? '#E10600' : '#e9ecef',
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
            setShowForm(false);
            setEditingItem(null);
          }}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: viewMode === 'gallery' ? '#E10600' : '#e9ecef',
            color: viewMode === 'gallery' ? 'white' : '#495057',
            transition: 'all 0.3s ease',
          }}
        >
          📸 Gallery
        </button>
        <button
          onClick={handleAdd}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: '2px solid #E10600',
            borderRadius: '8px',
            cursor: 'pointer',
            background: 'white',
            color: '#E10600',
            transition: 'all 0.3s ease',
          }}
        >
          + Add New {viewMode === 'robots' ? 'Robot' : 'Image'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '2rem', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #E10600' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#E10600' }}>
            {editingItem ? '✏️ Edit' : '➕ Add New'} {viewMode === 'robots' ? 'Robot' : 'Gallery Item'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            {viewMode === 'robots' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Type *</label>
                    <input
                      type="text"
                      required
                      value={formData.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Line Follower"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category *</label>
                    <select
                      required
                      value={formData.category || 'competition'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    >
                      <option value="competition">Competition</option>
                      <option value="research">Research</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    >
                      <option value="active">Active</option>
                      <option value="retired">Retired</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Year</label>
                    <input
                      type="number"
                      value={formData.year || new Date().getFullYear()}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Image Upload *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <small style={{ color: '#6c757d', display: 'block', marginTop: '0.5rem' }}>Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP</small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description *</label>
                  <textarea
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Short description"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Long Description</label>
                  <textarea
                    value={formData.longDescription || ''}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={3}
                    placeholder="Detailed description"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Specs (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specs || ''}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      placeholder="IR Sensors, PWM Control, 30cm/s"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags || ''}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Autonomous, Competition"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Features (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.features || ''}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Real-time tracking, Adaptive speed"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Achievements (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.achievements || ''}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="1st Place TechFest 2024"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Team Lead</label>
                  <input
                    type="text"
                    value={formData.teamLead || 'Team RAW'}
                    onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category *</label>
                    <select
                      required
                      value={formData.category || 'events'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    >
                      <option value="robots">Robots</option>
                      <option value="events">Events</option>
                      <option value="workshops">Workshops</option>
                      <option value="competitions">Competitions</option>
                      <option value="team">Team</option>
                      <option value="milestones">Milestones</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Image Upload *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <small style={{ color: '#6c757d', display: 'block', marginTop: '0.5rem' }}>Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP</small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Image description"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Uploaded By</label>
                    <input
                      type="text"
                      value={formData.uploadedBy || 'Admin'}
                      onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Year</label>
                    <input
                      type="number"
                      value={formData.year || new Date().getFullYear()}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: '#E10600',
                  color: 'white',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? '⏳ Saving...' : (editingItem ? '💾 Update' : '✅ Create')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: '1px solid #ced4da',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#495057',
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{viewMode === 'robots' ? robots.length : galleryItems.length}</div>
          <div className={styles.statLabel}>Total {viewMode === 'robots' ? 'Robots' : 'Images'}</div>
        </div>
        {viewMode === 'robots' ? (
          <>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{robots.filter(r => r.category === 'competition').length}</div>
              <div className={styles.statLabel}>Competition</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{robots.filter(r => r.category === 'research').length}</div>
              <div className={styles.statLabel}>Research</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{robots.filter(r => r.category === 'development').length}</div>
              <div className={styles.statLabel}>Development</div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{galleryItems.filter(g => g.category === 'robots').length}</div>
              <div className={styles.statLabel}>Robots</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{galleryItems.filter(g => g.category === 'events').length}</div>
              <div className={styles.statLabel}>Events</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{galleryItems.filter(g => g.category === 'workshops').length}</div>
              <div className={styles.statLabel}>Workshops</div>
            </div>
          </>
        )}
      </div>

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

      {currentData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>No {viewMode === 'robots' ? 'robots' : 'gallery items'} found.</p>
          <button
            onClick={handleAdd}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: '#E10600',
              color: 'white',
            }}
          >
            + Add Your First {viewMode === 'robots' ? 'Robot' : 'Image'}
          </button>
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
                    <p><strong>Specs:</strong> {robot.specs.slice(0, 2).join(', ')}</p>
                  )}
                  {robot.year && <p><strong>Year:</strong> {robot.year}</p>}
                  {robot.status && <p><strong>Status:</strong> {robot.status}</p>}
                  {robot.imageUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={robot.imageUrl} 
                        alt={robot.name}
                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.messageFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small>Added: {robot.createdAt ? new Date(robot.createdAt).toLocaleDateString() : 'N/A'}</small>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(robot)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#0d6efd',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(robot._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
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
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', objectFit: 'cover' }}
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#0d6efd',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
