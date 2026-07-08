import React, { useState, useEffect } from 'react';
import { User, Shield, Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import './Dashboard.css';

export const Settings = () => {
  const { user, login } = useAuth(); // We might need to refetch user data after update
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // System Settings Form (Admin Only)
  const [systemSettings, setSystemSettings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }

    if (user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN') {
      fetchSystemSettings();
    }
  }, [user]);

  const fetchSystemSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      setSystemSettings(res.data);
    } catch (e) {
      console.error('Failed to fetch system settings', e);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put('/users/profile', profileData);
      alert('Profile updated successfully! Note: You may need to refresh to see all changes.');
    } catch (e: any) {
      alert('Failed to update profile: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiClient.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      alert('Failed to update password: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSettingUpdate = async (key: string, value: string) => {
    try {
      await apiClient.post('/settings', { key, value });
      alert('Setting updated successfully!');
      fetchSystemSettings();
    } catch (e: any) {
      alert('Failed to update setting: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '32px' }}>
      
      {/* Sidebar Tabs */}
      <div className="glass" style={{ width: '260px', padding: '24px', borderRadius: '16px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: '0 0 16px', color: 'var(--text-900)' }}>Settings</h3>
        
        <button 
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            backgroundColor: activeTab === 'profile' ? 'var(--brand-50)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--brand-700)' : 'var(--text-700)',
            fontWeight: activeTab === 'profile' ? 600 : 500,
            textAlign: 'left', transition: 'all 0.2s'
          }}
        >
          <User size={18} /> Personal Profile
        </button>
        
        <button 
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            backgroundColor: activeTab === 'security' ? 'var(--brand-50)' : 'transparent',
            color: activeTab === 'security' ? 'var(--brand-700)' : 'var(--text-700)',
            fontWeight: activeTab === 'security' ? 600 : 500,
            textAlign: 'left', transition: 'all 0.2s'
          }}
        >
          <Shield size={18} /> Security
        </button>

        {(user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN') && (
          <button 
            onClick={() => setActiveTab('system')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'system' ? 'var(--brand-50)' : 'transparent',
              color: activeTab === 'system' ? 'var(--brand-700)' : 'var(--text-700)',
              fontWeight: activeTab === 'system' ? 600 : 500,
              textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <SettingsIcon size={18} /> System Config
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="glass" style={{ flex: 1, padding: '32px', borderRadius: '16px' }}>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ margin: '0 0 24px', color: 'var(--text-900)' }}>Personal Profile</h2>
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={profileData.firstName} 
                    onChange={e => setProfileData({...profileData, firstName: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={profileData.lastName} 
                    onChange={e => setProfileData({...profileData, lastName: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={e => setProfileData({...profileData, email: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={profileData.phone} 
                  onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <button type="submit" className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
                  <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ margin: '0 0 24px', color: 'var(--text-900)' }}>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword} 
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword} 
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  required 
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  required 
                  minLength={6}
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <button type="submit" className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
                  <Save size={18} /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* System Config Tab */}
        {activeTab === 'system' && (
          <div>
            <h2 style={{ margin: '0 0 8px', color: 'var(--text-900)' }}>System Configuration</h2>
            <p style={{ color: 'var(--text-500)', margin: '0 0 24px' }}>Manage global application settings. Changes here affect all users.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {systemSettings.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-400)', border: '1px dashed var(--surface-300)', borderRadius: '12px' }}>
                  No system settings configured in the database.
                </div>
              ) : (
                systemSettings.map(setting => (
                  <div key={setting.id} style={{ 
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid var(--surface-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-800)', marginBottom: '4px' }}>{setting.key}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-500)' }}>{setting.description || 'No description provided'}</div>
                    </div>
                    <div style={{ width: '250px' }}>
                      <input 
                        type="text" 
                        defaultValue={setting.value} 
                        onBlur={(e) => {
                          if (e.target.value !== setting.value) {
                            handleSettingUpdate(setting.key, e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-300)' }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
