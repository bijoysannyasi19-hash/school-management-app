import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Search, Bookmark, CheckCircle, Clock, BookMarked, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Library = () => {
  const { user } = useAuth();
  const isAdminOrLibrarian = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'LIBRARIAN';
  
  const [activeTab, setActiveTab] = useState('CATALOG'); // CATALOG, MY_ISSUES, ALL_ISSUES
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<any>(null);
  
  // Forms
  const [submitting, setSubmitting] = useState(false);
  const [bookFormData, setBookFormData] = useState({ title: '', author: '', isbn: '', totalCopies: 1 });
  const [issueFormData, setIssueFormData] = useState({ userId: '', dueDate: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'CATALOG') {
        const res = await apiClient.get('/library/books');
        setBooks(res.data);
      } else if (activeTab === 'ALL_ISSUES') {
        const res = await apiClient.get('/library/issues');
        setIssues(res.data);
      } else if (activeTab === 'MY_ISSUES') {
        const res = await apiClient.get('/library/my-issues');
        setIssues(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/library/books', { ...bookFormData, totalCopies: Number(bookFormData.totalCopies) });
      setIsAddBookModalOpen(false);
      setBookFormData({ title: '', author: '', isbn: '', totalCopies: 1 });
      fetchData();
    } catch (err: any) {
      alert('Failed to add book: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/library/issue', { bookId: selectedBookForIssue.id, ...issueFormData });
      setIsIssueModalOpen(false);
      setSelectedBookForIssue(null);
      setIssueFormData({ userId: '', dueDate: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to issue book: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnBook = async (issueId: string) => {
    try {
      await apiClient.put(`/library/return/${issueId}`);
      fetchData();
    } catch (err) {
      alert('Failed to return book');
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredIssues = issues.filter(i => 
    i.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.user?.profile?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <BookOpen size={28} color="var(--brand-500)" /> Library
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Manage books, issues, and catalog</p>
        </div>
        {isAdminOrLibrarian && activeTab === 'CATALOG' && (
          <button className="primary-btn" onClick={() => setIsAddBookModalOpen(true)}>
            <Plus size={18} /> Add Book
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('CATALOG')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'CATALOG' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'CATALOG' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            Catalog
          </button>
          {!isAdminOrLibrarian && (
            <button
              onClick={() => setActiveTab('MY_ISSUES')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'MY_ISSUES' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'MY_ISSUES' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              My Issued Books
            </button>
          )}
          {isAdminOrLibrarian && (
            <button
              onClick={() => setActiveTab('ALL_ISSUES')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'ALL_ISSUES' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'ALL_ISSUES' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              All Issued Books
            </button>
          )}
        </div>
        
        <div className="search-bar" style={{ width: '250px' }}>
          <Search size={18} className="search-icon" style={{ left: '12px' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'CATALOG' ? "Search books..." : "Search issues..."}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading library data...</div>
      ) : activeTab === 'CATALOG' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredBooks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-500)', background: 'var(--surface-100)', borderRadius: '12px' }}>
              No books found in the catalog.
            </div>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-700)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bookmark size={24} />
                  </div>
                  {book.available > 0 ? (
                    <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      {book.available} Available
                    </span>
                  ) : (
                    <span style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 4px' }}>{book.title}</h3>
                <p style={{ margin: '0 0 16px', color: 'var(--text-500)', fontSize: '14px' }}>by {book.author}</p>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', borderTop: '1px solid var(--surface-200)', paddingTop: '12px', fontSize: '13px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-400)', marginBottom: '2px' }}>ISBN</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-700)' }}>{book.isbn || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-400)', marginBottom: '2px' }}>Total Copies</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-700)' }}>{book.totalCopies}</div>
                  </div>
                </div>
                
                {isAdminOrLibrarian && (
                  <button 
                    disabled={book.available <= 0}
                    onClick={() => { setSelectedBookForIssue(book); setIsIssueModalOpen(true); }}
                    style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: book.available > 0 ? 'var(--brand-500)' : 'var(--surface-300)', color: 'white', fontWeight: 600, cursor: book.available > 0 ? 'pointer' : 'not-allowed' }}
                  >
                    Issue Book
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="table-container glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Details</th>
                {activeTab === 'ALL_ISSUES' && <th>Issued To</th>}
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                {isAdminOrLibrarian && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-500)' }}>
                    No issued books found.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const isOverdue = !issue.returnDate && new Date(issue.dueDate) < new Date();
                  return (
                    <tr key={issue.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-900)' }}>{issue.book?.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{issue.book?.author}</div>
                      </td>
                      {activeTab === 'ALL_ISSUES' && (
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={14} color="var(--text-500)" />
                            {issue.user?.profile?.firstName} {issue.user?.profile?.lastName}
                          </div>
                        </td>
                      )}
                      <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                      <td>
                        <span style={{ color: isOverdue ? 'var(--danger-600)' : 'var(--text-700)', fontWeight: isOverdue ? 600 : 400 }}>
                          {new Date(issue.dueDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        {issue.returnDate ? (
                          <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                            Returned on {new Date(issue.returnDate).toLocaleDateString()}
                          </span>
                        ) : isOverdue ? (
                          <span style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                            Overdue
                          </span>
                        ) : (
                          <span style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                            Issued
                          </span>
                        )}
                      </td>
                      {isAdminOrLibrarian && (
                        <td>
                          {!issue.returnDate && (
                            <button 
                              className="secondary-btn"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => handleReturnBook(issue.id)}
                            >
                              Mark Returned
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Modal */}
      {isAddBookModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Add New Book</h3>
              <button className="close-btn" onClick={() => setIsAddBookModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={bookFormData.title}
                  onChange={e => setBookFormData({...bookFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input 
                  type="text" 
                  value={bookFormData.author}
                  onChange={e => setBookFormData({...bookFormData, author: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>ISBN (Optional)</label>
                  <input 
                    type="text" 
                    value={bookFormData.isbn}
                    onChange={e => setBookFormData({...bookFormData, isbn: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Total Copies</label>
                  <input 
                    type="number" 
                    min="1"
                    value={bookFormData.totalCopies}
                    onChange={e => setBookFormData({...bookFormData, totalCopies: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddBookModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && selectedBookForIssue && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Issue Book</h3>
              <button className="close-btn" onClick={() => setIsIssueModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--surface-100)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>{selectedBookForIssue.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-500)' }}>by {selectedBookForIssue.author}</div>
            </div>

            <form onSubmit={handleIssueBook}>
              <div className="form-group">
                <label>User ID</label>
                <input 
                  type="text" 
                  placeholder="Enter User ID (UUID)..."
                  value={issueFormData.userId}
                  onChange={e => setIssueFormData({...issueFormData, userId: e.target.value})}
                  required
                />
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-400)' }}>In a real app, this would be a searchable dropdown of users.</p>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={issueFormData.dueDate}
                  onChange={e => setIssueFormData({...issueFormData, dueDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsIssueModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Issuing...' : 'Issue Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
