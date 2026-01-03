'use client';

/**
 * Enhanced Admin Dashboard - Robots & Gallery Management
 * Modern, Clean, Professional UI/UX Implementation
 * Author: Team RAW Admin
 */

import { useEffect, useState } from 'react';
import styles from './robotsgallery.module.css';

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
  detailedDescription?: string;
  imageUrl: string;
  images?: string[];
  category: string;
  uploadedBy?: string;
  year?: number;
  location?: string;
  date?: string;
  participants?: string;
  highlights?: string[];
  createdAt?: string;
}

type ViewMode = 'robots' | 'gallery';
type FilterCategory = 'all' | 'competition' | 'research' | 'development' | 'robots' | 'events' | 'workshops' | 'competitions' | 'team' | 'milestones';

export default function RobotsGalleryEnhancedPage() {
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
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [multipleImagePreviews, setMultipleImagePreviews] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [dragOver, setDragOver] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState<Robot | GalleryItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const handleViewDetails = (item: Robot | GalleryItem) => {
    setViewDetailsItem(item);
    setSelectedImageIndex(0);
  };

  const closeDetailsModal = () => {
    setViewDetailsItem(null);
    setSelectedImageIndex(0);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewDetailsItem) {
        closeDetailsModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [viewDetailsItem]);

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
    setMultipleImages([]);
    setMultipleImagePreviews([]);
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
        detailedDescription: '',
        imageUrl: '',
        images: [],
        category: 'events',
        uploadedBy: 'Admin',
        year: new Date().getFullYear(),
        location: '',
        date: '',
        participants: '',
        highlights: '',
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData({ ...formData, imageUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      const newPreviews: string[] = [];
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          showToast(`Image ${file.name} is too large. Max size: 5MB`, 'error');
          return;
        }
        if (!file.type.startsWith('image/')) {
          showToast(`${file.name} is not a valid image file`, 'error');
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length === 0) return;

      let processedCount = 0;
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          newImages.push(base64String);
          newPreviews.push(base64String);
          processedCount++;

          if (processedCount === validFiles.length) {
            setMultipleImages(prev => [...prev, ...newImages]);
            setMultipleImagePreviews(prev => [...prev, ...newPreviews]);
            setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMultipleImage = (index: number) => {
    const newPreviews = multipleImagePreviews.filter((_, i) => i !== index);
    const newImages = multipleImages.filter((_, i) => i !== index);
    setMultipleImagePreviews(newPreviews);
    setMultipleImages(newImages);
    setFormData({ ...formData, images: newImages });
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
      setMultipleImagePreviews(gallery.images || []);
      setMultipleImages(gallery.images || []);
      setFormData({
        title: gallery.title,
        description: gallery.description || '',
        detailedDescription: gallery.detailedDescription || '',
        imageUrl: gallery.imageUrl,
        images: gallery.images || [],
        category: gallery.category,
        uploadedBy: gallery.uploadedBy || 'Admin',
        year: gallery.year || new Date().getFullYear(),
        location: gallery.location || '',
        date: gallery.date || '',
        participants: gallery.participants || '',
        highlights: gallery.highlights?.join(', ') || '',
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl && !imageFile) {
      showToast('Please upload an image', 'error');
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
      } else {
        payload = {
          ...formData,
          highlights: formData.highlights 
            ? formData.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
            : [],
          images: multipleImages.length > 0 ? multipleImages : (formData.images || []),
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

      showToast(`${viewMode === 'robots' ? 'Robot' : 'Gallery item'} ${editingItem ? 'updated' : 'created'} successfully!`, 'success');
      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving:', err);
      showToast(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
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
      
      showToast(`${viewMode === 'robots' ? 'Robot' : 'Gallery item'} deleted successfully!`, 'success');
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      showToast(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
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
      <div className={styles.pageWrapper}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>🤖📸 Robots & Gallery Management</h1>
          <p className={styles.pageSubtitle}>Create, Read, Update, Delete - Complete Dashboard</p>
        </div>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          Admin Dashboard → <span>{viewMode === 'robots' ? 'Robots' : 'Gallery'}</span> → {showForm ? (editingItem ? 'Edit' : 'Add New') : 'View All'}
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabSwitcher}>
          <button
            onClick={() => {
              setViewMode('robots');
              setSelectedCategory('all');
              setShowForm(false);
              setEditingItem(null);
            }}
            className={`${styles.tabButton} ${viewMode === 'robots' ? styles.active : ''}`}
          >
            <span>🤖</span> Robots
          </button>
          <button
            onClick={() => {
              setViewMode('gallery');
              setSelectedCategory('all');
              setShowForm(false);
              setEditingItem(null);
            }}
            className={`${styles.tabButton} ${viewMode === 'gallery' ? styles.active : ''}`}
          >
            <span>📸</span> Gallery
          </button>
          <button onClick={handleAdd} className={styles.addButton}>
            + Add New {viewMode === 'robots' ? 'Robot' : 'Image'}
          </button>
        </div>

        {/* Stats Panel */}
        <div className={styles.statsPanel}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statValue}>{viewMode === 'robots' ? robots.length : galleryItems.length}</div>
            <div className={styles.statLabel}>Total {viewMode === 'robots' ? 'Robots' : 'Images'}</div>
          </div>
          {viewMode === 'robots' ? (
            <>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statValue}>{robots.filter(r => r.category === 'competition').length}</div>
                <div className={styles.statLabel}>Competition</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔬</div>
                <div className={styles.statValue}>{robots.filter(r => r.category === 'research').length}</div>
                <div className={styles.statLabel}>Research</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⚙️</div>
                <div className={styles.statValue}>{robots.filter(r => r.category === 'development').length}</div>
                <div className={styles.statLabel}>Development</div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎉</div>
                <div className={styles.statValue}>{galleryItems.filter(g => g.category === 'events').length}</div>
                <div className={styles.statLabel}>Events</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🛠️</div>
                <div className={styles.statValue}>{galleryItems.filter(g => g.category === 'workshops').length}</div>
                <div className={styles.statLabel}>Workshops</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statValue}>{galleryItems.filter(g => g.category === 'competitions').length}</div>
                <div className={styles.statLabel}>Competitions</div>
              </div>
            </>
          )}
        </div>

        {/* Form Container */}
        {showForm && (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {editingItem ? '✏️ Edit' : '➕ Add New'} {viewMode === 'robots' ? 'Robot' : 'Gallery Item'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formBody}>
                {viewMode === 'robots' ? (
                  <>
                    {/* Basic Information Section */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📌</span>
                        <h3 className={styles.sectionTitle}>Basic Information</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              Robot Name <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name || ''}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g., LineBot Pro"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              Type <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.type || ''}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                              placeholder="e.g., Line Follower"
                              className={styles.input}
                            />
                          </div>
                        </div>

                        <div className={styles.formRowTriple}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📂</span> Category <span className={styles.required}>*</span>
                            </label>
                            <select
                              required
                              value={formData.category || 'competition'}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className={styles.select}
                            >
                              <option value="competition">🏆 Competition</option>
                              <option value="research">🔬 Research</option>
                              <option value="development">⚙️ Development</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>✓</span> Status
                            </label>
                            <select
                              value={formData.status || 'active'}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              className={styles.select}
                            >
                              <option value="active">✅ Active</option>
                              <option value="retired">🔒 Retired</option>
                              <option value="development">🔧 Development</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📅</span> Year
                            </label>
                            <input
                              type="number"
                              value={formData.year || new Date().getFullYear()}
                              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>🖼</span>
                        <h3 className={styles.sectionTitle}>Media Upload</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Main Image <span className={styles.required}>*</span>
                          </label>
                          <div
                            className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('robot-image-input')?.click()}
                          >
                            <div className={styles.uploadIcon}>📤</div>
                            <p className={styles.uploadText}>Drag & drop or click to upload</p>
                            <p className={styles.uploadHint}>Supported: JPG, PNG, GIF, WebP (Max 5MB)</p>
                            <input
                              id="robot-image-input"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className={styles.fileInput}
                            />
                          </div>
                          {imagePreview && (
                            <div className={styles.imagePreview}>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className={styles.previewImage}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information Section */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📄</span>
                        <h3 className={styles.sectionTitle}>Detailed Information</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Short Description <span className={styles.required}>*</span>
                          </label>
                          <textarea
                            required
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief overview of the robot..."
                            className={styles.textarea}
                            rows={3}
                            maxLength={200}
                          />
                          <div className={styles.characterCounter}>
                            {formData.description?.length || 0}/200 characters
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>Long Description</label>
                          <textarea
                            value={formData.longDescription || ''}
                            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                            placeholder="Detailed description about the robot's capabilities, design, and achievements..."
                            className={styles.textarea}
                            rows={5}
                          />
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>⚙️</span> Specifications
                            </label>
                            <input
                              type="text"
                              value={formData.specs || ''}
                              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                              placeholder="IR Sensors, PWM Control, 30cm/s (comma-separated)"
                              className={styles.input}
                            />
                            <div className={styles.helperText}>
                              💡 Separate items with commas
                            </div>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>🏷️</span> Tags
                            </label>
                            <input
                              type="text"
                              value={formData.tags || ''}
                              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                              placeholder="Autonomous, Competition (comma-separated)"
                              className={styles.input}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            <span className={styles.labelIcon}>⭐</span> Features
                          </label>
                          <input
                            type="text"
                            value={formData.features || ''}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            placeholder="Real-time tracking, Adaptive speed (comma-separated)"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            <span className={styles.labelIcon}>🏆</span> Achievements
                          </label>
                          <input
                            type="text"
                            value={formData.achievements || ''}
                            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                            placeholder="1st Place TechFest 2024, Best Design Award (comma-separated)"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            <span className={styles.labelIcon}>👤</span> Team Lead
                          </label>
                          <input
                            type="text"
                            value={formData.teamLead || 'Team RAW'}
                            onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                            className={styles.input}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Gallery Basic Information */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📌</span>
                        <h3 className={styles.sectionTitle}>Basic Information</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              Title <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.title || ''}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="Enter image title"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📂</span> Category <span className={styles.required}>*</span>
                            </label>
                            <select
                              required
                              value={formData.category || 'events'}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className={styles.select}
                            >
                              <option value="robots">🤖 Robots</option>
                              <option value="events">🎉 Events</option>
                              <option value="workshops">🛠️ Workshops</option>
                              <option value="competitions">🏆 Competitions</option>
                              <option value="team">👥 Team</option>
                              <option value="milestones">🎯 Milestones</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Detailed Information */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📄</span>
                        <h3 className={styles.sectionTitle}>Detailed Information</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Short Description <span className={styles.required}>*</span>
                          </label>
                          <textarea
                            required
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description (max 200 characters)"
                            className={styles.textarea}
                            rows={2}
                            maxLength={200}
                          />
                          <div className={styles.characterCounter}>
                            {formData.description?.length || 0}/200 characters
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>Detailed Description</label>
                          <textarea
                            value={formData.detailedDescription || ''}
                            onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                            placeholder="Enter detailed description about the event/workshop..."
                            className={styles.textarea}
                            rows={6}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            <span className={styles.labelIcon}>✨</span> Highlights
                          </label>
                          <input
                            type="text"
                            value={formData.highlights || ''}
                            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                            placeholder="Hands-on sessions, Expert speakers, Live demos (comma-separated)"
                            className={styles.input}
                          />
                          <div className={styles.helperText}>
                            💡 Separate highlights with commas
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Metadata */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📍</span>
                        <h3 className={styles.sectionTitle}>Event Metadata</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formRowTriple}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📍</span> Location
                            </label>
                            <input
                              type="text"
                              value={formData.location || ''}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="e.g., Tech Park Hall A"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📅</span> Date
                            </label>
                            <input
                              type="date"
                              value={formData.date || ''}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>👥</span> Participants
                            </label>
                            <input
                              type="text"
                              value={formData.participants || ''}
                              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                              placeholder="e.g., 50+ students"
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Media Upload */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>🖼</span>
                        <h3 className={styles.sectionTitle}>Media Upload</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Main Image <span className={styles.required}>*</span>
                          </label>
                          <div
                            className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('gallery-image-input')?.click()}
                          >
                            <div className={styles.uploadIcon}>📤</div>
                            <p className={styles.uploadText}>Drag & drop or click to upload</p>
                            <p className={styles.uploadHint}>Main display image (Max 5MB)</p>
                            <input
                              id="gallery-image-input"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className={styles.fileInput}
                            />
                          </div>
                          {imagePreview && (
                            <div className={styles.imagePreview}>
                              <img
                                src={imagePreview}
                                alt="Main Preview"
                                className={styles.previewImage}
                              />
                            </div>
                          )}
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Additional Images (Multiple)
                          </label>
                          <div className={styles.uploadArea} onClick={() => document.getElementById('gallery-multi-input')?.click()}>
                            <div className={styles.uploadIcon}>📸</div>
                            <p className={styles.uploadText}>Click to upload multiple images</p>
                            <p className={styles.uploadHint}>Upload multiple images for gallery view</p>
                            <input
                              id="gallery-multi-input"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleMultipleImagesChange}
                              className={styles.fileInput}
                            />
                          </div>
                          {multipleImagePreviews.length > 0 && (
                            <div className={styles.multiImageGrid}>
                              {multipleImagePreviews.map((preview, index) => (
                                <div key={index} className={styles.multiImageItem}>
                                  <img src={preview} alt={`Preview ${index + 1}`} />
                                  <button
                                    type="button"
                                    onClick={() => removeMultipleImage(index)}
                                    className={styles.removeImageBtn}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className={styles.helperText}>
                            📸 {multipleImagePreviews.length} image(s) added
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className={styles.formSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>⚙</span>
                        <h3 className={styles.sectionTitle}>Metadata</h3>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>👤</span> Uploaded By
                            </label>
                            <input
                              type="text"
                              value={formData.uploadedBy || 'Admin'}
                              onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                              className={styles.input}
                              disabled
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>📅</span> Year
                            </label>
                            <input
                              type="number"
                              value={formData.year || new Date().getFullYear()}
                              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sticky Footer */}
              <div className={styles.formFooter}>
                <div className={styles.btnGroup}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className={styles.btnCancel}
                  >
                    Cancel
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btnSubmit}
                >
                  {isSubmitting ? '⏳ Saving...' : (editingItem ? '💾 Update Item' : '✅ Create Item')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        {!showForm && (
          <>
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

            {/* Items Grid */}
            {error && (
              <div className={styles.errorContainer}>
                <p className={styles.errorText}>⚠️ Error: {error}</p>
              </div>
            )}

            {currentData.length === 0 ? (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📭</div>
                <p className={styles.emptyText}>No {viewMode === 'robots' ? 'robots' : 'gallery items'} found in this category.</p>
                <button onClick={handleAdd} className={styles.addButton} style={{ marginTop: '1rem' }}>
                  + Add Your First {viewMode === 'robots' ? 'Robot' : 'Image'}
                </button>
              </div>
            ) : (
              <div className={styles.itemsGrid}>
                {viewMode === 'robots' ? (
                  filteredRobots.map((robot) => (
                    <div key={robot._id} className={styles.itemCard}>
                      {robot.imageUrl && (
                        <img
                          src={robot.imageUrl}
                          alt={robot.name}
                          className={styles.itemImage}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <div className={styles.itemContent}>
                        <div className={styles.itemHeader}>
                          <h3 className={styles.itemTitle}>{robot.name}</h3>
                          <span className={styles.itemBadge}>{robot.category}</span>
                        </div>
                        <p className={styles.itemDescription}>{robot.description}</p>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemMetaItem}>🔧 {robot.type}</span>
                          {robot.year && <span className={styles.itemMetaItem}>📅 {robot.year}</span>}
                          {robot.status && <span className={styles.itemMetaItem}>✓ {robot.status}</span>}
                        </div>
                        <div className={styles.itemActions}>
                          <button onClick={() => handleViewDetails(robot)} className={styles.btnView}>
                            👁️ View
                          </button>
                          <button onClick={() => handleEdit(robot)} className={styles.btnEdit}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(robot._id)} className={styles.btnDelete}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredGallery.map((item) => (
                    <div key={item._id} className={styles.itemCard}>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={styles.itemImage}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <div className={styles.itemContent}>
                        <div className={styles.itemHeader}>
                          <h3 className={styles.itemTitle}>{item.title}</h3>
                          <span className={styles.itemBadge}>{item.category}</span>
                        </div>
                        <p className={styles.itemDescription}>{item.description}</p>
                        <div className={styles.itemMeta}>
                          {item.location && <span className={styles.itemMetaItem}>📍 {item.location}</span>}
                          {item.date && <span className={styles.itemMetaItem}>📅 {new Date(item.date).toLocaleDateString()}</span>}
                          {item.participants && <span className={styles.itemMetaItem}>👥 {item.participants}</span>}
                          {item.year && <span className={styles.itemMetaItem}>📆 {item.year}</span>}
                        </div>
                        <div className={styles.itemActions}>
                          <button onClick={() => handleViewDetails(item)} className={styles.btnView}>
                            👁️ View
                          </button>
                          <button onClick={() => handleEdit(item)} className={styles.btnEdit}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(item._id)} className={styles.btnDelete}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* View Details Modal */}
        {viewDetailsItem && (
          <div className={styles.modalOverlay} onClick={closeDetailsModal}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button className={styles.modalClose} onClick={closeDetailsModal} aria-label="Close modal">
                ✕
              </button>

              <div className={styles.modalContent}>
                {/* Left: Image Viewer (60-65%) */}
                <div className={styles.modalImageSection}>
                  {/* Main Image */}
                  <div className={styles.modalMainImage}>
                    {viewMode === 'robots' ? (
                      <img
                        src={(viewDetailsItem as Robot).imageUrl}
                        alt={(viewDetailsItem as Robot).name}
                        className={styles.mainImg}
                      />
                    ) : (
                      <img
                        src={selectedImageIndex === 0 
                          ? (viewDetailsItem as GalleryItem).imageUrl 
                          : ((viewDetailsItem as GalleryItem).images?.[selectedImageIndex - 1] || (viewDetailsItem as GalleryItem).imageUrl)
                        }
                        alt={(viewDetailsItem as GalleryItem).title}
                        className={styles.mainImg}
                      />
                    )}
                    
                    {/* Image Counter */}
                    {viewMode === 'gallery' && (viewDetailsItem as GalleryItem).images && (viewDetailsItem as GalleryItem).images!.length > 0 && (
                      <div className={styles.imageCounter}>
                        {selectedImageIndex + 1} / {(viewDetailsItem as GalleryItem).images!.length + 1}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery Strip */}
                  {viewMode === 'gallery' && (viewDetailsItem as GalleryItem).images && (viewDetailsItem as GalleryItem).images!.length > 0 && (
                    <div className={styles.thumbnailStrip}>
                      <div 
                        className={`${styles.thumbnail} ${selectedImageIndex === 0 ? styles.activeThumbnail : ''}`}
                        onClick={() => setSelectedImageIndex(0)}
                      >
                        <img src={(viewDetailsItem as GalleryItem).imageUrl} alt="Main" />
                      </div>
                      {(viewDetailsItem as GalleryItem).images!.map((img, idx) => (
                        <div
                          key={idx}
                          className={`${styles.thumbnail} ${selectedImageIndex === idx + 1 ? styles.activeThumbnail : ''}`}
                          onClick={() => setSelectedImageIndex(idx + 1)}
                        >
                          <img src={img} alt={`Image ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Content & Metadata (35-40%) */}
                <div className={styles.modalInfoSection}>
                  {/* Header */}
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {viewMode === 'robots' ? (viewDetailsItem as Robot).name : (viewDetailsItem as GalleryItem).title}
                    </h2>
                    <span className={styles.modalBadge}>
                      {viewMode === 'robots' ? '🤖 ' : '📸 '}
                      {(viewDetailsItem as any).category}
                    </span>
                  </div>

                  {/* Description Block */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.sectionLabel}>DESCRIPTION</h3>
                    <p className={styles.sectionContent}>
                      {viewMode === 'robots' 
                        ? (viewDetailsItem as Robot).description 
                        : (viewDetailsItem as GalleryItem).description
                      }
                    </p>
                  </div>

                  {/* Detailed Overview */}
                  {((viewMode === 'robots' && (viewDetailsItem as Robot).longDescription) || 
                    (viewMode === 'gallery' && (viewDetailsItem as GalleryItem).detailedDescription)) && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.sectionLabel}>DETAILED OVERVIEW</h3>
                      <p className={styles.sectionContent}>
                        {viewMode === 'robots' 
                          ? (viewDetailsItem as Robot).longDescription 
                          : (viewDetailsItem as GalleryItem).detailedDescription
                        }
                      </p>
                    </div>
                  )}

                  {/* Highlights/Features */}
                  {viewMode === 'robots' && (viewDetailsItem as Robot).features && (viewDetailsItem as Robot).features!.length > 0 && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.sectionLabel}>FEATURES</h3>
                      <div className={styles.chipsList}>
                        {(viewDetailsItem as Robot).features!.map((feature, idx) => (
                          <span key={idx} className={styles.chip}>• {feature}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewMode === 'gallery' && (viewDetailsItem as GalleryItem).highlights && (viewDetailsItem as GalleryItem).highlights!.length > 0 && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.sectionLabel}>HIGHLIGHTS</h3>
                      <div className={styles.chipsList}>
                        {(viewDetailsItem as GalleryItem).highlights!.map((highlight, idx) => (
                          <span key={idx} className={styles.chip}>• {highlight}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specifications (Robots only) */}
                  {viewMode === 'robots' && (viewDetailsItem as Robot).specs && (viewDetailsItem as Robot).specs!.length > 0 && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.sectionLabel}>SPECIFICATIONS</h3>
                      <div className={styles.chipsList}>
                        {(viewDetailsItem as Robot).specs!.map((spec, idx) => (
                          <span key={idx} className={styles.chip}>• {spec}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements (Robots only) */}
                  {viewMode === 'robots' && (viewDetailsItem as Robot).achievements && (viewDetailsItem as Robot).achievements!.length > 0 && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.sectionLabel}>ACHIEVEMENTS</h3>
                      <div className={styles.chipsList}>
                        {(viewDetailsItem as Robot).achievements!.map((achievement, idx) => (
                          <span key={idx} className={styles.chipAchievement}>🏆 {achievement}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Panel */}
                  <div className={styles.metadataCard}>
                    {viewMode === 'robots' ? (
                      <>
                        {(viewDetailsItem as Robot).type && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>🔧</span>
                            <span className={styles.metaLabel}>Type:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as Robot).type}</span>
                          </div>
                        )}
                        {(viewDetailsItem as Robot).status && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>✓</span>
                            <span className={styles.metaLabel}>Status:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as Robot).status}</span>
                          </div>
                        )}
                        {(viewDetailsItem as Robot).year && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>📅</span>
                            <span className={styles.metaLabel}>Year:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as Robot).year}</span>
                          </div>
                        )}
                        {(viewDetailsItem as Robot).teamLead && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>👤</span>
                            <span className={styles.metaLabel}>Team Lead:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as Robot).teamLead}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {(viewDetailsItem as GalleryItem).date && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>📅</span>
                            <span className={styles.metaLabel}>Date:</span>
                            <span className={styles.metaValue}>{new Date((viewDetailsItem as GalleryItem).date!).toLocaleDateString()}</span>
                          </div>
                        )}
                        {(viewDetailsItem as GalleryItem).location && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>📍</span>
                            <span className={styles.metaLabel}>Location:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as GalleryItem).location}</span>
                          </div>
                        )}
                        {(viewDetailsItem as GalleryItem).participants && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>👥</span>
                            <span className={styles.metaLabel}>Participants:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as GalleryItem).participants}</span>
                          </div>
                        )}
                        {(viewDetailsItem as GalleryItem).year && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>📆</span>
                            <span className={styles.metaLabel}>Year:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as GalleryItem).year}</span>
                          </div>
                        )}
                        {(viewDetailsItem as GalleryItem).uploadedBy && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>👤</span>
                            <span className={styles.metaLabel}>Uploaded By:</span>
                            <span className={styles.metaValue}>{(viewDetailsItem as GalleryItem).uploadedBy}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            <span className={styles.toastIcon}>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span className={styles.toastMessage}>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
