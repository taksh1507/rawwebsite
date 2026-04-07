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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);
  const [selectedEmailAddresses, setSelectedEmailAddresses] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchRegistrations();
    fetchCompetitions();
    checkEmailConfig();
  }, [selectedCompetition, selectedStatus]);

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

  const getFieldLabel = (fieldId: string, competitionId: string): string => {
    const competition = competitions.find(c => c._id === competitionId);
    if (!competition) return fieldId;
    
    const field = competition.customFields?.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  const getAllEmailsFromRegistration = (reg: Registration): Array<{email: string, source: string}> => {
    const emails: Array<{email: string, source: string}> = [];
    
    // Add primary email
    emails.push({ email: reg.email, source: 'Primary Email' });
    
    // Add email fields from custom fields
    const competition = competitions.find(c => c._id === reg.competitionId);
    if (competition?.customFields) {
      Object.entries(reg.customFields).forEach(([fieldId, value]) => {
        const field = competition.customFields.find(f => f.id === fieldId);
        if (field?.type === 'email' && value && typeof value === 'string') {
          emails.push({ email: value, source: field.label });
        }
      });
    }
    
    return emails;
  };

  const initializeEmailSelections = () => {
    const selections: Record<string, string[]> = {};
    selectedRegistrations.forEach(regId => {
      const reg = registrations.find(r => r._id === regId);
      if (reg) {
        const allEmails = getAllEmailsFromRegistration(reg);
        // By default, select all email addresses
        selections[regId] = allEmails.map(e => e.email);
      }
    });
    setSelectedEmailAddresses(selections);
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

  const toggleSelectRegistration = (registrationId: string) => {
    setSelectedRegistrations(prev =>
      prev.includes(registrationId)
        ? prev.filter(id => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRegistrations.length === registrations.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(registrations.map(r => r._id));
    }
  };

  const openEmailModal = async () => {
    if (selectedRegistrations.length === 0) {
      alert('Please select at least one registration to send email');
      return;
    }
    
    // Check if email is configured
    try {
      const response = await fetch('/api/check-email-config');
      const result = await response.json();
      
      if (!result.configured) {
        alert('Email is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables in your admin panel settings before sending emails. See EMAIL_SETUP.md for instructions.');
        return;
      }
    } catch (error) {
      console.error('Error checking email config:', error);
    }
    
    initializeEmailSelections();
    setShowEmailModal(true);
  };

  const toggleEmailSelection = (regId: string, email: string) => {
    setSelectedEmailAddresses(prev => {
      const current = prev[regId] || [];
      const updated = current.includes(email)
        ? current.filter(e => e !== email)
        : [...current, email];
      return { ...prev, [regId]: updated };
    });
  };

  const sendEmails = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    // Collect all selected email addresses
    const totalSelectedEmails = Object.values(selectedEmailAddresses).reduce(
      (sum, emails) => sum + emails.length, 
      0
    );

    if (totalSelectedEmails === 0) {
      alert('Please select at least one email address to send to');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationIds: selectedRegistrations,
          subject: emailSubject,
          message: emailMessage,
          selectedEmails: selectedEmailAddresses,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${result.sentCount} recipient(s)`);
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailMessage('');
        setSelectedRegistrations([]);
        setSelectedEmailAddresses({});
      } else {
        alert('Failed to send emails: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Error sending emails. Please try again.');
    } finally {
      setSendingEmail(false);
    }
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

        <button 
          onClick={openEmailModal} 
          className={styles.emailBtn}
          disabled={selectedRegistrations.length === 0 || emailConfigured === false}
          title={emailConfigured === false ? 'Email not configured. Check EMAIL_SETUP.md' : ''}
        >
          📧 Send Email ({selectedRegistrations.length})
          {emailConfigured === false && <span className={styles.warningIcon}> ⚠️</span>}
        </button>
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
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.length === registrations.length && registrations.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(reg._id)}
                      onChange={() => toggleSelectRegistration(reg._id)}
                    />
                  </td>
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
                        <label>{getFieldLabel(key, selectedRegistration.competitionId)}</label>
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className={styles.modal} onClick={() => setShowEmailModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📧 Send Email to Selected Registrations</h2>
              <button onClick={() => setShowEmailModal(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.emailSection}>
                <div className={styles.recipientSelection}>
                  <h3>Select Recipients</h3>
                  <p className={styles.helpTextSmall}>
                    Choose which email addresses to send to for each registration
                  </p>
                  
                  {selectedRegistrations.map(regId => {
                    const reg = registrations.find(r => r._id === regId);
                    if (!reg) return null;
                    
                    const allEmails = getAllEmailsFromRegistration(reg);
                    const selectedEmails = selectedEmailAddresses[regId] || [];
                    
                    return (
                      <div key={regId} className={styles.recipientCard}>
                        <div className={styles.recipientHeader}>
                          <strong>{reg.fullName}</strong>
                          <span className={styles.competitionBadge}>{reg.competition}</span>
                        </div>
                        <div className={styles.emailCheckboxes}>
                          {allEmails.map(({ email, source }) => (
                            <label key={email} className={styles.emailCheckbox}>
                              <input
                                type="checkbox"
                                checked={selectedEmails.includes(email)}
                                onChange={() => toggleEmailSelection(regId, email)}
                                disabled={sendingEmail}
                              />
                              <span className={styles.emailLabel}>
                                <span className={styles.emailAddress}>{email}</span>
                                <span className={styles.emailSource}>({source})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className={styles.recipientCount}>
                  Total recipients: <strong>
                    {Object.values(selectedEmailAddresses).reduce((sum, emails) => sum + emails.length, 0)}
                  </strong>
                </p>

                <div className={styles.formGroup}>
                  <label htmlFor="emailSubject">Subject *</label>
                  <input
                    type="text"
                    id="emailSubject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className={styles.emailInput}
                    disabled={sendingEmail}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="emailMessage">Message *</label>
                  <textarea
                    id="emailMessage"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Compose your email message here..."
                    className={styles.emailTextarea}
                    rows={12}
                    disabled={sendingEmail}
                  />
                </div>

                <div className={styles.emailTemplateHints}>
                  <p><strong>Tips:</strong></p>
                  <ul>
                    <li>Be clear and professional in your communication</li>
                    <li>Include relevant competition details if applicable</li>
                    <li>Add contact information for follow-up questions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowEmailModal(false)} 
                className={styles.cancelBtn}
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button 
                onClick={sendEmails} 
                className={styles.sendEmailBtn}
                disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
              >
                {sendingEmail ? '⏳ Sending...' : '📨 Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
