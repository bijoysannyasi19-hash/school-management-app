import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Fees } from './pages/Fees';
import { Rewards } from './pages/Rewards';
import { Events } from './pages/Events';

import { Attendance } from './pages/Attendance';
import { Library } from './pages/Library';
import { Transport } from './pages/Transport';
import { Diary } from './pages/Diary';
import { LostFound } from './pages/LostFound';
import { Visitors } from './pages/Visitors';
import { Store } from './pages/Store';
import { Safety } from './pages/Safety';
import { Discussions } from './pages/Discussions';
import { Surveys } from './pages/Surveys';
import { Workspace } from './pages/Workspace';
import { Complaints } from './pages/Complaints';
import { Doubts } from './pages/Doubts';
import { Hostel } from './pages/Hostel';
import { Chat } from './pages/Chat';
import { Classes } from './pages/Classes';
import { Settings } from './pages/Settings';
import { Exams } from './pages/Exams';
import { Publications } from './pages/Publications';
import { Portfolio } from './pages/Portfolio';
import { Subjects } from './pages/Subjects';
import { Timetable } from './pages/Timetable';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER']}>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="teachers" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Teachers />
              </ProtectedRoute>
            } />
            <Route path="classes" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER']}>
                <Classes />
              </ProtectedRoute>
            } />
            <Route path="subjects" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER']}>
                <Subjects />
              </ProtectedRoute>
            } />
            <Route path="timetable" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']}>
                <Timetable />
              </ProtectedRoute>
            } />
            <Route path="workspace" element={<Workspace />} />
            <Route path="exams" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']}>
                <Exams />
              </ProtectedRoute>
            } />
            <Route path="attendance" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'STUDENT']}>
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="library" element={<Library />} />
            <Route path="transport" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT']}>
                <Transport />
              </ProtectedRoute>
            } />
            <Route path="hostel" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT']}>
                <Hostel />
              </ProtectedRoute>
            } />
            <Route path="chat" element={<Chat />} />
            <Route path="revenue" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Fees />
              </ProtectedRoute>
            } />
            <Route path="rewards" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER']}>
                <Rewards />
              </ProtectedRoute>
            } />
            <Route path="events" element={<Events />} />
            <Route path="settings" element={<Settings />} />
            <Route path="diary" element={<Diary />} />
            <Route path="lost-found" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT']}>
                <LostFound />
              </ProtectedRoute>
            } />
            <Route path="visitors" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Visitors />
              </ProtectedRoute>
            } />
            <Route path="store" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Store />
              </ProtectedRoute>
            } />
            <Route path="safety" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Safety />
              </ProtectedRoute>
            } />
            <Route path="discussions" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Discussions />
              </ProtectedRoute>
            } />
            <Route path="surveys" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
                <Surveys />
              </ProtectedRoute>
            } />
            <Route path="complaints" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT']}>
                <Complaints />
              </ProtectedRoute>
            } />
            <Route path="doubts" element={<Doubts />} />
            <Route path="publications" element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER']}>
                <Publications />
              </ProtectedRoute>
            } />
            <Route path="portfolio" element={<Portfolio />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
