import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, X, Search, Calendar, FileText, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Publications = () => {
  const { user } = useAuth();
  const isAdminOrEditor = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddPublicationModalOpen, setIsAddPublicationModalOpen] = useState(false);
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);
  const [selectedPublicationForArticle, setSelectedPublicationForArticle] = useState<any>(null);
  
  // Forms
  const [submitting, setSubmitting] = useState(false);
  const [publicationFormData, setPublicationFormData] = useState({ title: '', issueDate: '', type: 'Newsletter' });
  const [articleFormData, setArticleFormData] = useState({ title: '', content: '', authorName: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/publications');
      setPublications(res.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/publications', publicationFormData);
      setIsAddPublicationModalOpen(false);
      setPublicationFormData({ title: '', issueDate: '', type: 'Newsletter' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add publication: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(`/publications/${selectedPublicationForArticle.id}/article`, articleFormData);
      setIsAddArticleModalOpen(false);
      setSelectedPublicationForArticle(null);
      setArticleFormData({ title: '', content: '', authorName: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add article: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPublications = publications.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Newspaper size={28} color="var(--brand-500)" /> Publications
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>School newsletters, magazines, and articles</p>
        </div>
        {isAdminOrEditor && (
          <button className="primary-btn" onClick={() => setIsAddPublicationModalOpen(true)}>
            <Plus size={18} /> New Publication
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'default',
              backgroundColor: 'var(--brand-600)', color: 'white'
            }}
          >
            All Publications
          </button>
        </div>
        
        <div className="search-bar" style={{ width: '250px' }}>
          <Search size={18} className="search-icon" style={{ left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search publications..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading publications...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredPublications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)', background: 'var(--surface-100)', borderRadius: '12px' }}>
              No publications found.
            </div>
          ) : (
            filteredPublications.map(pub => (
              <div key={pub.id} className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-200)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                        {pub.type}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-500)' }}>
                        <Calendar size={12} /> {new Date(pub.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-900)' }}>{pub.title}</h3>
                  </div>
                  {isAdminOrEditor && (
                    <button 
                      className="secondary-btn" 
                      onClick={() => { setSelectedPublicationForArticle(pub); setIsAddArticleModalOpen(true); }}
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      <Plus size={16} /> Add Article
                    </button>
                  )}
                </div>

                {pub.articles?.length === 0 ? (
                  <div style={{ fontSize: '14px', color: 'var(--text-500)', fontStyle: 'italic' }}>No articles in this publication yet.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {pub.articles.map((article: any) => (
                      <div key={article.id} style={{ backgroundColor: 'var(--surface-100)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--brand-600)' }}>
                          <FileText size={18} />
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-800)' }}>{article.title}</h4>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-600)', margin: '0 0 16px', lineHeight: '1.5', flex: 1, whiteSpace: 'pre-wrap' }}>
                          {article.content}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-500)', marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--surface-300)' }}>
                          <User size={14} /> By {article.authorName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Publication Modal */}
      {isAddPublicationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Create Publication</h3>
              <button className="close-btn" onClick={() => setIsAddPublicationModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddPublication}>
              <div className="form-group">
                <label>Publication Title</label>
                <input 
                  type="text" 
                  value={publicationFormData.title}
                  onChange={e => setPublicationFormData({...publicationFormData, title: e.target.value})}
                  required
                  placeholder="e.g. Spring Newsletter 2026"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select 
                  value={publicationFormData.type}
                  onChange={e => setPublicationFormData({...publicationFormData, type: e.target.value})}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-200)' }}
                >
                  <option value="Newsletter">Newsletter</option>
                  <option value="Magazine">Magazine</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input 
                  type="date" 
                  value={publicationFormData.issueDate}
                  onChange={e => setPublicationFormData({...publicationFormData, issueDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddPublicationModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {isAddArticleModalOpen && selectedPublicationForArticle && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Add Article to {selectedPublicationForArticle.title}</h3>
              <button className="close-btn" onClick={() => setIsAddArticleModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddArticle}>
              <div className="form-group">
                <label>Article Title</label>
                <input 
                  type="text" 
                  value={articleFormData.title}
                  onChange={e => setArticleFormData({...articleFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author Name</label>
                <input 
                  type="text" 
                  value={articleFormData.authorName}
                  onChange={e => setArticleFormData({...articleFormData, authorName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  value={articleFormData.content}
                  onChange={e => setArticleFormData({...articleFormData, content: e.target.value})}
                  required
                  rows={8}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-200)', resize: 'vertical' }}
                  placeholder="Write the article content here..."
                ></textarea>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddArticleModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
