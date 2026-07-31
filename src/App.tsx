import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GymDataProvider } from './context/GymDataContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Trainers } from './pages/Trainers';
import { Plans } from './pages/Plans';
import { Attendance } from './pages/Attendance';
import { Payments } from './pages/Payments';
import { Inventory } from './pages/Inventory';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <GymDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="plans" element={<Plans />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="payments" element={<Payments />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GymDataProvider>
    </AuthProvider>
  );
}
