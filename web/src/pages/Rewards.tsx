import React, { useEffect, useState } from 'react';
import { Trophy, Star, Medal } from 'lucide-react';
import { apiClient } from '../api/client';
import { Modal } from '../components/Modal';
import './DataTable.css';

export const Rewards = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form States
  const [pointsData, setPointsData] = useState({ points: '', reason: '' });
  const [badgeData, setBadgeData] = useState({ name: 'Star Student', iconUrl: 'star' });

  const fetchData = async () => {
    try {
      const [stuRes, leadRes] = await Promise.all([
        apiClient.get('/students'),
        apiClient.get('/gamification/leaderboard')
      ]);
      setStudents(stuRes.data);
      setLeaderboard(leadRes.data);
    } catch (e) {
      console.error('Failed to fetch gamification data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/gamification/points', {
        studentId: selectedStudent.id,
        points: parseInt(pointsData.points),
        reason: pointsData.reason
      });
      setIsPointsModalOpen(false);
      setPointsData({ points: '', reason: '' });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to award points');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/gamification/badge', {
        studentId: selectedStudent.id,
        name: badgeData.name,
        iconUrl: badgeData.iconUrl
      });
      setIsBadgeModalOpen(false);
      setBadgeData({ name: 'Star Student', iconUrl: 'star' });
      alert(`Successfully awarded ${badgeData.name} badge!`);
    } catch (e) {
      console.error(e);
      alert('Failed to award badge');
    } finally {
      setLoading(false);
    }
  };

  const openPointsModal = (student: any) => {
    setSelectedStudent(student);
    setIsPointsModalOpen(true);
  };

  const openBadgeModal = (student: any) => {
    setSelectedStudent(student);
    setIsBadgeModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div className="table-container glass">
          <div className="table-header-actions">
            <h2>Student Roster</h2>
            <p style={{ color: 'var(--text-500)', fontSize: '0.875rem' }}>Select a student to award them points or badges.</p>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="user-name">
                      {student.user?.profile?.firstName} {student.user?.profile?.lastName}
                    </div>
                  </td>
                  <td>{student.admissionNo}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openPointsModal(student)} style={{ padding: '6px 12px', background: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} /> Points
                      </button>
                      <button onClick={() => openBadgeModal(student)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Medal size={14} /> Badge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container glass" style={{ height: 'fit-content' }}>
          <div className="table-header-actions" style={{ padding: '16px', background: 'var(--primary-50)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', margin: 0 }}>
              <Trophy size={20} /> Leaderboard Top 10
            </h3>
          </div>
          <div style={{ padding: '16px' }}>
            {leaderboard.map((entry, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--surface-200)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: index === 0 ? '#eab308' : 'var(--text-500)' }}>#{index + 1}</span>
                  <span style={{ fontWeight: '500' }}>{entry.student?.user?.profile?.firstName} {entry.student?.user?.profile?.lastName}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-600)' }}>{entry.totalPoints} pts</span>
              </div>
            ))}
            {leaderboard.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-400)' }}>No points awarded yet.</p>}
          </div>
        </div>
      </div>

      <Modal isOpen={isPointsModalOpen} onClose={() => setIsPointsModalOpen(false)} title={`Award Points to ${selectedStudent?.user?.profile?.firstName}`}>
        <form onSubmit={handleAwardPoints}>
          <div className="form-group">
            <label>Points to Award</label>
            <input required type="number" value={pointsData.points} onChange={e => setPointsData({...pointsData, points: e.target.value})} placeholder="e.g., 50" />
          </div>
          <div className="form-group">
            <label>Reason / Description</label>
            <input required value={pointsData.reason} onChange={e => setPointsData({...pointsData, reason: e.target.value})} placeholder="e.g., Excellent Science Project" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading} style={{ background: '#eab308' }}>
            {loading ? 'Awarding...' : 'Give Points'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title={`Award Badge to ${selectedStudent?.user?.profile?.firstName}`}>
        <form onSubmit={handleAwardBadge}>
          <div className="form-group">
            <label>Select Badge</label>
            <select 
              required 
              value={badgeData.name} 
              onChange={e => {
                const name = e.target.value;
                const icon = name === 'Star Student' ? 'star' : name === 'Sports Captain' ? 'run' : 'medal';
                setBadgeData({ name, iconUrl: icon });
              }}
              style={{ padding: '10px 14px', border: '1px solid var(--surface-200)', borderRadius: 'var(--radius-md)', width: '100%' }}
            >
              <option value="Star Student">Star Student ⭐️</option>
              <option value="Sports Captain">Sports Captain 🏃</option>
              <option value="Academic Scholar">Academic Scholar 🎓</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={loading} style={{ background: '#3b82f6' }}>
            {loading ? 'Awarding...' : 'Give Badge'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
