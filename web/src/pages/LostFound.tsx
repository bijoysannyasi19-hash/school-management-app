import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, X, MapPin, Calendar as CalendarIcon, User, CheckCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LOST, FOUND
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'LOST',
    itemName: '',
    description: '',
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'ALL' ? '/lost-found' : `/lost-found?type=${activeTab}`;
      const res = await apiClient.get(url);
      setItems(res.data);
    } catch (e) {
      console.error('Failed to fetch items', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/lost-found', formData);
      setIsModalOpen(false);
      setFormData({ type: 'LOST', itemName: '', description: '' });
      fetchItems();
    } catch (err: any) {
      alert('Failed to report item: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!window.confirm(`Are you sure you want to mark this item as ${status}?`)) return;
    try {
      await apiClient.put(`/lost-found/${id}/status`, { status });
      fetchItems();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const isStaff = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Package size={28} color="var(--brand-500)" /> Lost & Found
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Report lost items or post found items</p>
        </div>
        
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Report Item
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['ALL', 'LOST', 'FOUND'].map(tab => (
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
            {tab === 'ALL' ? 'All Items' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading items...</div>
      ) : items.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-500)' }}>
          <Package size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-600)' }}>No items found</h3>
          <p style={{ margin: 0 }}>There are currently no items in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {items.map(item => {
            const isLost = item.type === 'LOST';
            const isClaimed = item.status === 'CLAIMED' || item.status === 'RETURNED';
            
            return (
              <div key={item.id} className="glass" style={{ padding: '20px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                {isClaimed && (
                  <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'var(--success-100)', color: 'var(--success-700)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> {item.status}
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    fontWeight: 700,
                    backgroundColor: isLost ? 'var(--danger-50)' : 'var(--success-50)',
                    color: isLost ? 'var(--danger-700)' : 'var(--success-700)',
                  }}>
                    {item.type}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarIcon size={12} />
                    {new Date(item.dateReported).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 8px' }}>
                  {item.itemName}
                </h3>
                
                <p style={{ fontSize: '14px', color: 'var(--text-600)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  {item.description}
                </p>
                
                <div style={{ borderTop: '1px solid var(--surface-200)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-500)' }}>
                    <User size={14} />
                    {item.reporter?.profile?.firstName} {item.reporter?.profile?.lastName}
                  </div>
                  
                  {isStaff && !isClaimed && (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'CLAIMED')}
                      style={{ 
                        background: 'none', border: 'none', color: 'var(--brand-600)', fontWeight: 600, 
                        fontSize: '13px', cursor: 'pointer', padding: '4px 8px' 
                      }}
                    >
                      Mark Claimed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Report Item</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleReport}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Item Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="LOST" 
                      checked={formData.type === 'LOST'} 
                      onChange={e => setFormData({...formData, type: e.target.value})} 
                    />
                    I lost something
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="FOUND" 
                      checked={formData.type === 'FOUND'} 
                      onChange={e => setFormData({...formData, type: e.target.value})} 
                    />
                    I found something
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Blue Water Bottle" 
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description (color, brand, where you {formData.type === 'LOST' ? 'lost' : 'found'} it)</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)', resize: 'vertical' }}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
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
