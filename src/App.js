import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import SignUpPage from './pages/public/SignUpPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import './App.css';

// A wrapper to protect routes that require login
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    // If logged in but wrong role, redirect to home
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Breadcrumbs />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Candidate Route */}
            <Route
              path="/candidate-dashboard"
              element={
                <ProtectedRoute role="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Company Route */}
            <Route
              path="/company-dashboard"
              element={
                <ProtectedRoute role="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected HR Route */}
            <Route
              path="/hr-dashboard"
              element={
                <ProtectedRoute role="hr">
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;