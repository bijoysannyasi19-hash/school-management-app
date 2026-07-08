import React, { useEffect, useState } from 'react';
import { Calendar, Plus, MapPin } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import './DataTable.css';

export const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get('/events');
      setEvents(res.data);
    } catch (e) {
      console.error('Failed to fetch events', e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/events', {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        ...(formData.imageUrl ? { imageUrl: formData.imageUrl } : {})
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
      fetchEvents(); // Refresh list
    } catch (e: any) {
      console.error(e);
      alert('Failed to create event: ' + (e.response?.data?.message || e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-container glass">
        <div className="table-header-actions">
          <h2>Noticeboard & Events</h2>
          {(!user || (user.role !== 'STUDENT' && user.role !== 'PARENT')) && (
            <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Schedule Event
            </button>
          )}
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Description</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>RSVPs</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {event.imageUrl && (
                      <img src={event.imageUrl} alt="poster" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                    )}
                    {event.title}
                  </div>
                </td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {event.description}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-600)' }}>
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-600)' }}>
                    <MapPin size={14} />
                    {event.location}
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary-600)' }}>
                    {event.registrations?.length || 0} attending
                  </span>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-400)' }}>No upcoming events.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Event">
        <form onSubmit={handleCreateEvent} noValidate>
          <div className="form-group">
            <label>Event Title</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Annual Science Fair" />
          </div>
          <div className="form-group">
            <label>Event Poster Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({...formData, imageUrl: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="preview" style={{ marginTop: '8px', maxHeight: '100px', borderRadius: '8px' }} />
            )}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              rows={3}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Join us for the showcase..." 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--surface-200)', borderRadius: 'var(--radius-md)', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Date & Time</label>
              <input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Main Auditorium" />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule Event'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
