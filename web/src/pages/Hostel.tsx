import React, { useState, useEffect } from 'react';
import { Home, Plus, X, Search, Users, Bed, CheckCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Hostel = () => {
  const { user } = useAuth();
  const isAdminOrWarden = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'HOSTEL_WARDEN';
  const isStudent = user?.role === 'STUDENT';
  
  const [activeTab, setActiveTab] = useState(isAdminOrWarden ? 'ALL_ROOMS' : 'MY_ROOM'); 
  const [rooms, setRooms] = useState<any[]>([]);
  const [myRoom, setMyRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedRoomForAllocation, setSelectedRoomForAllocation] = useState<any>(null);
  
  // Forms
  const [submitting, setSubmitting] = useState(false);
  const [roomFormData, setRoomFormData] = useState({ roomNumber: '', capacity: 2 });
  const [allocateFormData, setAllocateFormData] = useState({ studentId: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ALL_ROOMS') {
        const res = await apiClient.get('/hostel/rooms');
        setRooms(res.data);
      } else if (activeTab === 'MY_ROOM' && isStudent) {
        try {
          const res = await apiClient.get('/hostel/rooms/my');
          setMyRoom(res.data);
        } catch (err: any) {
          if (err.response?.status === 400) {
            setMyRoom(null); // No room assigned
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/hostel/rooms', { ...roomFormData, capacity: Number(roomFormData.capacity) });
      setIsAddRoomModalOpen(false);
      setRoomFormData({ roomNumber: '', capacity: 2 });
      fetchData();
    } catch (err: any) {
      alert('Failed to add room: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAllocateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.put(`/hostel/rooms/${selectedRoomForAllocation.id}/allocate/${allocateFormData.studentId}`);
      setIsAllocateModalOpen(false);
      setSelectedRoomForAllocation(null);
      setAllocateFormData({ studentId: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to allocate room: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Home size={28} color="var(--brand-500)" /> Hostel
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Manage hostel rooms and occupancy</p>
        </div>
        {isAdminOrWarden && activeTab === 'ALL_ROOMS' && (
          <button className="primary-btn" onClick={() => setIsAddRoomModalOpen(true)}>
            <Plus size={18} /> Add Room
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdminOrWarden && (
            <button
              onClick={() => setActiveTab('ALL_ROOMS')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'ALL_ROOMS' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'ALL_ROOMS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              All Rooms
            </button>
          )}
          {isStudent && (
            <button
              onClick={() => setActiveTab('MY_ROOM')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'MY_ROOM' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'MY_ROOM' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              My Room
            </button>
          )}
        </div>
        
        {activeTab === 'ALL_ROOMS' && (
          <div className="search-bar" style={{ width: '250px' }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading hostel data...</div>
      ) : activeTab === 'ALL_ROOMS' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredRooms.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-500)', background: 'var(--surface-100)', borderRadius: '12px' }}>
              No rooms found.
            </div>
          ) : (
            filteredRooms.map(room => {
              const occupancyPercentage = (room.occupied / room.capacity) * 100;
              const isFull = room.occupied >= room.capacity;
              
              return (
                <div key={room.id} className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ backgroundColor: isFull ? 'var(--danger-50)' : 'var(--brand-50)', color: isFull ? 'var(--danger-600)' : 'var(--brand-600)', padding: '10px', borderRadius: '12px' }}>
                        <Bed size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-400)', textTransform: 'uppercase' }}>Room</div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-900)' }}>{room.roomNumber}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-500)', fontWeight: 500 }}>Occupancy</span>
                      <span style={{ fontWeight: 600, color: isFull ? 'var(--danger-600)' : 'var(--text-700)' }}>
                        {room.occupied} / {room.capacity}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-200)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${occupancyPercentage}%`, 
                        backgroundColor: isFull ? 'var(--danger-500)' : 'var(--brand-500)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {room.students?.length > 0 && (
                    <div style={{ marginBottom: '16px', flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '8px' }}>Students:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {room.students.map((s: any) => (
                          <div key={s.id} style={{ fontSize: '13px', color: 'var(--text-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--brand-400)', borderRadius: '50%' }}></div>
                            {s.user?.profile?.firstName} {s.user?.profile?.lastName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isAdminOrWarden && (
                    <button 
                      disabled={isFull}
                      onClick={() => { setSelectedRoomForAllocation(room); setIsAllocateModalOpen(true); }}
                      style={{ marginTop: 'auto', width: '100%', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: isFull ? 'var(--surface-300)' : 'var(--brand-500)', color: 'white', fontWeight: 600, cursor: isFull ? 'not-allowed' : 'pointer' }}
                    >
                      {isFull ? 'Room Full' : 'Allocate Student'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : activeTab === 'MY_ROOM' ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {myRoom ? (
            <div className="glass" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Bed size={40} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-900)', margin: '0 0 8px' }}>Room {myRoom.roomNumber}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '24px 0' }}>
                <div style={{ backgroundColor: 'var(--surface-100)', padding: '16px', borderRadius: '12px', minWidth: '120px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-500)', marginBottom: '4px' }}>Capacity</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-800)' }}>{myRoom.capacity} Beds</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-100)', padding: '16px', borderRadius: '12px', minWidth: '120px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-500)', marginBottom: '4px' }}>Occupied</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-800)' }}>{myRoom.occupied} Students</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success-600)', fontWeight: 500, backgroundColor: 'var(--success-50)', padding: '12px', borderRadius: '12px' }}>
                <CheckCircle size={20} /> You are successfully allocated to this room.
              </div>
            </div>
          ) : (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '20px' }}>
              <Home size={64} color="var(--surface-300)" style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', margin: '0 0 12px' }}>No Room Allocated</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-500)', margin: 0 }}>You have not been assigned to a hostel room yet. Please contact the hostel warden if you require accommodation.</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Add Room Modal */}
      {isAddRoomModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add New Room</h3>
              <button className="close-btn" onClick={() => setIsAddRoomModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Room Number</label>
                <input 
                  type="text" 
                  value={roomFormData.roomNumber}
                  onChange={e => setRoomFormData({...roomFormData, roomNumber: e.target.value})}
                  required
                  placeholder="e.g. A-101"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={roomFormData.capacity}
                  onChange={e => setRoomFormData({...roomFormData, capacity: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddRoomModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Student Modal */}
      {isAllocateModalOpen && selectedRoomForAllocation && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Allocate Student</h3>
              <button className="close-btn" onClick={() => setIsAllocateModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--surface-100)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>Room {selectedRoomForAllocation.roomNumber}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-500)' }}>Available Beds: {selectedRoomForAllocation.capacity - selectedRoomForAllocation.occupied}</div>
            </div>

            <form onSubmit={handleAllocateRoom}>
              <div className="form-group">
                <label>Student ID</label>
                <input 
                  type="text" 
                  placeholder="Enter Student UUID..."
                  value={allocateFormData.studentId}
                  onChange={e => setAllocateFormData({...allocateFormData, studentId: e.target.value})}
                  required
                />
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-400)' }}>In a real app, this would be a searchable dropdown of students.</p>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAllocateModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Allocating...' : 'Allocate Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
