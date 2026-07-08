import React, { useEffect, useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { apiClient } from '../api/client';
import { Modal } from '../components/Modal';
import './DataTable.css';

export const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{ email: string, password: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    admissionNo: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get('/students');
      setStudents(res.data);
    } catch (e) {
      console.error('Failed to fetch students', e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/students', formData);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', admissionNo: '', bloodGroup: '', emergencyContact: '' });
      fetchStudents(); // Refresh table
      
      if (res.data.generatedPassword) {
        setGeneratedCreds({ email: res.data.user.email, password: res.data.generatedPassword });
      }
    } catch (e) {
      console.error('Failed to add student', e);
      alert('Failed to add student. Ensure email is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-container glass">
        <div className="table-header-actions">
          <h2>All Students</h2>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Add Student
          </button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission No.</th>
              <th>Blood Group</th>
              <th>Emergency Contact</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar">{student.user?.profile?.firstName?.[0] || 'S'}</div>
                    <div>
                      <div className="user-name">{student.user?.profile?.firstName} {student.user?.profile?.lastName}</div>
                      <div className="user-email">{student.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td>{student.admissionNo}</td>
                <td>{student.bloodGroup || '-'}</td>
                <td>{student.emergencyContact || '-'}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Alice" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Smith" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alice@school.com" />
          </div>
          <div className="form-group">
            <label>Admission Number</label>
            <input required value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo: e.target.value})} placeholder="ADM202611" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Blood Group</label>
              <input value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} placeholder="O+" />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} placeholder="+1 234 567 890" />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </Modal>

      {generatedCreds && (
        <Modal isOpen={true} onClose={() => setGeneratedCreds(null)} title="Student Credentials Generated">
          <div style={{ padding: '16px', backgroundColor: 'var(--success-50)', borderRadius: '12px', border: '1px solid var(--success-200)', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 16px', color: 'var(--success-700)' }}>
              Successfully created student! Please securely share these credentials with the student. They can use these to log into the mobile app or web portal.
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
