/**
 * Admin Competitions Management Page
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './competitions.module.css';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface Competition {
  _id: string;
  name: string;
  organizer: string;
  date: string;
  description: string;
  deadline: string;
  teamSize: string;
  imageUrl?: string;
  notes?: string;
  isActive: boolean;
  registrationEnabled: boolean;
  registrationStartDate?: string;
  registrationEndDate?: string;
  customFields: CustomField[];
  createdAt: string;
  updatedAt: string;
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    date: '',
    description: '',
    deadline: '',
    teamSize: '',
    imageUrl: '',
    notes: '',
    isActive: true,
    registrationEnabled: true,
    registrationStartDate: '',
    registrationEndDate: '',
    customFields: [] as CustomField[],
  });

  const [newField, setNewField] = useState<CustomField>({
    id: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
  });

  // Fetch competitions
  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/competitions');
      const result = await response.json();
      if (result.success) {
        setCompetitions(result.data);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddField = () => {
    if (!newField.label) {
      alert('Please enter a field label');
      return;
    }

    const field: CustomField = {
      ...newField,
      id: `field_${Date.now()}`,
    };

    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, field],
    }));

    // Reset new field form
    setNewField({
      id: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
    });
  };

  const handleRemoveField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== fieldId),
    }));
  };

  const handleMoveFieldUp = (index: number) => {
    if (index === 0) return; // Already at top
    
    setFormData(prev => {
      const newFields = [...prev.customFields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      return {
        ...prev,
        customFields: newFields,
      };
    });
  };

  const handleMoveFieldDown = (index: number) => {
    if (index === formData.customFields.length - 1) return; // Already at bottom
    
    setFormData(prev => {
      const newFields = [...prev.customFields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      return {
        ...prev,
        customFields: newFields,
      };
    });
  };

  const handleEditField = (index: number) => {
    const field = formData.customFields[index];
    setNewField(field);
    handleRemoveField(field.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCompetition
        ? `/api/competitions/${editingCompetition._id}`
        : '/api/competitions';
      
      const method = editingCompetition ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Competition ${editingCompetition ? 'updated' : 'created'} successfully!`);
        fetchCompetitions();
        resetForm();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving competition:', error);
      alert('Failed to save competition');
    }
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setFormData({
      name: competition.name,
      organizer: competition.organizer,
      date: competition.date,
      description: competition.description,
      deadline: competition.deadline,
      teamSize: competition.teamSize,
      imageUrl: competition.imageUrl || '',
      notes: competition.notes || '',
      isActive: competition.isActive,
      registrationEnabled: competition.registrationEnabled ?? true,
      registrationStartDate: competition.registrationStartDate || '',
      registrationEndDate: competition.registrationEndDate || '',
      customFields: competition.customFields || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return;

    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        alert('Competition deleted successfully!');
        fetchCompetitions();
      }
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('Failed to delete competition');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      organizer: '',
      date: '',
      description: '',
      deadline: '',
      teamSize: '',
      imageUrl: '',
      notes: '',
      isActive: true,
      registrationEnabled: true,
      registrationStartDate: '',
      registrationEndDate: '',
      customFields: [],
    });
    setEditingCompetition(null);
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Competitions Management</h1>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Competition'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>{editingCompetition ? 'Edit Competition' : 'Create New Competition'}</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Information */}
            <div className={styles.formSection}>
              <h3>Basic Information</h3>
              
              <div className={styles.formGroup}>
                <label>Competition Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., e-Yantra Robotics Competition 2026"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Organizer *</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., IIT Bombay"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Competition Date *</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., May 15-20, 2026"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Brief description of the competition..."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Registration Deadline *</label>
                  <input
                    type="text"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., March 15, 2026"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Team Size *</label>
                  <input
                    type="text"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 3-5 members"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes or instructions for this competition..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Active (Show in competitions list)</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="registrationEnabled"
                    checked={formData.registrationEnabled}
                    onChange={handleInputChange}
                  />
                  <span>Enable Registration (Allow students to register)</span>
                </label>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Registration Start Date (Optional)</label>
                  <input
                    type="datetime-local"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleInputChange}
                  />
                  <small style={{color: '#666', fontSize: '0.85rem'}}>Leave empty to start immediately</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Registration End Date (Optional)</label>
                  <input
                    type="datetime-local"
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleInputChange}
                  />
                  <small style={{color: '#666', fontSize: '0.85rem'}}>Leave empty for no end date</small>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className={styles.formSection}>
              <h3>Custom Form Fields</h3>
              <p className={styles.helpText}>
                Add custom fields that students need to fill when registering for this competition
              </p>

              {/* Display existing custom fields */}
              {formData.customFields.length > 0 && (
                <div className={styles.customFieldsList}>
                  {formData.customFields.map((field, index) => (
                    <div key={field.id} className={styles.customFieldItem}>
                      <div className={styles.fieldOrder}>
                        <span className={styles.orderNumber}>{index + 1}</span>
                      </div>
                      <div className={styles.fieldInfo}>
                        <strong>{field.label}</strong>
                        <span className={styles.fieldMeta}>
                          Type: {field.type} • {field.required ? 'Required' : 'Optional'}
                        </span>
                        {field.placeholder && (
                          <span className={styles.fieldPlaceholder}>
                            Placeholder: "{field.placeholder}"
                          </span>
                        )}
                        {field.options && field.options.length > 0 && (
                          <span className={styles.fieldOptions}>
                            Options: {field.options.join(', ')}
                          </span>
                        )}
                      </div>
                      <div className={styles.fieldActions}>
                        <button
                          type="button"
                          onClick={() => handleMoveFieldUp(index)}
                          className={styles.btnMove}
                          disabled={index === 0}
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFieldDown(index)}
                          className={styles.btnMove}
                          disabled={index === formData.customFields.length - 1}
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditField(index)}
                          className={styles.btnEdit}
                          title="Edit Field"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className={styles.btnDelete}
                          title="Remove Field"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new field form */}
              <div className={styles.addFieldForm}>
                <h4>Add New Field</h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Field Label</label>
                    <input
                      type="text"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="e.g., Project Title"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Field Type</label>
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                    >
                      <option value="text">Text Input</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone Number</option>
                      <option value="textarea">Text Area</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Placeholder (Optional)</label>
                  <input
                    type="text"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="Placeholder text..."
                  />
                </div>

                {newField.type === 'select' && (
                  <div className={styles.formGroup}>
                    <label>Options (comma-separated)</label>
                    <input
                      type="text"
                      onChange={(e) => setNewField({ 
                        ...newField, 
                        options: e.target.value.split(',').map(o => o.trim())
                      })}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                    <span>Required Field</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAddField}
                  className={styles.btnSecondary}
                >
                  + Add Field
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>
                {editingCompetition ? 'Update Competition' : 'Create Competition'}
              </button>
              <button type="button" onClick={resetForm} className={styles.btnSecondary}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Competitions List */}
      <div className={styles.competitionsList}>
        <h2>All Competitions ({competitions.length})</h2>
        
        {loading ? (
          <div className={styles.loading}>Loading competitions...</div>
        ) : competitions.length === 0 ? (
          <div className={styles.empty}>
            No competitions found. Create your first competition!
          </div>
        ) : (
          <div className={styles.grid}>
            {competitions.map((competition) => {
              // Check registration status
              const now = new Date();
              const startDate = competition.registrationStartDate ? new Date(competition.registrationStartDate) : null;
              const endDate = competition.registrationEndDate ? new Date(competition.registrationEndDate) : null;
              
              let registrationStatus = 'Disabled';
              let registrationColor = '#666';
              
              if (competition.registrationEnabled) {
                if (startDate && now < startDate) {
                  registrationStatus = 'Not Started';
                  registrationColor = '#ff9800';
                } else if (endDate && now > endDate) {
                  registrationStatus = 'Closed';
                  registrationColor = '#f44336';
                } else {
                  registrationStatus = 'Open';
                  registrationColor = '#4caf50';
                }
              }
              
              return (
              <div key={competition._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{competition.name}</h3>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    <span className={`${styles.badge} ${competition.isActive ? styles.active : styles.inactive}`}>
                      {competition.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={styles.badge} style={{backgroundColor: registrationColor, color: 'white'}}>
                      Registration: {registrationStatus}
                    </span>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <p><strong>Organizer:</strong> {competition.organizer}</p>
                  <p><strong>Date:</strong> {competition.date}</p>
                  <p><strong>Deadline:</strong> {competition.deadline}</p>
                  <p><strong>Team Size:</strong> {competition.teamSize}</p>
                  <p className={styles.description}>{competition.description}</p>
                  
                  {(competition.registrationStartDate || competition.registrationEndDate) && (
                    <div style={{marginTop: '10px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.9rem'}}>
                      {competition.registrationStartDate && (
                        <p style={{margin: '4px 0'}}><strong>Reg. Start:</strong> {new Date(competition.registrationStartDate).toLocaleString()}</p>
                      )}
                      {competition.registrationEndDate && (
                        <p style={{margin: '4px 0'}}><strong>Reg. End:</strong> {new Date(competition.registrationEndDate).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                  
                  {competition.customFields.length > 0 && (
                    <p><strong>Custom Fields:</strong> {competition.customFields.length}</p>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(competition)}
                    className={styles.btnEdit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(competition._id)}
                    className={styles.btnDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
