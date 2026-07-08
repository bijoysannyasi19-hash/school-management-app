import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, X, ArrowLeft, BarChart3, HelpCircle, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Surveys = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'TAKE' | 'RESULTS'>('LIST');
  const [responses, setResponses] = useState<any[]>([]);
  
  // Survey taking state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Modals & Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [surveyForm, setSurveyForm] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([{ text: '', type: 'TEXT', options: '[]' }]);

  useEffect(() => {
    if (viewMode === 'LIST') fetchSurveys();
  }, [viewMode]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/surveys');
      setSurveys(res.data);
    } catch (err) {
      console.error('Failed to fetch surveys', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (surveyId: string) => {
    try {
      const res = await apiClient.get(`/surveys/${surveyId}/responses`);
      setResponses(res.data);
    } catch (err) {
      console.error('Failed to fetch responses', err);
    }
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/surveys', {
        ...surveyForm,
        questions: questions.filter(q => q.text.trim() !== '')
      });
      setIsModalOpen(false);
      setSurveyForm({ title: '', description: '' });
      setQuestions([{ text: '', type: 'TEXT', options: '[]' }]);
      fetchSurveys();
    } catch (err) {
      alert('Failed to create survey');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'TEXT', options: '[]' }]);
  };

  const handleUpdateQuestion = (index: number, newText: string) => {
    const updated = [...questions];
    updated[index].text = newText;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/surveys/${selectedSurvey.id}/response`, {
        answers: JSON.stringify(answers),
        isAnonymous
      });
      alert('Thank you! Your response has been submitted.');
      setViewMode('LIST');
      setAnswers({});
    } catch (err) {
      alert('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const openSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setViewMode('TAKE');
    setAnswers({});
  };

  const openResults = (survey: any) => {
    setSelectedSurvey(survey);
    setViewMode('RESULTS');
    fetchResponses(survey.id);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <ClipboardList size={28} color="var(--brand-500)" /> Surveys & Feedback
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Share your feedback and answer school questionnaires</p>
        </div>
        
        {isAdmin && viewMode === 'LIST' && (
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create Survey
          </button>
        )}
      </div>

      <div className="glass" style={{ minHeight: '600px', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        {loading && viewMode === 'LIST' ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading...</div>
        ) : viewMode === 'LIST' ? (
          /* SURVEYS LIST */
          <div>
            {surveys.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '12px' }}>
                No active surveys right now.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {surveys.map(survey => (
                  <div key={survey.id} style={{ 
                    backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--surface-200)', padding: '24px',
                    display: 'flex', flexDirection: 'column', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: 'var(--text-900)' }}>{survey.title}</h3>
                    <p style={{ margin: '0 0 16px', color: 'var(--text-500)', fontSize: '14px', flex: 1 }}>{survey.description || 'No description provided.'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-400)' }}>{survey.questions?.length} Questions</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {isAdmin && (
                          <button onClick={() => openResults(survey)} style={{ background: 'var(--surface-100)', color: 'var(--text-700)', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <BarChart3 size={14} /> Results
                          </button>
                        )}
                        <button onClick={() => openSurvey(survey)} className="primary-btn" style={{ padding: '8px 16px' }}>
                          Take Survey
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : viewMode === 'TAKE' && selectedSurvey ? (
          /* TAKE SURVEY */
          <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
            <button onClick={() => setViewMode('LIST')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)', padding: '0 0 16px 0', fontWeight: 600 }}>
              <ArrowLeft size={18} /> Back to Surveys
            </button>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--surface-200)' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '24px' }}>{selectedSurvey.title}</h2>
              <p style={{ margin: '0 0 24px', color: 'var(--text-500)' }}>{selectedSurvey.description}</p>
              
              <form onSubmit={handleSubmitResponse}>
                {selectedSurvey.questions?.map((q: any, i: number) => (
                  <div key={q.id} style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontWeight: 600, color: 'var(--text-800)', marginBottom: '8px', fontSize: '16px' }}>
                      <span style={{ color: 'var(--brand-500)' }}>{i+1}.</span> {q.text}
                    </label>
                    <textarea 
                      required
                      placeholder="Your answer..."
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                      rows={3}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--surface-50)', borderRadius: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="anonymous" style={{ fontWeight: 500, color: 'var(--text-700)', cursor: 'pointer' }}>Submit anonymously</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="primary-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Answers'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : viewMode === 'RESULTS' && selectedSurvey ? (
          /* SURVEY RESULTS */
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <button onClick={() => setViewMode('LIST')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-500)', padding: '0 0 16px 0', fontWeight: 600 }}>
              <ArrowLeft size={18} /> Back to Surveys
            </button>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--surface-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '24px' }}>Results: {selectedSurvey.title}</h2>
                  <p style={{ margin: 0, color: 'var(--text-500)' }}>{responses.length} total responses collected</p>
                </div>
                <div style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-700)', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} /> {responses.length} Responses
                </div>
              </div>

              {responses.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '12px' }}>
                  No responses have been submitted yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {selectedSurvey.questions?.map((q: any, i: number) => (
                    <div key={q.id}>
                      <h4 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text-900)', borderBottom: '2px solid var(--surface-100)', paddingBottom: '8px' }}>
                        Q{i+1}: {q.text}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {responses.map(res => {
                          let ansObj = {};
                          try { ansObj = JSON.parse(res.answers); } catch (e) {}
                          const textAns = (ansObj as any)[q.id] || 'No answer';
                          return (
                            <div key={res.id} style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: 'var(--surface-50)', borderRadius: '8px' }}>
                              <div style={{ color: 'var(--text-400)' }}>
                                {res.user ? <User size={20} /> : <HelpCircle size={20} />}
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '4px' }}>
                                  {res.user ? `${res.user.profile?.firstName} ${res.user.profile?.lastName}` : 'Anonymous'} • {new Date(res.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ color: 'var(--text-800)' }}>{textAns}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* CREATE SURVEY MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid var(--surface-200)' }}>
              <h3 style={{ margin: 0 }}>Create New Survey</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <form id="surveyForm" onSubmit={handleCreateSurvey}>
                <div className="form-group">
                  <label>Survey Title</label>
                  <input type="text" placeholder="e.g. End of Year Feedback" value={surveyForm.title} onChange={e => setSurveyForm({...surveyForm, title: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label>Description</label>
                  <textarea placeholder="Briefly describe what this survey is for..." value={surveyForm.description} onChange={e => setSurveyForm({...surveyForm, description: e.target.value})} rows={2} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-900)' }}>Questions</h4>
                  <button type="button" onClick={handleAddQuestion} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--brand-50)', color: 'var(--brand-700)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={16} /> Add Question
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {questions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 600, color: 'var(--brand-600)', marginTop: '10px' }}>Q{i+1}.</div>
                      <input 
                        type="text" 
                        placeholder={`Question ${i+1}`}
                        value={q.text}
                        onChange={e => handleUpdateQuestion(i, e.target.value)}
                        style={{ flex: 1 }}
                        required
                      />
                      {questions.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuestion(i)} style={{ background: 'none', border: 'none', color: 'var(--danger-500)', cursor: 'pointer', padding: '10px' }}>
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </div>
            <div className="modal-actions" style={{ padding: '24px', borderTop: '1px solid var(--surface-200)', marginTop: 0 }}>
              <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" form="surveyForm" className="primary-btn" disabled={submitting}>Publish Survey</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
