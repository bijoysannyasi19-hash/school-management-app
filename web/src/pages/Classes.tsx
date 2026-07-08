import React, { useState, useEffect } from 'react';
import { Presentation, Plus, X, UserPlus, Users, GraduationCap } from 'lucide-react';
import { apiClient } from '../api/client';
import './Dashboard.css';

export const Classes = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [classData, setClassData] = useState({ name: '', section: '', teacherId: '' });
  const [assignData, setAssignData] = useState({ classId: '', studentId: '', academicYear: '2026-2027' });
  const [subjectData, setSubjectData] = useState({ classId: '', name: '', code: '', teacherId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, teachersRes, studentsRes] = await Promise.all([
        apiClient.get('/classes'),
        apiClient.get('/teachers'),
        apiClient.get('/students')
      ]);
      setClasses(classesRes.data);
      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);
    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/classes', classData);
      setIsClassModalOpen(false);
      setClassData({ name: '', section: '', teacherId: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add class: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(`/classes/${assignData.classId}/assign-student`, {
        studentId: assignData.studentId,
        academicYear: assignData.academicYear
      });
      setIsAssignModalOpen(false);
      setAssignData({ classId: '', studentId: '', academicYear: '2026-2027' });
      fetchData();
    } catch (err: any) {
      alert('Failed to assign student: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(`/classes/${subjectData.classId}/subjects`, {
        name: subjectData.name,
        code: subjectData.code,
        teacherId: subjectData.teacherId || undefined
      });
      setIsSubjectModalOpen(false);
      setSubjectData({ classId: '', name: '', code: '', teacherId: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add subject: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to safely get teacher name
  const getTeacherName = (teacher: any) => {
    if (!teacher || !teacher.user || !teacher.user.profile) return 'Not Assigned';
    return `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Presentation size={28} color="var(--brand-500)" /> Classes & Academics
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => setIsClassModalOpen(true)}>
            <Plus size={18} /> Create Class
          </button>
          <button className="secondary-btn" onClick={() => setIsSubjectModalOpen(true)}>
            <Plus size={18} /> Add Subject
          </button>
          <button className="primary-btn" onClick={() => setIsAssignModalOpen(true)}>
            <UserPlus size={18} /> Enroll Student
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading classes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {classes.map((cls) => (
            <div key={cls.id} className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    Class {cls.name} <span style={{ color: 'var(--text-400)', fontSize: '18px' }}>•</span> {cls.section}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-600)' }}>
                    <Users size={16} color="var(--brand-500)" /> 
                    Class Teacher: <span style={{ fontWeight: 600 }}>{getTeacherName(cls.classTeacher)}</span>
                  </div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--brand-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700 }}>{cls.students?.length || 0}</span>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Students</span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--surface-200)', paddingTop: '16px', marginTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enrolled Students (Preview)</h4>
                {cls.students && cls.students.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cls.students.slice(0, 3).map((s: any) => (
                      <div key={s.studentId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: 'var(--surface-100)', borderRadius: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'white', color: 'var(--text-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                          <GraduationCap size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-800)' }}>
                            {s.student?.user?.profile?.firstName || 'Unknown'} {s.student?.user?.profile?.lastName || ''}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{s.student?.admissionNo}</div>
                        </div>
                      </div>
                    ))}
                    {cls.students.length > 3 && (
                      <div style={{ fontSize: '12px', color: 'var(--brand-600)', textAlign: 'center', marginTop: '4px', cursor: 'pointer', fontWeight: 600 }}>
                        + {cls.students.length - 3} more students
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-400)', fontStyle: 'italic' }}>No students enrolled in this class.</p>
                )}
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: 'var(--surface-100)', borderRadius: '16px' }}>
              <Presentation size={48} color="var(--surface-400)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-600)', marginBottom: '8px' }}>No Classes Configured</h3>
              <p style={{ color: 'var(--text-500)' }}>Get started by creating your first class structure.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Class Modal */}
      {isClassModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Create New Class</h3>
              <button className="close-btn" onClick={() => setIsClassModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddClass}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Class/Grade</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10" 
                    value={classData.name}
                    onChange={e => setClassData({...classData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A" 
                    value={classData.section}
                    onChange={e => setClassData({...classData, section: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Class Teacher (Optional)</label>
                <select 
                  value={classData.teacherId}
                  onChange={e => setClassData({...classData, teacherId: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- Unassigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.user?.profile?.firstName || 'Unknown'} {t.user?.profile?.lastName || ''} ({t.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsClassModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting || !classData.name || !classData.section}>
                  {submitting ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {isAssignModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Enroll Student in Class</h3>
              <button className="close-btn" onClick={() => setIsAssignModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAssignStudent}>
              <div className="form-group">
                <label>Select Student</label>
                <select 
                  value={assignData.studentId}
                  onChange={e => setAssignData({...assignData, studentId: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- Choose a student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.user?.profile?.firstName || 'Unknown'} {s.user?.profile?.lastName || ''} ({s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Class</label>
                <select 
                  value={assignData.classId}
                  onChange={e => setAssignData({...assignData, classId: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- Choose a class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>Class {c.name} - Sec {c.section}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input 
                  type="text" 
                  value={assignData.academicYear}
                  onChange={e => setAssignData({...assignData, academicYear: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting || !assignData.studentId || !assignData.classId}>
                  {submitting ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Subject Modal */}
      {isSubjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add Subject to Class</h3>
              <button className="close-btn" onClick={() => setIsSubjectModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Select Class</label>
                <select 
                  value={subjectData.classId}
                  onChange={e => setSubjectData({...subjectData, classId: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- Choose a class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>Class {c.name} - Sec {c.section}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Physics" 
                  value={subjectData.name}
                  onChange={e => setSubjectData({...subjectData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. PHY" 
                  value={subjectData.code}
                  onChange={e => setSubjectData({...subjectData, code: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Teacher (Optional)</label>
                <select 
                  value={subjectData.teacherId}
                  onChange={e => setSubjectData({...subjectData, teacherId: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- Unassigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.user?.profile?.firstName || 'Unknown'} {t.user?.profile?.lastName || ''} ({t.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsSubjectModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting || !subjectData.classId || !subjectData.name || !subjectData.code}>
                  {submitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
