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
import './index.css';
import RoomAllocation from './pages/RoomAllocation';
import AvailableRooms from './pages/AvailableRooms';
import Sidebar from './components/Sidebar';

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
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-attendance" element={<StudentAttendance />} />
        <Route path="/student-food-order" element={<FoodOrderSystem />} />
        <Route path="/student-payments" element={<StudentPayments />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-food-order" element={<AdminFoodOrder />} />
              {/* 2. Admin Routes - Admin ට විතරයි යන්න පුළුවන් */}
        <Route
          path="/room-allocation"
          element={
            token && userRole === 'admin' ? (
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar onLogout={handleLogout} />
                <div className="flex-1 lg:ml-64"> {/* Sidebar එක නිසා ඉඩ තබනවා */}
                  <RoomAllocation token={token} />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/available-rooms"
          element={
            <AvailableRooms onLogout={handleLogout} />
          }
        />


        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;