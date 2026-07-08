import React, { useState, useEffect } from 'react';
import { Book, Plus, X, User, MessageCircle, AlertCircle, Star } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Diary = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'REMARK',
    content: ''
  });

  useEffect(() => {
    if (isTeacher) {
      fetchClasses();
    } else if (user?.student?.id) {
      fetchEntries(user.student.id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass.id);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent) {
      fetchEntries(selectedStudent.id);
    }
  }, [selectedStudent]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClass(res.data[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const res = await apiClient.get(`/classes/${classId}/students`);
      setStudents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEntries = async (studentId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/diary/student/${studentId}`);
      setEntries(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent && isTeacher) return;
    
    setSubmitting(true);
    try {
      await apiClient.post('/diary', {
        studentId: isTeacher ? selectedStudent.id : user?.student?.id,
        type: formData.type,
        content: formData.content
      });
      setIsModalOpen(false);
      setFormData({ type: 'REMARK', content: '' });
      fetchEntries(isTeacher ? selectedStudent.id : user?.student?.id);
    } catch (err: any) {
      alert('Failed to add diary entry: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'APPRECIATION': return <Star size={18} color="var(--success-500)" />;
      case 'DISCIPLINE': return <AlertCircle size={18} color="var(--danger-500)" />;
      case 'SUGGESTION': return <MessageCircle size={18} color="var(--warning-500)" />;
      default: return <Book size={18} color="var(--brand-500)" />;
    }
  };

  if (!isTeacher) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ margin: 0, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Book size={28} color="var(--brand-500)" /> My Diary
        </h1>
        <p style={{ margin: '4px 0 24px', color: 'var(--text-500)' }}>Feedback and remarks from your teachers.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-500)' }}>Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-500)' }}>
              <Book size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
              No diary entries found.
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-800)' }}>
                    {getTypeIcon(entry.type)}
                    {entry.type}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', color: 'var(--text-700)', lineHeight: 1.5 }}>
                  {entry.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-600)', borderTop: '1px solid var(--surface-200)', paddingTop: '12px' }}>
                  <User size={14} />
                  By Teacher {entry.teacher?.user?.profile?.firstName} {entry.teacher?.user?.profile?.lastName}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '24px' }}>
      {/* Sidebar: Class & Student Selection */}
      <div className="glass" style={{ width: '320px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={20} color="var(--brand-500)" /> Student Diary
          </h3>
          <select 
            value={selectedClass?.id || ''}
            onChange={(e) => setSelectedClass(classes.find(c => c.id === e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-300)' }}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} - Sec {c.section}</option>)}
          </select>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {students.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-500)' }}>No students in this class.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {students.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedStudent?.id === s.id ? 'var(--brand-50)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedStudent?.id === s.id ? 'var(--brand-300)' : 'var(--surface-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--surface-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {s.user?.profile?.firstName?.[0] || 'S'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-800)', fontSize: '14px' }}>
                      {s.user?.profile?.firstName} {s.user?.profile?.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{s.admissionNo}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Diary Entries */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {!selectedStudent ? (
          <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-500)', borderRadius: '16px' }}>
            <User size={64} style={{ color: 'var(--surface-300)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-800)' }}>No Student Selected</h3>
            <p style={{ margin: 0 }}>Select a student from the sidebar to view or add diary entries.</p>
          </div>
        ) : (
          <>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'var(--text-900)' }}>
                  Diary: {selectedStudent.user?.profile?.firstName} {selectedStudent.user?.profile?.lastName}
                </h2>
                <div style={{ color: 'var(--text-500)', fontSize: '14px' }}>Admission No: {selectedStudent.admissionNo}</div>
              </div>
              <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> Add Remark
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading entries...</div>
              ) : entries.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-500)' }}>
                  <Book size={48} color="var(--surface-300)" style={{ margin: '0 auto 16px' }} />
                  <p>No diary entries found for this student.</p>
                </div>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-800)' }}>
                        {getTypeIcon(entry.type)}
                        {entry.type}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>
                        {new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    <p style={{ margin: '0', color: 'var(--text-700)', lineHeight: 1.5 }}>
                      {entry.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Add Diary Remark</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateEntry}>
              <div className="form-group">
                <label>Entry Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="REMARK">General Remark</option>
                  <option value="APPRECIATION">Appreciation</option>
                  <option value="DISCIPLINE">Discipline</option>
                  <option value="SUGGESTION">Suggestion / Improvement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Write your remark here..."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)', resize: 'vertical' }}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
