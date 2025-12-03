import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';
import InstallPrompt from './components/InstallPrompt';
import SignupPage from './pages/SignupPage';
import Onboarding from './pages/Onboarding';
import MyComplaints from './pages/MyComplaints';
import SubmitComplaint from './pages/SubmitComplaint';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children, allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow && allow.length && !allow.includes(user.role)) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  return children;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Prefer last visited tab for students
  if (user.role !== 'admin') {
    const last = localStorage.getItem('cv_last_tab');
    if (last) return <Navigate to={last} replace />;
  }
  return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <InstallPrompt />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        {/* Keep root route as redirect to last tab/home */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allow={[ 'student', 'admin' ]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={[ 'admin' ]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

