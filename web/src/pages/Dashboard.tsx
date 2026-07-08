import React, { useEffect, useState } from 'react';
import { Users, UserSquare2, CalendarCheck, DollarSign, Activity, Clock, Award, BookOpen, CheckCircle, FileText } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

interface Stat {
  key: string;
  value: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  const isStudent = user?.role === 'STUDENT';
  const isTeacher = user?.role === 'TEACHER';

  // Admin state
  const [adminStats, setAdminStats] = useState({ students: 0, teachers: 0, attendance: 0, revenue: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [adminActivities, setAdminActivities] = useState<any[]>([]);

  // Personal state (Student/Teacher)
  const [personalStats, setPersonalStats] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchPersonalData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const res = await apiClient.get('/school-stats');
      const data: Stat[] = res.data;
      setAdminStats({
        students: data.find(s => s.key === 'total_students')?.value || 0,
        teachers: data.find(s => s.key === 'total_teachers')?.value || 0,
        attendance: data.find(s => s.key === 'attendance_rate')?.value || 0,
        revenue: data.find(s => s.key === 'monthly_revenue')?.value || 0,
      });

      const [chartRes, activityRes] = await Promise.all([
        apiClient.get('/school-stats/chart-data'),
        apiClient.get('/school-stats/activity')
      ]);
      setChartData(chartRes.data);
      setAdminActivities(activityRes.data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  const fetchPersonalData = async () => {
    try {
      const res = await apiClient.get('/dashboard/me');
      setPersonalStats(res.data);
    } catch (err) {
      console.error('Failed to fetch personal stats', err);
    }
  };

  if (isAdmin) {
    return (
      <div className="dashboard-container">
        <div className="stats-grid">
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper students-icon"><Users size={24} /></div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-value">{adminStats.students.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper teachers-icon"><UserSquare2 size={24} /></div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p className="stat-value">{adminStats.teachers}</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper attendance-icon"><CalendarCheck size={24} /></div>
            <div className="stat-content">
              <h3>Attendance Rate</h3>
              <p className="stat-value">{adminStats.attendance}%</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper revenue-icon"><DollarSign size={24} /></div>
            <div className="stat-content">
              <h3>Monthly Revenue</h3>
              <p className="stat-value">${adminStats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="chart-placeholder glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>Revenue Overview</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-500)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-500)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-500)', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: 'var(--brand-600)', fontWeight: 600 }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--brand-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="recent-activity glass">
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {adminActivities.map((activity, idx) => (
                <div key={activity.id || idx} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-50)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-500)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', color: 'var(--text-800)', fontWeight: 500, lineHeight: 1.4 }}>{activity.action}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-500)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isStudent && personalStats) {
    return (
      <div className="dashboard-container">
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', color: 'var(--text-900)' }}>Welcome back, {user?.profile?.firstName || 'Student'}!</h2>
        
        <div className="stats-grid">
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper attendance-icon"><CalendarCheck size={24} /></div>
            <div className="stat-content">
              <h3>My Attendance</h3>
              <p className="stat-value">{personalStats.attendanceRate}%</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper students-icon"><Award size={24} /></div>
            <div className="stat-content">
              <h3>Reward Points</h3>
              <p className="stat-value">{personalStats.totalRewardPoints}</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper revenue-icon"><FileText size={24} /></div>
            <div className="stat-content">
              <h3>Pending Assignments</h3>
              <p className="stat-value">{personalStats.pendingAssignments}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content" style={{ gridTemplateColumns: '1fr' }}>
          <div className="recent-activity glass">
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>Recent Achievements</h3>
            {personalStats.recentActivity?.length === 0 ? (
              <p style={{ color: 'var(--text-500)' }}>No recent achievements yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {personalStats.recentActivity?.map((activity: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-50)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-500)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', color: 'var(--text-800)', fontWeight: 500, lineHeight: 1.4 }}>{activity.action}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-500)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isTeacher && personalStats) {
    return (
      <div className="dashboard-container">
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', color: 'var(--text-900)' }}>Welcome back, {user?.profile?.firstName || 'Teacher'}!</h2>
        
        <div className="stats-grid">
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper students-icon"><BookOpen size={24} /></div>
            <div className="stat-content">
              <h3>My Classes</h3>
              <p className="stat-value">{personalStats.totalClasses || 0}</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper revenue-icon"><FileText size={24} /></div>
            <div className="stat-content">
              <h3>Pending Grading</h3>
              <p className="stat-value">{personalStats.pendingGrading || 0}</p>
            </div>
          </div>
          <div className="stat-card glass animate-hover">
            <div className="stat-icon-wrapper attendance-icon"><CalendarCheck size={24} /></div>
            <div className="stat-content">
              <h3>Upcoming Classes</h3>
              <p className="stat-value">View Timetable</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content" style={{ gridTemplateColumns: '1fr' }}>
          <div className="recent-activity glass">
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-800)', fontSize: '18px' }}>Recent Activity</h3>
            {!personalStats.recentActivity || personalStats.recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-500)' }}>No recent activity to display.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {personalStats.recentActivity?.map((activity: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-50)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-500)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', color: 'var(--text-800)', fontWeight: 500, lineHeight: 1.4 }}>{activity.action}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-500)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>Loading Dashboard...</div>;
};
