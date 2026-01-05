'use client';

import { useState, useEffect } from 'react';
import styles from './registrations.module.css';

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  competition: string;
  competitionId: string;
  whyJoin: string;
  expectations: string;
  customFields: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

interface Competition {
  _id: string;
  name: string;
  customFields: CustomField[];
}

interface CustomField {
  id: string;
  label: string;
  type: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchCompetitions();
  }, [selectedCompetition, selectedStatus]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      let url = '/api/registrations';
      const params = new URLSearchParams();
      
      if (selectedCompetition !== 'all') {
        params.append('competitionId', selectedCompetition);
      }
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setRegistrations(result.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions');
      const result = await response.json();
      
      if (result.success) {
        setCompetitions(result.data);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchRegistrations();
        if (selectedRegistration?._id === registrationId) {
          setSelectedRegistration({ ...selectedRegistration, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRegistrations();
        setShowDetails(false);
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const viewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowDetails(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return styles.statusApproved;
      case 'rejected': return styles.statusRejected;
      default: return styles.statusPending;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Competition Registrations</h1>
          <p className={styles.subtitle}>View and manage student registrations</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{registrations.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {registrations.filter(r => r.status === 'pending').length}
            </span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {registrations.filter(r => r.status === 'approved').length}
            </span>
            <span className={styles.statLabel}>Approved</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Competition</label>
          <select value={selectedCompetition} onChange={(e) => setSelectedCompetition(e.target.value)}>
            <option value="all">All Competitions</option>
            {competitions.map((comp) => (
              <option key={comp._id} value={comp._id}>{comp.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button onClick={fetchRegistrations} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className={styles.empty}>
          <p>No registrations found</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Competition</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id}>
                  <td className={styles.nameCell}>{reg.fullName}</td>
                  <td>{reg.email}</td>
                  <td>{reg.phone}</td>
                  <td className={styles.competitionCell}>{reg.competition}</td>
                  <td className={styles.dateCell}>{formatDate(reg.submittedAt)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => viewDetails(reg)} className={styles.viewBtn}>
                      👁️ View
                    </button>
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={() => handleDelete(reg._id)} className={styles.deleteBtn}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRegistration && (
        <div className={styles.modal} onClick={() => setShowDetails(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Registration Details</h2>
              <button onClick={() => setShowDetails(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>Personal Information</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Full Name</label>
                    <p>{selectedRegistration.fullName}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Email</label>
                    <p>{selectedRegistration.email}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Phone</label>
                    <p>{selectedRegistration.phone}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Competition</label>
                    <p>{selectedRegistration.competition}</p>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>Motivation</h3>
                <div className={styles.detailItem}>
                  <label>Why join this competition?</label>
                  <p>{selectedRegistration.whyJoin}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Expectations from Team RAW</label>
                  <p>{selectedRegistration.expectations || 'Not provided'}</p>
                </div>
              </div>

              {Object.keys(selectedRegistration.customFields).length > 0 && (
                <div className={styles.detailSection}>
                  <h3>Additional Information</h3>
                  <div className={styles.detailGrid}>
                    {Object.entries(selectedRegistration.customFields).map(([key, value]) => (
                      <div key={key} className={styles.detailItem}>
                        <label>{key}</label>
                        <p>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.detailSection}>
                <h3>Submission Details</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Submitted At</label>
                    <p>{formatDate(selectedRegistration.submittedAt)}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Status</label>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedRegistration.status)}`}>
                      {selectedRegistration.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <select
                value={selectedRegistration.status}
                onChange={(e) => handleStatusChange(selectedRegistration._id, e.target.value)}
                className={styles.statusSelectLarge}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => handleDelete(selectedRegistration._id)} className={styles.deleteBtnLarge}>
                Delete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
