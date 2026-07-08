import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Trash2, Clock } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
];

export const Timetable = () => {
  const { user } = useAuth();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  
  const [timetable, setTimetable] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '09:45', subjectId: '', teacherId: '' });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass.id);
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
    try {
      const res = await apiClient.get(`/subjects?classId=${classId}`);
      setSubjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTimetable = async (classId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/timetable/class/${classId}`);
      setTimetable(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = (dayId: number) => {
    setFormData({ ...formData, dayOfWeek: dayId, subjectId: '', teacherId: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this period from the timetable?')) return;
    try {
      await apiClient.delete(`/timetable/${id}`);
      setTimetable(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      alert('Error deleting period: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    setSaving(true);
    try {
      const payload = {
        classId: selectedClass.id,
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: formData.startTime,
        endTime: formData.endTime,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId || undefined
      };

      await apiClient.post('/timetable', payload);
      setIsModalOpen(false);
      fetchTimetable(selectedClass.id);
    } catch (e: any) {
      alert('Error adding period: ' + (e.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  const getPeriodsForDay = (dayId: number) => {
    return timetable.filter(t => t.dayOfWeek === dayId).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      {/* Sidebar: Classes List */}
      <div className="glass" style={{ width: '280px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--brand-500)' }} />
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

      {/* Main Content: Timetable Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {selectedClass ? (
          <>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'var(--text-900)' }}>
                  Weekly Schedule for Class {selectedClass.name} - Sec {selectedClass.section}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)' }}>
                  <Clock size={16} /> Organize periods, subjects, and teachers
                </div>
              </div>
            </div>

            <div className="glass" style={{ flex: 1, borderRadius: '16px', overflowY: 'auto', padding: '24px', backgroundColor: 'var(--surface-50)' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading timetable...</div>
              ) : (
                <div style={{ display: 'flex', gap: '16px', minWidth: 'min-content' }}>
                  {DAYS.map(day => (
                    <div key={day.id} style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ 
                        backgroundColor: 'white', 
                        padding: '16px', 
                        borderRadius: '12px', 
                        fontWeight: 600, 
                        color: 'var(--text-800)',
                        border: '1px solid var(--surface-200)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        {day.name}
                        <button 
                          onClick={() => openAddModal(day.id)}
                          style={{ padding: '4px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', cursor: 'pointer' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {getPeriodsForDay(day.id).length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-400)', border: '1px dashed var(--surface-300)', borderRadius: '12px', fontSize: '13px' }}>
                            No periods scheduled
                          </div>
                        ) : (
                          getPeriodsForDay(day.id).map(period => (
                            <div key={period.id} style={{ 
                              backgroundColor: 'white', 
                              padding: '16px', 
                              borderRadius: '12px', 
                              border: '1px solid var(--surface-200)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              position: 'relative'
                            }}>
                              <button 
                                onClick={() => handleDelete(period.id)}
                                style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: 'var(--danger-400)', cursor: 'pointer' }}
                              >
                                <X size={14} />
                              </button>
                              
                              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-600)', marginBottom: '8px' }}>
                                {period.startTime} - {period.endTime}
                              </div>
                              <div style={{ fontWeight: 600, color: 'var(--text-900)', marginBottom: '4px' }}>
                                {period.subject.name}
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--text-500)' }}>
                                {period.teacher ? `${period.teacher.user.profile.firstName} ${period.teacher.user.profile.lastName}` : 'Unassigned'}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-400)', backgroundColor: 'var(--surface-50)', borderRadius: '16px' }}>
            <Calendar size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: 'var(--text-600)' }}>Timetable Management</h3>
            <p style={{ margin: 0 }}>Select a class from the sidebar to view its schedule.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add Period - {DAYS.find(d => d.id === formData.dayOfWeek)?.name}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <input 
                    type="time" 
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>End Time</label>
                  <input 
                    type="time" 
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <select 
                  value={formData.subjectId}
                  onChange={e => {
                    const subj = subjects.find(s => s.id === e.target.value);
                    setFormData({
                      ...formData, 
                      subjectId: e.target.value,
                      teacherId: subj?.teacherId || ''
                    });
                  }}
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Teacher</label>
                <select 
                  value={formData.teacherId}
                  onChange={e => setFormData({...formData, teacherId: e.target.value})}
                  required
                >
                  <option value="">-- Select Teacher --</option>
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
                  {saving ? 'Adding...' : 'Add Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
