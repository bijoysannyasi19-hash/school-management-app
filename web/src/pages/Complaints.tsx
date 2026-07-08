import React, { useState, useEffect } from 'react';
import { LifeBuoy, Plus, X, AlertCircle, Clock, CheckCircle, Search, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Complaints = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  
  const [activeTab, setActiveTab] = useState(isAdmin ? 'ALL' : 'MY'); // 'ALL' or 'MY'
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isAnonymous: false
  });

  useEffect(() => {
    fetchComplaints();
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'ALL' ? '/complaints/all' : '/complaints/my';
      const res = await apiClient.get(endpoint);
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/complaints', formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', isAnonymous: false });
      
      if (activeTab === 'MY') {
        fetchComplaints();
      } else {
        setActiveTab('MY');
      }
    } catch (err: any) {
      alert('Failed to submit complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'OPEN':
        return <span style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> Open</span>;
      case 'IN_PROGRESS':
        return <span style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> In Progress</span>;
      case 'RESOLVED':
        return <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Resolved</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <LifeBuoy size={28} color="var(--brand-500)" /> Helpdesk & Complaints
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Submit and track issues across the school</p>
        </div>
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Ticket
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('MY')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'MY' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'MY' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            My Tickets
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('ALL')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'ALL' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'ALL' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              All Tickets (Admin)
            </button>
          )}
        </div>
        
        <div className="search-bar" style={{ width: '250px' }}>
          <Search size={18} className="search-icon" style={{ left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading tickets...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-500)' }}>
          <LifeBuoy size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-600)' }}>No tickets found</h3>
          <p style={{ margin: 0 }}>You haven't submitted any complaints yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredComplaints.map(complaint => (
            <div key={complaint.id} className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                {getStatusBadge(complaint.status)}
                <span style={{ fontSize: '12px', color: 'var(--text-400)', fontFamily: 'monospace' }}>
                  #{complaint.id.slice(0, 6).toUpperCase()}
                </span>
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 8px', lineHeight: 1.4 }}>
                {complaint.title}
              </h3>
              
              <p style={{ fontSize: '14px', color: 'var(--text-600)', margin: '0 0 16px', lineHeight: 1.5, flex: 1 }}>
                {complaint.description}
              </p>
              
              <div style={{ borderTop: '1px solid var(--surface-200)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-500)' }}>
                  <User size={12} />
                  {complaint.author ? `${complaint.author.profile?.firstName} ${complaint.author.profile?.lastName}` : 'Anonymous'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-400)' }}>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {isAdmin && activeTab === 'ALL' && complaint.status !== 'RESOLVED' && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  {complaint.status === 'OPEN' && (
                    <button 
                      onClick={() => handleUpdateStatus(complaint.id, 'IN_PROGRESS')}
                      style={{ flex: 1, padding: '8px', background: 'var(--warning-100)', color: 'var(--warning-700)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                    >
                      Start Progress
                    </button>
                  )}
                  <button 
                    onClick={() => handleUpdateStatus(complaint.id, 'RESOLVED')}
                    style={{ flex: 1, padding: '8px', background: 'var(--success-100)', color: 'var(--success-700)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Submit a Ticket</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateComplaint}>
              <div className="form-group">
                <label>Title / Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g., Broken AC in Room 101" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Detailed Description</label>
                <textarea 
                  rows={4}
                  placeholder="Please describe the issue in detail..." 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-300)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: 'var(--text-700)' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isAnonymous}
                    onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-500)' }}
                  />
                  Submit Anonymously
                </label>
                <p style={{ margin: '4px 0 0 26px', fontSize: '12px', color: 'var(--text-400)' }}>
                  If checked, your name will not be visible to administrators.
                </p>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
