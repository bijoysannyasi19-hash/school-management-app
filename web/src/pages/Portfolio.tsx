import React, { useState, useEffect } from 'react';
import { Award, Briefcase, Trophy, Star, BookOpen, Clock, Medal, CheckCircle2, Search } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Portfolio = () => {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // For teachers/admins to select a student
  const isStaff = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL' || user?.role === 'TEACHER';
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  useEffect(() => {
    if (isStaff) {
      fetchStudents();
    } else {
      fetchMyPortfolio();
    }
  }, [isStaff]);

  useEffect(() => {
    if (isStaff && selectedStudentId) {
      fetchStudentPortfolio(selectedStudentId);
    }
  }, [selectedStudentId, isStaff]);

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get('/students');
      setStudents(res.data);
      if (res.data.length > 0) {
        setSelectedStudentId(res.data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch students', err);
      setLoading(false);
    }
  };

  const fetchMyPortfolio = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/portfolio/my');
      setPortfolioData(res.data);
    } catch (err) {
      console.error('Failed to fetch portfolio', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPortfolio = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/portfolio/student/${id}`);
      setPortfolioData(res.data);
    } catch (err) {
      console.error('Failed to fetch student portfolio', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !portfolioData) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading portfolio...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Briefcase size={28} color="var(--brand-500)" /> Student Portfolio
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Achievements, badges, and academic journey</p>
        </div>
        
        {isStaff && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-600)', fontWeight: 500 }}>Select Student:</span>
            <select 
              value={selectedStudentId} 
              onChange={e => setSelectedStudentId(e.target.value)}
              style={{ 
                padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--surface-300)', 
                backgroundColor: 'white', minWidth: '200px', outline: 'none'
              }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.user.profile?.firstName} {s.user.profile?.lastName} ({s.admissionNo})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!portfolioData ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', background: 'var(--surface-100)', borderRadius: '12px' }}>
          No portfolio data found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Header Card */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)',
              fontSize: '32px', fontWeight: 700
            }}>
              {portfolioData.studentInfo?.profile?.firstName?.[0] || 'S'}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, color: 'var(--text-900)' }}>
                {portfolioData.studentInfo?.profile?.firstName} {portfolioData.studentInfo?.profile?.lastName}
              </h3>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-500)', fontSize: '14px' }}>
                <span>Admission No: <strong>{portfolioData.admissionNo}</strong></span>
                <span>Email: <strong>{portfolioData.studentInfo?.email}</strong></span>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', padding: '16px', backgroundColor: 'var(--surface-50)', borderRadius: '12px', minWidth: '150px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-500)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <Star size={14} color="var(--brand-500)" /> Total Points
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-600)' }}>
                {portfolioData.totalRewardPoints}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Achievements */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>
                <Trophy size={20} color="var(--brand-500)" /> Achievements
              </h3>
              {(!portfolioData.achievements || portfolioData.achievements.length === 0) ? (
                <p style={{ color: 'var(--text-500)', fontStyle: 'italic', margin: 0 }}>No achievements yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {portfolioData.achievements.map((ach: any) => (
                    <div key={ach.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ padding: '8px', backgroundColor: 'var(--surface-100)', borderRadius: '8px', color: 'var(--brand-500)' }}>
                        <Medal size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--text-800)' }}>{ach.title}</h4>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-600)' }}>{ach.description}</p>
                        <span style={{ fontSize: '12px', color: 'var(--text-400)' }}>{new Date(ach.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>
                <Award size={20} color="var(--brand-500)" /> Badges
              </h3>
              {(!portfolioData.badges || portfolioData.badges.length === 0) ? (
                <p style={{ color: 'var(--text-500)', fontStyle: 'italic', margin: 0 }}>No badges yet.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {portfolioData.badges.map((badge: any) => (
                    <div key={badge.id} style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      padding: '16px', backgroundColor: 'var(--surface-50)', borderRadius: '12px', border: '1px solid var(--surface-200)', minWidth: '100px'
                    }}>
                      <div style={{ color: 'var(--brand-500)' }}><Award size={32} /></div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-700)', textAlign: 'center' }}>{badge.badgeName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* Recent Diary Remarks */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>
              <BookOpen size={20} color="var(--brand-500)" /> Recent Diary Remarks
            </h3>
            {(!portfolioData.recentDiaryRemarks || portfolioData.recentDiaryRemarks.length === 0) ? (
              <p style={{ color: 'var(--text-500)', fontStyle: 'italic', margin: 0 }}>No diary remarks found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {portfolioData.recentDiaryRemarks.map((entry: any) => (
                  <div key={entry.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
                    <div style={{ 
                      minWidth: '60px', textAlign: 'center', padding: '8px', backgroundColor: 'var(--surface-50)', 
                      borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-500)'
                    }}>
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--text-800)' }}>{entry.title}</h4>
                      <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-600)', lineHeight: '1.5' }}>{entry.content}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--brand-600)', fontWeight: 500 }}>
                        <CheckCircle2 size={14} /> Teacher Remark
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};
