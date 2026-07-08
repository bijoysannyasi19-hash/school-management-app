import React, { useState, useEffect } from 'react';
import { Presentation, Plus, FileText, Send, Calendar as CalIcon, CheckCircle, X, Download, MessageSquare } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Workspace = () => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role !== 'STUDENT' && user?.role !== 'PARENT';
  const isStudent = user?.role === 'STUDENT';
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const [workspace, setWorkspace] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'STREAM' | 'CLASSWORK'>('STREAM');
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  
  // View Assignment Modal
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchWorkspace(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClassId(res.data[0].id);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  };

  const fetchWorkspace = async (classId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/workspace/class/${classId}`);
      setWorkspace(res.data);
    } catch (err) {
      // If 404, workspace doesn't exist yet
      setWorkspace(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInitWorkspace = async () => {
    setSubmitting(true);
    try {
      await apiClient.post('/workspace', { classId: selectedClassId, name: 'Digital Classroom' });
      fetchWorkspace(selectedClassId);
    } catch (err) {
      alert('Failed to initialize workspace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/workspace/${workspace.id}/post`, { content: postContent });
      setIsPostModalOpen(false);
      setPostContent('');
      fetchWorkspace(selectedClassId);
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', assignmentForm.title);
      formData.append('description', assignmentForm.description);
      formData.append('dueDate', assignmentForm.dueDate);
      if (assignmentFile) {
        formData.append('file', assignmentFile);
      }

      await apiClient.post(`/workspace/${workspace.id}/assignment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsAssignmentModalOpen(false);
      setAssignmentForm({ title: '', description: '', dueDate: '' });
      setAssignmentFile(null);
      fetchWorkspace(selectedClassId);
    } catch (err) {
      alert('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewAssignment = async (assignment: any) => {
    setSelectedAssignment(assignment);
    if (isTeacherOrAdmin) {
      try {
        const res = await apiClient.get(`/workspace/assignment/${assignment.id}/submissions`);
        setSubmissions(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (submissionUrl) formData.append('fileUrl', submissionUrl);
      if (submissionFile) formData.append('file', submissionFile);

      await apiClient.post(`/workspace/assignment/${selectedAssignment.id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Assignment submitted successfully!');
      setSubmissionUrl('');
      setSubmissionFile(null);
      setSelectedAssignment(null);
      // refetch to update status
      fetchWorkspace(selectedClassId);
    } catch (err) {
      alert('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Presentation size={28} color="var(--brand-500)" /> Digital Classroom (LMS)
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Manage posts, announcements, and assignments</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--surface-300)', background: 'white', fontWeight: 600, color: 'var(--text-700)' }}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="glass" style={{ flex: 1, borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading Workspace...</div>
        ) : !workspace ? (
          <div style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Presentation size={48} color="var(--surface-400)" />
            <h3 style={{ margin: 0, color: 'var(--text-700)' }}>No Workspace Initialized</h3>
            <p style={{ margin: 0, color: 'var(--text-500)', maxWidth: '400px' }}>
              This class does not have an active digital workspace yet.
            </p>
            {isTeacherOrAdmin && (
              <button className="primary-btn" onClick={handleInitWorkspace} disabled={submitting}>
                Initialize Workspace
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Header / Tabs */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--surface-200)', padding: '0 24px', display: 'flex', gap: '24px' }}>
              <button 
                onClick={() => setActiveTab('STREAM')}
                style={{ 
                  background: 'none', border: 'none', padding: '16px 0', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                  color: activeTab === 'STREAM' ? 'var(--brand-600)' : 'var(--text-500)',
                  borderBottom: activeTab === 'STREAM' ? '3px solid var(--brand-500)' : '3px solid transparent'
                }}
              >
                Stream
              </button>
              <button 
                onClick={() => setActiveTab('CLASSWORK')}
                style={{ 
                  background: 'none', border: 'none', padding: '16px 0', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                  color: activeTab === 'CLASSWORK' ? 'var(--brand-600)' : 'var(--text-500)',
                  borderBottom: activeTab === 'CLASSWORK' ? '3px solid var(--brand-500)' : '3px solid transparent'
                }}
              >
                Classwork
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--surface-50)' }}>
              
              {/* STREAM TAB */}
              {activeTab === 'STREAM' && (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  
                  {/* Class Header Banner */}
                  <div style={{ height: '160px', backgroundColor: 'var(--brand-600)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <h2 style={{ margin: 0, fontSize: '32px', position: 'relative', zIndex: 1 }}>{classes.find(c => c.id === selectedClassId)?.name}</h2>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '16px', position: 'relative', zIndex: 1 }}>{workspace.name}</p>
                  </div>

                  {/* Announce Something */}
                  {isTeacherOrAdmin && (
                    <div 
                      onClick={() => setIsPostModalOpen(true)}
                      style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--surface-200)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'text', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {user?.email?.[0]?.toUpperCase() || user?.profile?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div style={{ color: 'var(--text-500)', fontSize: '15px' }}>Announce something to your class...</div>
                    </div>
                  )}

                  {/* Posts Feed */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {workspace.posts?.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-400)' }}>
                        No posts yet. This is where you can talk to your class!
                      </div>
                    ) : (
                      workspace.posts?.map((post: any) => (
                        <div key={post.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-200)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-200)', color: 'var(--text-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                              {post.author?.profile?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>{post.author?.profile?.firstName} {post.author?.profile?.lastName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-800)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {post.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CLASSWORK TAB */}
              {activeTab === 'CLASSWORK' && (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  
                  {isTeacherOrAdmin && (
                    <div style={{ marginBottom: '24px' }}>
                      <button className="primary-btn" onClick={() => setIsAssignmentModalOpen(true)}>
                        <Plus size={18} /> Create Assignment
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {workspace.assignments?.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-400)', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--surface-300)' }}>
                        <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '16px' }}>No classwork assigned yet.</p>
                      </div>
                    ) : (
                      workspace.assignments?.map((assignment: any) => (
                        <div 
                          key={assignment.id} 
                          onClick={() => handleViewAssignment(assignment)}
                          style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-200)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-400)'}
                          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--surface-200)'}
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={24} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-900)' }}>{assignment.title}</h3>
                            <p style={{ margin: 0, color: 'var(--text-500)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CalIcon size={14} /> Due {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {isTeacherOrAdmin ? (
                            <div style={{ color: 'var(--brand-600)', fontWeight: 600, fontSize: '14px' }}>View Submissions</div>
                          ) : (
                            <div style={{ color: 'var(--text-500)', fontSize: '14px' }}>Open Assignment</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODALS */}

      {/* Create Post Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Create Announcement</h3>
              <button className="close-btn" onClick={() => setIsPostModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <textarea 
                  placeholder="Share something with your class..." 
                  value={postContent} 
                  onChange={e => setPostContent(e.target.value)} 
                  rows={5} 
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)', fontSize: '15px', resize: 'vertical' }}
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsPostModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Create Assignment</h3>
              <button className="close-btn" onClick={() => setIsAssignmentModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="e.g. History Essay" value={assignmentForm.title} onChange={e => setAssignmentForm({...assignmentForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Instructions / Description</label>
                <textarea placeholder="Provide instructions for this assignment..." value={assignmentForm.description} onChange={e => setAssignmentForm({...assignmentForm, description: e.target.value})} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }} required />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={assignmentForm.dueDate} onChange={e => setAssignmentForm({...assignmentForm, dueDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Attachment (Optional)</label>
                <input type="file" onChange={e => setAssignmentFile(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsAssignmentModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid var(--surface-200)' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '22px' }}>{selectedAssignment.title}</h2>
                <div style={{ color: 'var(--text-500)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalIcon size={14} /> Due {new Date(selectedAssignment.dueDate).toLocaleString()}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedAssignment(null)}><X size={24} /></button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 8px', color: 'var(--text-900)' }}>Instructions</h4>
                <p style={{ margin: '0 0 16px', color: 'var(--text-700)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedAssignment.description}
                </p>
                {selectedAssignment.attachmentUrl && (
                  <a href={selectedAssignment.attachmentUrl.startsWith('/') ? `http://localhost:3000${selectedAssignment.attachmentUrl}` : selectedAssignment.attachmentUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--surface-100)', padding: '8px 16px', borderRadius: '8px', color: 'var(--brand-600)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                    <Download size={16} /> Download Attachment
                  </a>
                )}
              </div>

              {isTeacherOrAdmin ? (
                <div>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-900)', borderBottom: '2px solid var(--surface-100)', paddingBottom: '8px' }}>
                    Student Submissions ({submissions.length})
                  </h4>
                  {submissions.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '8px' }}>
                      No submissions yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {submissions.map(sub => (
                        <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--surface-50)', borderRadius: '8px', border: '1px solid var(--surface-200)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                              {sub.student?.user?.profile?.firstName?.[0] || 'S'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>{sub.student?.user?.profile?.firstName} {sub.student?.user?.profile?.lastName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>Submitted: {new Date(sub.submittedAt).toLocaleString()}</div>
                            </div>
                          </div>
                          <a href={sub.fileUrl?.startsWith('/') ? `http://localhost:3000${sub.fileUrl}` : sub.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-600)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--brand-200)' }}>
                            <Download size={14} /> View Work
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--surface-50)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-200)' }}>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-900)' }}>Your Work</h4>
                  <form onSubmit={handleSubmitAssignment}>
                    <div className="form-group">
                      <label>Upload File (Report/Assignment)</label>
                      <input 
                        type="file" 
                        onChange={e => setSubmissionFile(e.target.files ? e.target.files[0] : null)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', marginBottom: '12px' }}
                      />
                      <label>Or provide a Submission Link (e.g., Google Doc, PDF link)</label>
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        value={submissionUrl}
                        onChange={e => setSubmissionUrl(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)' }}
                      />
                    </div>
                    <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={submitting}>
                      Turn In
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
