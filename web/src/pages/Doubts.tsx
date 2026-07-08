import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, X, Search, User, MessageSquare, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Doubts = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const isTeacher = user?.role === 'TEACHER';
  
  const [activeTab, setActiveTab] = useState(isStudent ? 'MY_DOUBTS' : 'ALL_DOUBTS'); // MY_DOUBTS, ALL_DOUBTS
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null); // For replying
  
  // Forms
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: '', content: '', isUrgent: false });
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchDoubts();
  }, [activeTab]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/doubts');
      let data = res.data;
      if (isStudent && activeTab === 'MY_DOUBTS') {
        data = data.filter((d: any) => d.student?.userId === user?.id);
      }
      setDoubts(data);
    } catch (err) {
      console.error('Failed to fetch doubts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/doubts', formData);
      setIsModalOpen(false);
      setFormData({ subject: '', content: '', isUrgent: false });
      
      if (activeTab === 'MY_DOUBTS') {
        fetchDoubts();
      } else {
        setActiveTab('MY_DOUBTS');
      }
    } catch (err: any) {
      alert('Failed to submit doubt: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubt || !replyContent.trim()) return;
    
    setSubmitting(true);
    try {
      await apiClient.post(`/doubts/${selectedDoubt.id}/reply`, { content: replyContent });
      setReplyContent('');
      fetchDoubts();
      // Re-fetch the selected doubt to update the replies in the modal
      const updatedRes = await apiClient.get('/doubts');
      const updated = updatedRes.data.find((d: any) => d.id === selectedDoubt.id);
      setSelectedDoubt(updated);
    } catch (err: any) {
      alert('Failed to post reply: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkResolved = async (id: string) => {
    try {
      await apiClient.put(`/doubts/${id}/resolve`);
      fetchDoubts();
      if (selectedDoubt && selectedDoubt.id === id) {
        setSelectedDoubt({ ...selectedDoubt, isResolved: true });
      }
    } catch (err) {
      alert('Failed to mark as resolved');
    }
  };

  const filteredDoubts = doubts.filter(d => 
    d.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <HelpCircle size={28} color="var(--brand-500)" /> Doubt Clearing
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Ask questions and get answers from teachers</p>
        </div>
        {isStudent && (
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Ask a Doubt
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isStudent && (
            <button
              onClick={() => setActiveTab('MY_DOUBTS')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'MY_DOUBTS' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'MY_DOUBTS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              My Doubts
            </button>
          )}
          <button
            onClick={() => setActiveTab('ALL_DOUBTS')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'ALL_DOUBTS' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'ALL_DOUBTS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            {isTeacher ? 'Student Doubts' : 'Community Doubts'}
          </button>
        </div>
        
        <div className="search-bar" style={{ width: '250px' }}>
          <Search size={18} className="search-icon" style={{ left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search subject or content..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading doubts...</div>
      ) : filteredDoubts.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-500)' }}>
          <MessageSquare size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-600)' }}>No doubts found</h3>
          <p style={{ margin: 0 }}>Looks like everything is clear!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredDoubts.map(doubt => (
            <div key={doubt.id} className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                  {doubt.subject}
                </span>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  {doubt.isUrgent && (
                    <span style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={10} /> Urgent
                    </span>
                  )}
                  {doubt.isResolved ? (
                    <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={10} /> Resolved
                    </span>
                  ) : (
                    <span style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> Pending
                    </span>
                  )}
                </div>
              </div>
              
              <p style={{ fontSize: '15px', color: 'var(--text-900)', margin: '0 0 16px', lineHeight: 1.5, flex: 1, whiteSpace: 'pre-wrap' }}>
                {doubt.content}
              </p>
              
              <div style={{ borderTop: '1px solid var(--surface-200)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-500)' }}>
                  <User size={12} />
                  {doubt.student?.user?.profile?.firstName} {doubt.student?.user?.profile?.lastName}
                </div>
                <button 
                  onClick={() => setSelectedDoubt(doubt)}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-600)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '4px 8px' }}
                >
                  {doubt.replies?.length || 0} Replies &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Doubt Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Ask a Doubt</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateDoubt}>
              <div className="form-group">
                <label>Subject</label>
                <select 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-300)' }}
                >
                  <option value="">Select Subject...</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Question Details</label>
                <textarea 
                  rows={5}
                  placeholder="Type your question here. Be as specific as possible..." 
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-300)', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: 'var(--text-700)' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isUrgent}
                    onChange={e => setFormData({...formData, isUrgent: e.target.checked})}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--danger-500)' }}
                  />
                  Mark as Urgent
                </label>
                <p style={{ margin: '4px 0 0 26px', fontSize: '12px', color: 'var(--text-400)' }}>
                  Use this only for upcoming exams or blocking issues.
                </p>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Doubt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doubt Thread Modal */}
      {selectedDoubt && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--surface-200)' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
                  Thread: {selectedDoubt.subject}
                  {selectedDoubt.isResolved && (
                    <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>RESOLVED</span>
                  )}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>
                  Asked by {selectedDoubt.student?.user?.profile?.firstName} {selectedDoubt.student?.user?.profile?.lastName} on {new Date(selectedDoubt.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedDoubt(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#fafafa' }}>
              {/* Original Question */}
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--surface-200)' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-900)' }}>
                  {selectedDoubt.content}
                </p>
              </div>

              {/* Replies */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedDoubt.replies?.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-400)', padding: '20px' }}>
                    No replies yet.
                  </div>
                ) : (
                  selectedDoubt.replies?.map((reply: any) => {
                    const isTeacherReply = reply.author?.role === 'TEACHER';
                    return (
                      <div key={reply.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: isTeacherReply ? 'var(--brand-100)' : 'var(--surface-200)',
                          color: isTeacherReply ? 'var(--brand-700)' : 'var(--text-600)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px'
                        }}>
                          {reply.author?.profile?.firstName?.[0] || 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-800)' }}>
                              {reply.author?.profile?.firstName} {reply.author?.profile?.lastName}
                            </span>
                            {isTeacherReply && (
                              <span style={{ backgroundColor: 'var(--brand-500)', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>TEACHER</span>
                            )}
                            <span style={{ fontSize: '11px', color: 'var(--text-400)' }}>
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div style={{ backgroundColor: isTeacherReply ? 'var(--brand-50)' : 'white', padding: '12px 16px', borderRadius: '12px', border: isTeacherReply ? '1px solid var(--brand-100)' : '1px solid var(--surface-200)', color: 'var(--text-800)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Reply Input Area */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--surface-200)', backgroundColor: 'white' }}>
              {!selectedDoubt.isResolved && (
                <form onSubmit={handleReply} style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Type your reply..." 
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--surface-300)', outline: 'none' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!replyContent.trim() || submitting}
                    style={{ 
                      width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                      backgroundColor: replyContent.trim() ? 'var(--brand-500)' : 'var(--surface-300)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: replyContent.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Send size={18} style={{ marginLeft: '2px' }} />
                  </button>
                </form>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: selectedDoubt.isResolved ? '0' : '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-500)' }}>
                  {selectedDoubt.isResolved ? 'This thread has been resolved and closed.' : 'Teachers and students can reply to this thread.'}
                </span>
                
                {!selectedDoubt.isResolved && (isTeacher || (isStudent && selectedDoubt.student?.userId === user?.id)) && (
                  <button 
                    onClick={() => handleMarkResolved(selectedDoubt.id)}
                    style={{ background: 'var(--success-50)', color: 'var(--success-700)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
