import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentAttendance from './pages/StudentAttendance';
import AdminDashboard from './pages/AdminDashboard';
import AdminFoodOrder from './pages/AdminFoodOrder';
import AdminProfile from './pages/AdminProfile';
import FoodOrderSystem from './pages/FoodOrderSystem';
import StudentPayments from './pages/StudentPayments';
import RoomAllocation from './pages/RoomAllocation';
import AvailableRooms from './pages/AvailableRooms';
import StudentRoomDetails from './pages/StudentRoomDetails';   // ← New import
import Sidebar from './components/Sidebar';

import './index.css';

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-attendance" element={<StudentAttendance />} />
        <Route path="/student-food-order" element={<FoodOrderSystem />} />
        <Route path="/student-payments" element={<StudentPayments />} />

        {/* New Room Details Page (Student Side) */}
        <Route path="/student-room-details" element={<StudentRoomDetails />} />

        {/* Available Rooms Page (if you still want to keep it) */}
        <Route path="/available-rooms" element={<AvailableRooms onLogout={handleLogout} />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            token && userRole === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-food-order" element={<AdminFoodOrder />} />

        <Route
          path="/room-allocation"
          element={
            token && userRole === 'admin' ? (
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar onLogout={handleLogout} />
                <div className="flex-1 lg:ml-64">
                  <RoomAllocation token={token} />
                </div>
              </div>
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;