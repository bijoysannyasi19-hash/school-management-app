import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { apiClient } from '../api/client';
import { Modal } from '../components/Modal';
import './DataTable.css';

export const Teachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{ email: string, password: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    qualification: ''
  });

  const fetchTeachers = async () => {
    try {
      const res = await apiClient.get('/teachers');
      setTeachers(res.data);
    } catch (e) {
      console.error('Failed to fetch teachers', e);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/teachers', formData);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', employeeId: '', qualification: '' });
      fetchTeachers(); // Refresh table
      
      if (res.data.generatedPassword) {
        setGeneratedCreds({ email: res.data.user.email, password: res.data.generatedPassword });
      }
    } catch (e) {
      console.error('Failed to add teacher', e);
      alert('Failed to add teacher. Ensure email is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-container glass">
        <div className="table-header-actions">
          <h2>All Teachers</h2>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Add Teacher
          </button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Employee ID</th>
              <th>Qualification</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar">{teacher.user?.profile?.firstName?.[0] || 'T'}</div>
                    <div>
                      <div className="user-name">{teacher.user?.profile?.firstName} {teacher.user?.profile?.lastName}</div>
                      <div className="user-email">{teacher.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td>{teacher.employeeId}</td>
                <td>{teacher.qualification || '-'}</td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '32px' }}>No teachers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Teacher">
        <form onSubmit={handleAddTeacher}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Jane" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@school.com" />
          </div>
          <div className="form-group">
            <label>Employee ID</label>
            <input required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} placeholder="EMP202611" />
          </div>
          <div className="form-group">
            <label>Qualification</label>
            <input value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="M.Ed, PhD" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Teacher'}
          </button>
        </form>
      </Modal>

      {generatedCreds && (
        <Modal isOpen={true} onClose={() => setGeneratedCreds(null)} title="Teacher Credentials Generated">
          <div style={{ padding: '16px', backgroundColor: 'var(--success-50)', borderRadius: '12px', border: '1px solid var(--success-200)', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 16px', color: 'var(--success-700)' }}>
              Successfully created teacher! Please securely share these credentials with the teacher. They can use these to log into the mobile app or web portal.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-600)' }}>Login Email:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-900)' }}>{generatedCreds.email}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-600)' }}>Password:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-600)', fontFamily: 'monospace', fontSize: '18px', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--surface-200)' }}>
                  {generatedCreds.password}
                </span>
                <button 
                  onClick={() => { navigator.clipboard.writeText(generatedCreds.password); alert('Copied!'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-500)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          <button className="primary-btn" onClick={() => setGeneratedCreds(null)} style={{ width: '100%' }}>Done</button>
        </Modal>
      )}
    </div>
  );
};
