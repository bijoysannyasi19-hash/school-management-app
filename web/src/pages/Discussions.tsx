import React, { useState, useEffect } from 'react';
import { MessagesSquare, Plus, ChevronRight, MessageCircle, X, ArrowLeft, Send } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Discussions = () => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role !== 'STUDENT' && user?.role !== 'PARENT';
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  // Navigation State: null -> Boards List -> Threads List -> Thread Detail
  const [selectedBoard, setSelectedBoard] = useState<any | null>(null);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  
  const [boards, setBoards] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [fullThread, setFullThread] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Modals
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardForm, setBoardForm] = useState({ title: '', description: '' });
  
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [threadForm, setThreadForm] = useState({ title: '', content: '' });
  
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      setSelectedBoard(null);
      setSelectedThread(null);
      fetchBoards(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedBoard) {
      setSelectedThread(null);
      fetchThreads(selectedBoard.id);
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (selectedThread) {
      fetchFullThread(selectedThread.id);
    }
  }, [selectedThread]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClassId(res.data[0].id);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  };

  const fetchBoards = async (classId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/discussions/class/${classId}`);
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async (boardId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/discussions/board/${boardId}/threads`);
      setThreads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullThread = async (threadId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/discussions/thread/${threadId}`);
      setFullThread(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/discussions/board', { ...boardForm, classId: selectedClassId });
      setIsBoardModalOpen(false);
      setBoardForm({ title: '', description: '' });
      fetchBoards(selectedClassId);
    } catch (err: any) {
      alert('Failed to create board');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoard) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/discussions/board/${selectedBoard.id}/thread`, threadForm);
      setIsThreadModalOpen(false);
      setThreadForm({ title: '', content: '' });
      fetchThreads(selectedBoard.id);
    } catch (err: any) {
      alert('Failed to create thread');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyContent.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/discussions/thread/${selectedThread.id}/reply`, { content: replyContent });
      setReplyContent('');
      fetchFullThread(selectedThread.id);
    } catch (err: any) {
      alert('Failed to reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <MessagesSquare size={28} color="var(--brand-500)" /> Discussion Forums
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Class Q&A and general discussions</p>
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

      <div className="glass" style={{ minHeight: '600px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--surface-200)', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--surface-50)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
          <span 
            onClick={() => { setSelectedBoard(null); setSelectedThread(null); }} 
            style={{ fontWeight: 600, color: !selectedBoard ? 'var(--text-900)' : 'var(--brand-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Boards
          </span>
          {selectedBoard && (
            <>
              <ChevronRight size={16} color="var(--text-400)" />
              <span 
                onClick={() => setSelectedThread(null)} 
                style={{ fontWeight: 600, color: !selectedThread ? 'var(--text-900)' : 'var(--brand-600)', cursor: 'pointer' }}
              >
                {selectedBoard.title}
              </span>
            </>
          )}
          {selectedThread && (
            <>
              <ChevronRight size={16} color="var(--text-400)" />
              <span style={{ fontWeight: 600, color: 'var(--text-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {selectedThread.title}
              </span>
            </>
          )}
        </div>

        <div style={{ flex: 1, padding: '24px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading...</div>
          ) : !selectedBoard ? (
            /* BOARDS LIST VIEW */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Available Discussion Boards</h3>
                {isTeacherOrAdmin && (
                  <button className="primary-btn" onClick={() => setIsBoardModalOpen(true)}>
                    <Plus size={16} /> New Board
                  </button>
                )}
              </div>
              
              {boards.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '12px' }}>
                  No boards have been created for this class yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {boards.map(board => (
                    <div 
                      key={board.id} 
                      onClick={() => setSelectedBoard(board)}
                      style={{ 
                        padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-200)', backgroundColor: 'white',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-400)'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--surface-200)'}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageCircle size={18} /> {board.title}
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-500)', fontSize: '14px' }}>{board.description || 'No description'}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-400)', fontWeight: 500 }}>
                          {board.threads?.length || 0} Threads
                        </span>
                        <ChevronRight color="var(--text-300)" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !selectedThread ? (
            /* THREADS LIST VIEW */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setSelectedBoard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-500)', padding: '8px' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedBoard.title}</h3>
                </div>
                <button className="primary-btn" onClick={() => setIsThreadModalOpen(true)}>
                  <Plus size={16} /> New Thread
                </button>
              </div>

              {threads.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '12px' }}>
                  No threads yet. Be the first to start a discussion!
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {threads.map(thread => (
                    <div 
                      key={thread.id} 
                      onClick={() => setSelectedThread(thread)}
                      style={{ 
                        padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--surface-200)', backgroundColor: 'white',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-400)'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--surface-200)'}
                    >
                      <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-900)' }}>{thread.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-500)' }}>
                          Posted by <span style={{ fontWeight: 600 }}>{thread.author?.profile?.firstName} {thread.author?.profile?.lastName}</span> • {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--brand-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={14} /> {thread.replies?.length || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* THREAD DETAIL VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {fullThread && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <button onClick={() => setSelectedThread(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-500)', padding: '8px' }}>
                      <ArrowLeft size={18} />
                    </button>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>{fullThread.title}</h3>
                  </div>

                  {/* Main Post */}
                  <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--brand-200)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {fullThread.author?.profile?.firstName?.[0]}{fullThread.author?.profile?.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>{fullThread.author?.profile?.firstName} {fullThread.author?.profile?.lastName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{new Date(fullThread.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-800)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {fullThread.content}
                    </p>
                  </div>

                  {/* Replies */}
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-600)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {fullThread.replies?.length} Replies
                  </h4>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {fullThread.replies?.map((reply: any) => (
                      <div key={reply.id} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--surface-200)', color: 'var(--text-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0, fontSize: '12px' }}>
                          {reply.author?.profile?.firstName?.[0]}{reply.author?.profile?.lastName?.[0]}
                        </div>
                        <div style={{ backgroundColor: 'var(--surface-50)', padding: '16px', borderRadius: '12px', flex: 1, border: '1px solid var(--surface-200)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-900)', fontSize: '14px' }}>{reply.author?.profile?.firstName} {reply.author?.profile?.lastName}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-500)' }}>{new Date(reply.createdAt).toLocaleString()}</span>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-700)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleReply} style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <input 
                      type="text" 
                      placeholder="Write a reply..." 
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--surface-300)', backgroundColor: 'white' }}
                      required
                    />
                    <button type="submit" disabled={submitting || !replyContent.trim()} style={{ 
                      width: '46px', height: '46px', borderRadius: '50%', backgroundColor: replyContent.trim() ? 'var(--brand-600)' : 'var(--surface-300)', 
                      color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: replyContent.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                    }}>
                      <Send size={18} style={{ marginLeft: '2px' }} />
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isBoardModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Create Discussion Board</h3>
              <button className="close-btn" onClick={() => setIsBoardModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateBoard}>
              <div className="form-group">
                <label>Board Title</label>
                <input type="text" placeholder="e.g. Q&A, Homework Help" value={boardForm.title} onChange={e => setBoardForm({...boardForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea placeholder="What is this board for?" value={boardForm.description} onChange={e => setBoardForm({...boardForm, description: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsBoardModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>Create Board</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isThreadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Start a New Thread</h3>
              <button className="close-btn" onClick={() => setIsThreadModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateThread}>
              <div className="form-group">
                <label>Thread Title</label>
                <input type="text" placeholder="What do you want to discuss?" value={threadForm.title} onChange={e => setThreadForm({...threadForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea placeholder="Write your message here..." value={threadForm.content} onChange={e => setThreadForm({...threadForm, content: e.target.value})} required rows={6} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsThreadModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>Post Thread</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
