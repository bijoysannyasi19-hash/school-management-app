import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2, Siren, FileWarning, Plus, X } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Safety = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  
  const [activeTab, setActiveTab] = useState('ALERTS'); // ALERTS, INCIDENTS
  const [alerts, setAlerts] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [alertForm, setAlertForm] = useState({ type: 'OTHER', message: '' });
  const [incidentForm, setIncidentForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s for safety alerts
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ALERTS') {
        const res = await apiClient.get('/safety/alerts');
        setAlerts(res.data);
      } else if (activeTab === 'INCIDENTS' && isAdmin) {
        const res = await apiClient.get('/safety/incidents');
        setIncidents(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch safety data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/safety/alert', alertForm);
      setIsAlertModalOpen(false);
      setAlertForm({ type: 'OTHER', message: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to trigger alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    if (!window.confirm('Mark this emergency as resolved?')) return;
    try {
      await apiClient.put(`/safety/alert/${id}/resolve`, {});
      fetchData();
    } catch (err: any) {
      alert('Failed to resolve alert');
    }
  };

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/safety/incident', incidentForm);
      setIsIncidentModalOpen(false);
      setIncidentForm({ title: '', description: '' });
      alert('Incident reported successfully.');
      if (isAdmin) fetchData();
    } catch (err: any) {
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'MEDICAL': return <Plus color="white" />;
      case 'FIRE': return <AlertTriangle color="white" />;
      case 'LOCKDOWN': return <AlertOctagon color="white" />;
      default: return <Siren color="white" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'LOCKDOWN': return 'var(--danger-600)';
      case 'FIRE': return '#ea580c';
      case 'MEDICAL': return '#2563eb';
      default: return 'var(--warning-600)';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <ShieldAlert size={28} color="var(--danger-500)" /> Safety & Emergency
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Report incidents and monitor active alerts</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsIncidentModalOpen(true)}
            style={{ 
              background: 'white', border: '1px solid var(--surface-300)', color: 'var(--text-700)', 
              fontWeight: 600, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
            }}
          >
            <FileWarning size={18} /> Report Incident
          </button>
          <button 
            onClick={() => setIsAlertModalOpen(true)}
            style={{ 
              background: 'var(--danger-600)', border: 'none', color: 'white', 
              fontWeight: 600, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
            }}
          >
            <Siren size={18} /> Trigger Alert
          </button>
        </div>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('ALERTS')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'ALERTS' ? 'var(--danger-600)' : 'var(--surface-200)',
              color: activeTab === 'ALERTS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            Active Alerts
          </button>
          <button
            onClick={() => setActiveTab('INCIDENTS')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'INCIDENTS' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'INCIDENTS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            Incident Logs
          </button>
        </div>
      )}

      {loading && alerts.length === 0 && incidents.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading...</div>
      ) : activeTab === 'ALERTS' ? (
        <div>
          {alerts.length === 0 ? (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--success-600)', borderRadius: '16px' }}>
              <CheckCircle2 size={48} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '20px' }}>All Clear</h3>
              <p style={{ margin: 0 }}>There are no active emergency alerts.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ 
                  backgroundColor: 'white', borderLeft: `6px solid ${getAlertColor(alert.type)}`, 
                  borderRadius: '12px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '16px', backgroundColor: getAlertColor(alert.type), 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-900)' }}>{alert.type} ALERT</h3>
                      <span style={{ fontSize: '13px', color: 'var(--text-500)', fontWeight: 500 }}>
                        Reported {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px', color: 'var(--text-700)', fontSize: '16px' }}>{alert.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Reported by: <span style={{ fontWeight: 600 }}>{alert.reporter?.profile?.firstName} {alert.reporter?.profile?.lastName}</span>
                      </div>
                      {isAdmin && (
                        <button 
                          onClick={() => handleResolveAlert(alert.id)}
                          style={{ 
                            background: 'white', border: '1px solid var(--success-500)', color: 'var(--success-600)', 
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' 
                          }}
                        >
                          Resolve Alert
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {incidents.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>No incident reports found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-50)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Title</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Description</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Reported By</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>{new Date(inc.date).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', color: 'var(--text-900)', fontWeight: 600 }}>{inc.title}</td>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>{inc.description}</td>
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>
                      {inc.reporter?.profile?.firstName} {inc.reporter?.profile?.lastName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Trigger Alert Modal */}
      {isAlertModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--danger-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Siren size={20} /> Trigger Emergency Alert
              </h3>
              <button className="close-btn" onClick={() => setIsAlertModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleTriggerAlert}>
              <div className="form-group">
                <label>Emergency Type</label>
                <select 
                  value={alertForm.type}
                  onChange={e => setAlertForm({...alertForm, type: e.target.value})}
                  required
                >
                  <option value="MEDICAL">Medical Emergency</option>
                  <option value="FIRE">Fire Emergency</option>
                  <option value="LOCKDOWN">Lockdown / Security Threat</option>
                  <option value="OTHER">Other Emergency</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Message / Location</label>
                <textarea 
                  placeholder="E.g., Medical assistance needed at the cafeteria..." 
                  value={alertForm.message}
                  onChange={e => setAlertForm({...alertForm, message: e.target.value})}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsAlertModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ background: 'var(--danger-600)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} disabled={submitting}>
                  {submitting ? 'Broadcasting...' : 'Broadcast Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      {isIncidentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Report Incident</h3>
              <button className="close-btn" onClick={() => setIsIncidentModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmitIncident}>
              <div className="form-group">
                <label>Incident Title</label>
                <input 
                  type="text" 
                  placeholder="Brief summary..." 
                  value={incidentForm.title}
                  onChange={e => setIncidentForm({...incidentForm, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Describe what happened in detail..." 
                  value={incidentForm.description}
                  onChange={e => setIncidentForm({...incidentForm, description: e.target.value})}
                  required
                  rows={5}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsIncidentModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
