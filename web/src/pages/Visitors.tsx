import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Plus, X, Clock, LogOut, FileText, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Visitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE, ALL
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    purpose: '',
  });

  useEffect(() => {
    fetchVisitors();
  }, [activeTab]);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'ACTIVE' ? '/visitors?activeOnly=true' : '/visitors';
      const res = await apiClient.get(url);
      setVisitors(res.data);
    } catch (e) {
      console.error('Failed to fetch visitors', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/visitors/checkin', formData);
      setIsModalOpen(false);
      setFormData({ visitorName: '', purpose: '' });
      fetchVisitors();
    } catch (err: any) {
      alert('Failed to check in visitor: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await apiClient.put(`/visitors/${id}/checkout`, {});
      // Update state locally to immediately remove or update the visitor
      if (activeTab === 'ACTIVE') {
        setVisitors(prev => prev.filter(v => v.id !== id));
      } else {
        setVisitors(prev => prev.map(v => v.id === id ? { ...v, checkOut: new Date().toISOString() } : v));
      }
    } catch (err: any) {
      alert('Failed to check out visitor: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '--';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + d.toLocaleDateString();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <ClipboardCheck size={28} color="var(--brand-500)" /> Visitor Management
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Log guests and monitor campus security</p>
        </div>
        
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Check In Visitor
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['ACTIVE', 'ALL'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === tab ? 'white' : 'var(--text-600)',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'ACTIVE' ? 'Active Visitors' : 'All History'}
          </button>
        ))}
      </div>

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>
            <ClipboardCheck size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-600)' }}>No visitors found</h3>
            <p style={{ margin: 0 }}>There are no visitor logs matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-50)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Visitor Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Purpose</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Check In Time</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Check Out Time</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(visitor => (
                  <tr key={visitor.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-900)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} />
                      </div>
                      {visitor.visitorName}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>{visitor.purpose}</td>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {formatTime(visitor.checkIn)}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>
                      {visitor.checkOut ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <LogOut size={14} /> {formatTime(visitor.checkOut)}
                        </div>
                      ) : (
                        <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'var(--success-50)', color: 'var(--success-700)', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Active</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {!visitor.checkOut && (
                        <button 
                          onClick={() => handleCheckOut(visitor.id)}
                          style={{ 
                            background: 'white', border: '1px solid var(--brand-200)', color: 'var(--brand-600)', 
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' 
                          }}
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Check In Visitor</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCheckIn}>
              <div className="form-group">
                <label>Visitor Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., John Doe" 
                  value={formData.visitorName}
                  onChange={e => setFormData({...formData, visitorName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Purpose of Visit</label>
                <input 
                  type="text" 
                  placeholder="e.g., Parent-Teacher Meeting"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Checking in...' : 'Check In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
