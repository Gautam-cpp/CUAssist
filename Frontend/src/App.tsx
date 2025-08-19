import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/useAuth';

// Layout Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoutes';

// Auth Components
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignUpForm';
import OTPVerification from './components/Auth/OTPVerification';

// Main Components
import Dashboard from './components/Dashboard/DashBoard';
import CanteenList from './components/Canteen/CanteenList';
import CanteenDetail from './components/Canteen/CanteenDetail';
import NotesList from './components/Notes/NotesList';
import NotesUpload from './components/Notes/NotesUpload';
import MyUploads from './components/Notes/MyUploads';
import SubjectNotes from './components/Notes/SubjectNotes';
import GuidanceChat from './components/Guidance/GuidanceChat';
import SeniorRequestForm from './components/SeniorRequest/SeniorRequestForm';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import NotesManagement from './components/Admin/NotesManagement';
import SeniorRequestManagement from './components/Admin/SeniorRequestManagement';
import CanteenMenuUpload from './components/Admin/CanteenMenuUpload';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignupForm /> : <Navigate to="/dashboard" />} />
      <Route path="/verify-otp" element={!user ? <OTPVerification /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Canteen Routes */}
        <Route path="canteens" element={<CanteenList />} />
        <Route path="canteens/:name" element={<CanteenDetail />} />
        
        {/* Notes Routes */}
        <Route path="notes" element={<NotesList />} />
        <Route path="notes/upload" element={<NotesUpload />} />
        <Route path="notes/my-uploads" element={<MyUploads />} />
        <Route path="subject/:semester/:subject" element={<SubjectNotes />} />
        
        {/* Guidance Routes */}
        <Route path="guidance" element={<GuidanceChat />} />
        
        {/* Senior Request Routes */}
        <Route path="senior-request" element={
          <ProtectedRoute roles={['STUDENT']}>
            <SeniorRequestForm />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/notes" element={
          <ProtectedRoute roles={['ADMIN']}>
            <NotesManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/senior-requests" element={
          <ProtectedRoute roles={['ADMIN']}>
            <SeniorRequestManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/canteen-menu" element={
          <ProtectedRoute roles={['ADMIN']}>
            <CanteenMenuUpload />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;