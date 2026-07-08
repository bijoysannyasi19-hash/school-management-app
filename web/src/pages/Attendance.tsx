import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, CheckCircle, XCircle, Clock, AlertTriangle, Save } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Attendance = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Student specific state
  const [studentRecords, setStudentRecords] = useState<any[]>([]);

  useEffect(() => {
    if (isTeacher) {
      fetchClasses();
    } else if (user?.student?.id) {
      fetchStudentAttendance(user.student.id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass && date) {
      fetchClassAttendance(selectedClass.id, date);
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClass(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchClassAttendance = async (classId: string, targetDate: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/attendance/class/${classId}?date=${targetDate}`);
      
      // Map API response to UI state
      const mappedData = res.data.map((item: any) => {
        let status = 'PRESENT'; // default
        if (item.student.attendance && item.student.attendance.length > 0) {
          status = item.student.attendance[0].status;
        }
        
        return {
          studentId: item.student.id,
          studentName: `${item.student.user.profile.firstName} ${item.student.user.profile.lastName}`,
          admissionNo: item.student.admissionNo,
          status,
          remarks: ''
        };
      });
      
      setAttendanceData(mappedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async (studentId: string) => {
    setLoading(true);
    try {
      // Get last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const res = await apiClient.get(`/attendance/student/${studentId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      setStudentRecords(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => 
      prev.map(item => item.studentId === studentId ? { ...item, status } : item)
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const records = attendanceData.map(item => ({
        studentId: item.studentId,
        date,
        status: item.status,
        remarks: item.remarks
      }));

      await apiClient.post('/attendance/bulk-mark', { records });
      alert('Attendance saved successfully!');
    } catch (e: any) {
      alert('Failed to save attendance: ' + (e.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  if (!isTeacher) {
    // -------------------------------------------------------------
    // STUDENT VIEW
    // -------------------------------------------------------------
    const presentCount = studentRecords.filter(r => r.status === 'PRESENT').length;
    const absentCount = studentRecords.filter(r => r.status === 'ABSENT').length;
    const lateCount = studentRecords.filter(r => r.status === 'LATE').length;
    const totalDays = studentRecords.length;
    const attendancePercentage = totalDays > 0 ? ((presentCount + lateCount) / totalDays) * 100 : 0;

    return (
      <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
        <h1 style={{ margin: 0, color: 'var(--text-900)' }}>My Attendance</h1>
        <p style={{ margin: '4px 0 24px', color: 'var(--text-500)' }}>View your attendance records for the last 30 days.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="stat-card glass">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-600)' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Present</h3>
              <div className="stat-value">{presentCount}</div>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon" style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)' }}>
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Absent</h3>
              <div className="stat-value">{absentCount}</div>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)' }}>
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Late</h3>
              <div className="stat-value">{lateCount}</div>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon" style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>Percentage</h3>
              <div className="stat-value">{attendancePercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Recent Records</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-100)', color: 'var(--text-500)', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ textAlign: 'left', padding: '16px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
              ) : studentRecords.length === 0 ? (
                <tr><td colSpan={2} style={{ padding: '24px', textAlign: 'center' }}>No attendance records found.</td></tr>
              ) : (
                studentRecords.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-800)' }}>
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEACHER VIEW
  // -------------------------------------------------------------
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '24px' }}>
      {/* Sidebar: Class List */}
      <div className="glass" style={{ width: '320px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--brand-500)" />
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

      {/* Main Content: Attendance Marking */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {!selectedClass ? (
          <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-500)', borderRadius: '16px' }}>
            <Users size={64} style={{ color: 'var(--surface-300)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-800)' }}>No Class Selected</h3>
            <p style={{ margin: 0 }}>Select a class from the sidebar to mark attendance.</p>
          </div>
        ) : (
          <>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'var(--text-900)' }}>
                  Attendance for Class {selectedClass.name} - Sec {selectedClass.section}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)' }}>
                  <Calendar size={16} /> Mark daily attendance
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--surface-300)',
                    outline: 'none',
                    fontWeight: 500,
                    color: 'var(--text-700)',
                    fontFamily: 'inherit'
                  }}
                />
                <button 
                  className="primary-btn" 
                  onClick={handleSaveAttendance}
                  disabled={saving || loading || attendanceData.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>

            <div className="glass" style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading students...</div>
              ) : attendanceData.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>No students enrolled in this class.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface-50)', borderBottom: '1px solid var(--surface-200)' }}>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Student Name</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Admission No.</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-600)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((item) => (
                        <tr key={item.studentId} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                          <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--text-900)' }}>
                            {item.studentName}
                          </td>
                          <td style={{ padding: '16px 24px', color: 'var(--text-500)' }}>
                            {item.admissionNo}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                type="button"
                                onClick={() => handleStatusChange(item.studentId, 'PRESENT')}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  border: '1px solid',
                                  borderColor: item.status === 'PRESENT' ? 'var(--success-500)' : 'var(--surface-300)',
                                  backgroundColor: item.status === 'PRESENT' ? 'var(--success-50)' : 'transparent',
                                  color: item.status === 'PRESENT' ? 'var(--success-700)' : 'var(--text-600)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Present
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleStatusChange(item.studentId, 'ABSENT')}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  border: '1px solid',
                                  borderColor: item.status === 'ABSENT' ? 'var(--danger-500)' : 'var(--surface-300)',
                                  backgroundColor: item.status === 'ABSENT' ? 'var(--danger-50)' : 'transparent',
                                  color: item.status === 'ABSENT' ? 'var(--danger-700)' : 'var(--text-600)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Absent
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleStatusChange(item.studentId, 'LATE')}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  border: '1px solid',
                                  borderColor: item.status === 'LATE' ? 'var(--warning-500)' : 'var(--surface-300)',
                                  backgroundColor: item.status === 'LATE' ? 'var(--warning-50)' : 'transparent',
                                  color: item.status === 'LATE' ? 'var(--warning-700)' : 'var(--text-600)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Late
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
        )}
      </div>
    </div>
  );
};
