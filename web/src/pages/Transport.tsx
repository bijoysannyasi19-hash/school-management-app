import React, { useState, useEffect } from 'react';
import { Bus, Plus, X, Search, MapPin, Users, Navigation } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Transport = () => {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'TRANSPORT_MANAGER';
  
  const [activeTab, setActiveTab] = useState('ROUTES'); // ROUTES, VEHICLES
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  
  // Forms
  const [submitting, setSubmitting] = useState(false);
  const [routeFormData, setRouteFormData] = useState({ name: '', startPoint: '', endPoint: '' });
  const [vehicleFormData, setVehicleFormData] = useState({ number: '', capacity: 40, routeId: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ROUTES') {
        const res = await apiClient.get('/transport/routes');
        setRoutes(res.data);
      } else if (activeTab === 'VEHICLES') {
        const res = await apiClient.get('/transport/vehicles');
        setVehicles(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/transport/routes', routeFormData);
      setIsAddRouteModalOpen(false);
      setRouteFormData({ name: '', startPoint: '', endPoint: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add route: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/transport/vehicles', { 
        ...vehicleFormData, 
        capacity: Number(vehicleFormData.capacity),
        routeId: vehicleFormData.routeId || undefined 
      });
      setIsAddVehicleModalOpen(false);
      setVehicleFormData({ number: '', capacity: 40, routeId: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add vehicle: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredVehicles = vehicles.filter(v => 
    v.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <Bus size={28} color="var(--brand-500)" /> Transport
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Manage school buses and routes</p>
        </div>
        {isAdminOrManager && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" onClick={() => setIsAddRouteModalOpen(true)}>
              <Plus size={18} /> Add Route
            </button>
            <button className="primary-btn" onClick={() => setIsAddVehicleModalOpen(true)}>
              <Plus size={18} /> Add Vehicle
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('ROUTES')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'ROUTES' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'ROUTES' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            Routes
          </button>
          {isAdminOrManager && (
            <button
              onClick={() => setActiveTab('VEHICLES')}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'VEHICLES' ? 'var(--brand-600)' : 'var(--surface-200)',
                color: activeTab === 'VEHICLES' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
              }}
            >
              Vehicles
            </button>
          )}
        </div>
        
        <div className="search-bar" style={{ width: '250px' }}>
          <Search size={18} className="search-icon" style={{ left: '12px' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'ROUTES' ? "Search routes..." : "Search vehicles..."}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading transport data...</div>
      ) : activeTab === 'ROUTES' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredRoutes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-500)', background: 'var(--surface-100)', borderRadius: '12px' }}>
              No routes found.
            </div>
          ) : (
            filteredRoutes.map(route => (
              <div key={route.id} className="glass" style={{ padding: '24px', borderRadius: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', padding: '10px', borderRadius: '12px' }}>
                    <Navigation size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--text-900)' }}>{route.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-500)' }}>
                      <Users size={14} /> {route.vehicles?.length || 0} Vehicles assigned
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '9px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--surface-300)', zIndex: 0 }}></div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-600)' }}></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Start Point</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-800)', fontWeight: 500 }}>{route.startPoint}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--danger-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger-600)' }}></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>End Point</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-800)', fontWeight: 500 }}>{route.endPoint}</div>
                    </div>
                  </div>
                </div>

                {route.vehicles?.length > 0 && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--surface-200)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '8px' }}>Assigned Vehicles</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {route.vehicles.map((v: any) => (
                        <span key={v.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--surface-100)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-700)', border: '1px solid var(--surface-200)' }}>
                          <Bus size={12} /> {v.number}
                        </span>
                      ))}
                    </div>
                  </div>
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
                <th>Vehicle Number</th>
                <th>Capacity</th>
                <th>Assigned Route</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-500)' }}>
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ backgroundColor: 'var(--surface-100)', padding: '8px', borderRadius: '8px' }}>
                          <Bus size={18} color="var(--text-600)" />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-900)' }}>{vehicle.number}</span>
                      </div>
                    </td>
                    <td>{vehicle.capacity} seats</td>
                    <td>
                      {vehicle.route ? (
                        <span style={{ color: 'var(--brand-600)', fontWeight: 500 }}>{vehicle.route.name}</span>
                      ) : (
                        <span style={{ color: 'var(--text-400)' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Route Modal */}
      {isAddRouteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Add New Route</h3>
              <button className="close-btn" onClick={() => setIsAddRouteModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddRoute}>
              <div className="form-group">
                <label>Route Name</label>
                <input 
                  type="text" 
                  value={routeFormData.name}
                  onChange={e => setRouteFormData({...routeFormData, name: e.target.value})}
                  required
                  placeholder="e.g. Route A - Downtown"
                />
              </div>
              <div className="form-group">
                <label>Start Point</label>
                <input 
                  type="text" 
                  value={routeFormData.startPoint}
                  onChange={e => setRouteFormData({...routeFormData, startPoint: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Point</label>
                <input 
                  type="text" 
                  value={routeFormData.endPoint}
                  onChange={e => setRouteFormData({...routeFormData, endPoint: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddRouteModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Add New Vehicle</h3>
              <button className="close-btn" onClick={() => setIsAddVehicleModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label>Vehicle Number (License Plate)</label>
                <input 
                  type="text" 
                  value={vehicleFormData.number}
                  onChange={e => setVehicleFormData({...vehicleFormData, number: e.target.value})}
                  required
                  placeholder="e.g. AB 12 CD 3456"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input 
                  type="number" 
                  min="1"
                  value={vehicleFormData.capacity}
                  onChange={e => setVehicleFormData({...vehicleFormData, capacity: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign to Route (Optional)</label>
                <select 
                  value={vehicleFormData.routeId} 
                  onChange={e => setVehicleFormData({...vehicleFormData, routeId: e.target.value})}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-200)' }}
                >
                  <option value="">-- None --</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddVehicleModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
