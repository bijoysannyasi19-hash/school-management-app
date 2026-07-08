import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserSquare2, LogOut, Settings, GraduationCap, DollarSign, Trophy, Calendar, ClipboardCheck, BookOpen, Bus, Home, MessageSquare, Presentation, Layers, Award, Package, ShoppingBag, ShieldAlert, MessagesSquare, ClipboardList, LifeBuoy, HelpCircle, Newspaper, Briefcase } from 'lucide-react';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT' || user?.role === 'PARENT';

  const portalName = isAdmin ? 'Admin Portal' : (isTeacher ? 'Teacher Portal' : 'Student Portal');

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <GraduationCap size={32} className="brand-icon" />
          <h1 className="brand-title">EduConnect</h1>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          {(isAdmin || isTeacher) && (
            <>
              <NavLink to="/students" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                <span>Students</span>
              </NavLink>
              {isAdmin && (
                <NavLink to="/teachers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                  <UserSquare2 size={20} />
                  <span>Teachers</span>
                </NavLink>
              )}
              <NavLink to="/classes" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Layers size={20} />
                <span>Classes</span>
              </NavLink>
            </>
          )}

          <NavLink to="/workspace" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Presentation size={20} />
            <span>LMS Workspace</span>
          </NavLink>

          {(isAdmin || isTeacher) && (
            <NavLink to="/subjects" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>Subjects</span>
            </NavLink>
          )}

          <NavLink to="/timetable" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Timetable</span>
          </NavLink>
          <NavLink to="/exams" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Award size={20} />
            <span>Exams & Results</span>
          </NavLink>
          <NavLink to="/attendance" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ClipboardCheck size={20} />
            <span>Attendance</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/revenue" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <DollarSign size={20} />
              <span>Revenue</span>
            </NavLink>
          )}

          {(isAdmin || isTeacher) && (
            <NavLink to="/rewards" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Trophy size={20} />
              <span>Rewards</span>
            </NavLink>
          )}

          <NavLink to="/events" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Noticeboard</span>
          </NavLink>
          <NavLink to="/diary" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={20} />
            <span>Diary</span>
          </NavLink>
          <NavLink to="/library" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={20} />
            <span>Library</span>
          </NavLink>
          {(isAdmin || isStudent) && (
            <>
              <NavLink to="/transport" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Bus size={20} />
                <span>Transport</span>
              </NavLink>
              <NavLink to="/hostel" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={20} />
                <span>Hostel</span>
              </NavLink>
              <NavLink to="/lost-found" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Package size={20} />
                <span>Lost & Found</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/visitors" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardCheck size={20} />
              <span>Visitors</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/store" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShoppingBag size={20} />
              <span>Store</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/safety" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={20} />
              <span>Safety</span>
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/discussions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <MessagesSquare size={20} />
                <span>Discussions</span>
              </NavLink>
              <NavLink to="/surveys" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList size={20} />
                <span>Surveys</span>
              </NavLink>
            </>
          )}

          {(isAdmin || isStudent) && (
            <NavLink to="/complaints" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <LifeBuoy size={20} />
              <span>Helpdesk</span>
            </NavLink>
          )}

          <NavLink to="/doubts" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <HelpCircle size={20} />
            <span>Doubts</span>
          </NavLink>
          
          {(isAdmin || isTeacher) && (
            <NavLink to="/publications" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Newspaper size={20} />
              <span>Publications</span>
            </NavLink>
          )}

          {(isAdmin || isStudent) && (
            <NavLink to="/portfolio" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Briefcase size={20} />
              <span>Portfolio</span>
            </NavLink>
          )}

          <NavLink to="/chat" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Chat</span>
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user?.profile?.firstName?.[0] || 'A'}</div>
            <div className="user-info">
              <p className="user-name">{user?.profile?.firstName} {user?.profile?.lastName}</p>
              <p className="user-role">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <h2 className="page-title">{portalName}</h2>
          <div className="topbar-actions">
            {/* Search or notifications could go here */}
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
