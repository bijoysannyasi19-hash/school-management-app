import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, X, Edit, Trash2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Subjects = () => {
  const { user } = useAuth();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', teacherId: '' });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass.id);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await apiClient.get('/teachers');
      setTeachers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubjects = async (classId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/subjects?classId=${classId}`);
      setSubjects(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({ name: '', code: '', teacherId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (subject: any) => {
    setEditingSubject(subject);
    setFormData({ 
      name: subject.name, 
      code: subject.code, 
      teacherId: subject.teacherId || '' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await apiClient.delete(`/subjects/${id}`);
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (e: any) {
      alert('Error deleting subject: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        classId: selectedClass.id,
        teacherId: formData.teacherId || undefined
      };

      if (editingSubject) {
        await apiClient.put(`/subjects/${editingSubject.id}`, payload);
      } else {
        await apiClient.post('/subjects', payload);
      }
      
      setIsModalOpen(false);
      fetchSubjects(selectedClass.id);
    } catch (e: any) {
      alert('Error saving subject: ' + (e.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      {/* Sidebar: Classes List */}
      <div className="glass" style={{ width: '280px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} style={{ color: 'var(--brand-500)' }} />
            Classes
          </h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {classes.map((cls) => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedClass?.id === cls.id ? 'var(--brand-500)' : 'var(--surface-200)',
                  backgroundColor: selectedClass?.id === cls.id ? 'var(--brand-50)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', 
                  backgroundColor: selectedClass?.id === cls.id ? 'var(--brand-500)' : 'var(--surface-200)',
                  color: selectedClass?.id === cls.id ? 'white' : 'var(--text-600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                }}>
                  {cls.name}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: selectedClass?.id === cls.id ? 'var(--brand-700)' : 'var(--text-800)', fontSize: '15px' }}>
                    Class {cls.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-500)', marginTop: '2px' }}>
                    Section {cls.section}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Subjects List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {selectedClass ? (
          <>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'var(--text-900)' }}>
                  Subjects for Class {selectedClass.name} - Sec {selectedClass.section}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)' }}>
                  <BookOpen size={16} /> Manage subjects and assignments
                </div>
              </div>
              
              <button 
                className="primary-btn" 
                onClick={openAddModal}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> New Subject
              </button>
            </div>

            <div className="glass" style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading subjects...</div>
              ) : subjects.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>No subjects found for this class.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface-50)', borderBottom: '1px solid var(--surface-200)' }}>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Subject Name</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Subject Code</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Assigned Teacher</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                          <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--text-900)' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '16px 24px', color: 'var(--text-500)' }}>
                            <span style={{ backgroundColor: 'var(--surface-100)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                              {item.code}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: 'var(--text-700)' }}>
                            {item.teacher ? `${item.teacher.user.profile.firstName} ${item.teacher.user.profile.lastName}` : <span style={{ color: 'var(--text-400)', fontStyle: 'italic' }}>Unassigned</span>}
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => openEditModal(item)}
                                style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--surface-100)', color: 'var(--text-600)', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-400)', backgroundColor: 'var(--surface-50)', borderRadius: '16px' }}>
            <FileText size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: 'var(--text-600)' }}>Subject Management</h3>
            <p style={{ margin: 0 }}>Select a class from the sidebar to manage its subjects.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>{editingSubject ? 'Edit Subject' : 'New Subject'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mathematics" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. MATH101" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assigned Teacher (Optional)</label>
                <select 
                  value={formData.teacherId}
                  onChange={e => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">-- None --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.user.profile.firstName} {t.user.profile.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
