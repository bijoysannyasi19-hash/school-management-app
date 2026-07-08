import React, { useState, useEffect } from 'react';
import { Award, Plus, FileText, X, CheckCircle, Download, BookOpen } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Exams = () => {
  const { user } = useAuth();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [examResults, setExamResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [newExamData, setNewExamData] = useState({ title: '', date: '', academicYear: '2023-2024' });

  // For students
  const [reportCard, setReportCard] = useState<any | null>(null);

  const isTeacher = user?.role === 'TEACHER' || user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';

  useEffect(() => {
    if (isTeacher) {
      fetchClasses();
    } else if (user?.role === 'STUDENT' && user?.student?.id) {
      fetchStudentReportCard(user.student.id, '2023-2024');
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      fetchExams(selectedClass.id);
      fetchClassDetails(selectedClass.id);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedExam) {
      fetchExamResults(selectedExam.id);
    }
  }, [selectedExam]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchClassDetails = async (classId: string) => {
    try {
      const res = await apiClient.get(`/classes/${classId}`);
      // res.data.students contains StudentClass relations
      // res.data.subjects contains Subject
      setStudents(res.data.students || []);
      setSubjects(res.data.subjects || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExams = async (classId: string) => {
    try {
      const res = await apiClient.get(`/exams/class/${classId}`);
      setExams(res.data);
      if (res.data.length > 0 && !selectedExam) {
        setSelectedExam(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExamResults = async (examId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/exams/${examId}/results`);
      const resultsMap: any = {};
      res.data.forEach((r: any) => {
        if (!resultsMap[r.studentId]) resultsMap[r.studentId] = {};
        resultsMap[r.studentId][r.subjectId] = r;
      });
      setExamResults(resultsMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await apiClient.post('/exams', { ...newExamData, classId: selectedClass.id });
      setIsNewExamModalOpen(false);
      fetchExams(selectedClass.id);
    } catch (e) {
      console.error(e);
      alert('Failed to create exam');
    }
  };

  const handleMarksChange = (studentId: string, subjectId: string, value: string) => {
    setExamResults((prev: any) => {
      const updatedStudent = prev[studentId] ? { ...prev[studentId] } : {};
      const updatedSubject = updatedStudent[subjectId] ? { ...updatedStudent[subjectId] } : { maxMarks: 100, studentId, subjectId };
      
      updatedSubject.marksObtained = value;

      return {
        ...prev,
        [studentId]: {
          ...updatedStudent,
          [subjectId]: updatedSubject
        }
      };
    });
  };

  const handleSaveResults = async () => {
    if (!selectedExam) return;
    setSaving(true);
    try {
      const flatResults: any[] = [];
      Object.keys(examResults).forEach(studentId => {
        Object.keys(examResults[studentId]).forEach(subjectId => {
          const res = examResults[studentId][subjectId];
          const val = parseFloat(res.marksObtained);
          if (res.marksObtained !== '' && res.marksObtained !== undefined && !isNaN(val)) {
            flatResults.push({
              ...res,
              marksObtained: val
            });
          }
        });
      });
      
      await apiClient.post(`/exams/${selectedExam.id}/results`, { results: flatResults });
      alert('Marks saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const fetchStudentReportCard = async (studentId: string, academicYear: string) => {
    try {
      const res = await apiClient.get(`/exams/student/${studentId}/report-card?academicYear=${academicYear}`);
      setReportCard(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getOverallGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const printReportCard = () => {
    window.print();
  };

  // -------------------------------------------------------------
  // STUDENT VIEW (REPORT CARD)
  // -------------------------------------------------------------
  if (!isTeacher) {
    if (!reportCard) return <div style={{ padding: '24px' }}>Loading your Report Card...</div>;
    
    // Group results by Exam
    const examGroups: { [key: string]: { exam: any, results: any[] } } = {};
    reportCard.results.forEach((r: any) => {
      if (!examGroups[r.exam.id]) {
        examGroups[r.exam.id] = { exam: r.exam, results: [] };
      }
      examGroups[r.exam.id].results.push(r);
    });

    return (
      <div style={{ padding: '32px', height: '100%', overflowY: 'auto', backgroundColor: '#f8fafc' }} className="print-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }} className="no-print">
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, background: 'linear-gradient(90deg, var(--brand-600), var(--brand-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Academic Report Card</h1>
            <p style={{ margin: '8px 0 0', color: 'var(--text-500)', fontSize: '16px' }}>View your academic performance across all terms.</p>
          </div>
          <button className="primary-btn" onClick={printReportCard} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', transition: 'all 0.3s ease' }}>
            <Download size={18} /> Download PDF
          </button>
        </div>

        {Object.values(examGroups).length === 0 ? (
          <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', borderRadius: '16px' }}>
            <Award size={48} style={{ color: 'var(--brand-300)', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-800)' }}>No Exam Records Found</h3>
            <p style={{ margin: 0 }}>Your report card will appear here once exams are graded.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {Object.values(examGroups).map((group: any) => {
              const totalMarks = group.results.reduce((acc: number, r: any) => acc + r.marksObtained, 0);
              const maxMarks = group.results.reduce((acc: number, r: any) => acc + r.maxMarks, 0);
              const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

              return (
                <div key={group.exam.id} className="glass animate-hover" style={{ padding: '40px', borderRadius: '24px', backgroundColor: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, var(--brand-400), var(--brand-600))' }}></div>
                  
                  <div style={{ textAlign: 'center', paddingBottom: '32px', marginBottom: '32px', borderBottom: '1px dashed var(--surface-200)' }}>
                    <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '20px', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px' }}>
                      {group.exam.academicYear}
                    </div>
                    <h1 style={{ margin: '0 0 8px', fontSize: '36px', color: 'var(--text-900)', fontWeight: 800, letterSpacing: '-1px' }}>{group.exam.title}</h1>
                    <p style={{ margin: 0, color: 'var(--text-500)', fontSize: '15px' }}>Official Academic Transcript</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-500)', fontSize: '24px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {reportCard.student.user.profile.firstName[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-500)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>Student Name</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-900)' }}>
                          {reportCard.student.user.profile.firstName} {reportCard.student.user.profile.lastName}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-500)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>Admission No.</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-600)', fontFamily: 'monospace' }}>
                        #{reportCard.student.admissionNo}
                      </div>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginBottom: '40px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0 16px 12px', color: 'var(--text-500)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Subject</th>
                        <th style={{ textAlign: 'center', padding: '0 16px 12px', color: 'var(--text-500)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Score</th>
                        <th style={{ textAlign: 'center', padding: '0 16px 12px', color: 'var(--text-500)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.results.map((r: any) => {
                        const subjectPercentage = r.maxMarks > 0 ? (r.marksObtained / r.maxMarks) * 100 : 0;
                        const isPass = subjectPercentage >= 40;
                        return (
                          <tr key={r.id} style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'transform 0.2s', borderRadius: '12px' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <td style={{ padding: '20px 24px', fontWeight: 600, color: 'var(--text-900)', fontSize: '16px', borderRadius: '12px 0 0 12px', border: '1px solid #f1f5f9', borderRight: 'none' }}>
                              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isPass ? 'var(--brand-500)' : 'var(--danger-500)' }}></div>
                                {r.subject.name}
                              </div>
                              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${subjectPercentage}%`, height: '100%', background: isPass ? 'linear-gradient(90deg, var(--brand-400), var(--brand-600))' : 'linear-gradient(90deg, #f87171, #ef4444)', transition: 'width 1s ease-out' }}></div>
                              </div>
                            </td>
                            <td style={{ padding: '20px 24px', textAlign: 'center', border: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none', verticalAlign: 'middle' }}>
                              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-900)' }}>{r.marksObtained}</span>
                              <span style={{ fontSize: '14px', color: 'var(--text-400)', margin: '0 4px' }}>/</span>
                              <span style={{ fontSize: '14px', color: 'var(--text-500)' }}>{r.maxMarks}</span>
                            </td>
                            <td style={{ padding: '20px 24px', textAlign: 'center', fontWeight: 800, fontSize: '22px', color: isPass ? 'var(--success-600)' : 'var(--danger-600)', borderRadius: '0 12px 12px 0', border: '1px solid #f1f5f9', borderLeft: 'none', verticalAlign: 'middle', backgroundColor: isPass ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
                              {getOverallGrade(subjectPercentage)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', padding: '32px', background: 'linear-gradient(135deg, var(--brand-900), var(--brand-700))', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '150px', height: '150px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: 600 }}>Total Marks</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        {totalMarks} <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/ {maxMarks}</span>
                      </div>
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 1, borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: 600 }}>Class Rank</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>
                        {reportCard.examRankings && reportCard.examRankings[group.exam.id] 
                          ? <><span style={{ color: 'var(--brand-200)' }}>#{reportCard.examRankings[group.exam.id].rank}</span> <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>/ {reportCard.examRankings[group.exam.id].totalStudents}</span></>
                          : 'N/A'
                        }
                      </div>
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: 600 }}>Overall Performance</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{percentage.toFixed(1)}%</div>
                        <div style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1, color: 'var(--brand-200)', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                          {getOverallGrade(percentage)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEACHER VIEW (GRADE INPUT)
  // -------------------------------------------------------------
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '24px' }}>
      {/* Sidebar: Class List */}
      <div className="glass" style={{ width: '320px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--brand-500)" />
            Classes & Exams
          </h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {classes.map(cls => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedClass?.id === cls.id ? 'var(--brand-50)' : 'transparent',
                  border: selectedClass?.id === cls.id ? '1px solid var(--brand-200)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: selectedClass?.id === cls.id ? 'var(--brand-500)' : 'var(--brand-100)', color: selectedClass?.id === cls.id ? 'white' : 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>Class {cls.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>Section {cls.section}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Exam Management */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {selectedClass ? (
          <>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'var(--text-900)' }}>
                  Exams for Class {selectedClass.name} - Sec {selectedClass.section}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)' }}>
                  <Award size={16} /> Manage exam results and grades
                </div>
              </div>
              
              <button 
                className="primary-btn" 
                onClick={() => setIsNewExamModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> New Exam
              </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
              <div className="glass" style={{ width: '300px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-800)' }}>Exams</h3>
                </div>
                {exams.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-500)' }}>
                    No exams found.
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exams.map(ex => (
                      <div 
                        key={ex.id}
                        onClick={() => setSelectedExam(ex)}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: selectedExam?.id === ex.id ? 'var(--brand-500)' : 'var(--surface-200)',
                          backgroundColor: selectedExam?.id === ex.id ? 'var(--brand-50)' : 'transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: selectedExam?.id === ex.id ? 'var(--brand-700)' : 'var(--text-800)' }}>
                          {ex.title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-500)', marginTop: '4px' }}>
                          {new Date(ex.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="glass" style={{ flex: 1, borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {!selectedExam ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-400)', backgroundColor: 'var(--surface-50)' }}>
                    <FileText size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: 'var(--text-600)' }}>No Exam Selected</h3>
                    <p style={{ margin: 0 }}>Select or create an exam to start entering marks.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-900)' }}>{selectedExam.title} Results</h3>
                      <button 
                        className="primary-btn" 
                        onClick={handleSaveResults}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Results'}
                      </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                      {subjects.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface-50)', borderRadius: '12px', border: '1px dashed var(--surface-300)' }}>
                          <BookOpen size={48} style={{ color: 'var(--text-400)', marginBottom: '16px' }} />
                          <h4 style={{ margin: '0 0 8px', color: 'var(--text-800)', fontSize: '18px' }}>No Subjects Found</h4>
                          <p style={{ margin: 0, color: 'var(--text-500)' }}>This class doesn't have any subjects assigned to it yet. Please go to the Subjects or Classes page to add subjects before grading.</p>
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--surface-200)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                              <tr>
                                <th style={{ position: 'sticky', left: 0, backgroundColor: 'var(--surface-50)', zIndex: 10, padding: '16px', textAlign: 'left', borderBottom: '2px solid var(--surface-200)', borderRight: '1px solid var(--surface-200)', color: 'var(--text-700)', fontWeight: 600 }}>Student Name</th>
                                {subjects.map(sub => (
                                  <th key={sub.id} style={{ padding: '16px', textAlign: 'center', borderBottom: '2px solid var(--surface-200)', color: 'var(--brand-700)', fontWeight: 600, backgroundColor: 'var(--brand-50)' }}>
                                    {sub.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {students.map(sc => (
                                <tr key={sc.student.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                                  <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 10, padding: '16px', fontWeight: 500, color: 'var(--text-900)', borderRight: '1px solid var(--surface-200)' }}>
                                    {sc.student.user?.profile?.firstName} {sc.student.user?.profile?.lastName}
                                  </td>
                                  {subjects.map(sub => (
                                    <td key={sub.id} style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid var(--surface-100)' }}>
                                      <input 
                                        type="number" 
                                        placeholder="0-100"
                                        min="0"
                                        max="100"
                                        value={examResults[sc.student.id]?.[sub.id]?.marksObtained ?? ''}
                                        onChange={e => handleMarksChange(sc.student.id, sub.id, e.target.value)}
                                        style={{ 
                                          width: '80px', 
                                          padding: '8px', 
                                          borderRadius: '6px', 
                                          border: '1px solid var(--surface-300)', 
                                          textAlign: 'center',
                                          outline: 'none',
                                          fontWeight: 600,
                                          color: 'var(--text-800)'
                                        }}
                                      />
                                    </td>
                                  ))}
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
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-400)', backgroundColor: 'var(--surface-50)' }}>
            <Award size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: 'var(--text-600)' }}>Exam Grading</h3>
            <p style={{ margin: 0 }}>Select a class to manage exams and grades</p>
          </div>
        )}
      </div>

      {/* New Exam Modal */}
      {isNewExamModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Create New Exam</h3>
              <button className="close-btn" onClick={() => setIsNewExamModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateExam}>
              <div className="form-group">
                <label>Exam Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Term 1 Finals" 
                  value={newExamData.title}
                  onChange={e => setNewExamData({...newExamData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={newExamData.date}
                  onChange={e => setNewExamData({...newExamData, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsNewExamModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Create Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
