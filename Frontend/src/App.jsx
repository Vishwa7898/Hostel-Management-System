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
import StudentComplaint from './pages/StudentComplaint';
import AdminComplaint from './pages/AdminComplaint';
import './index.css';

function App() {
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
        <Route path="/admin-complaints" element={<AdminComplaint />} />
        <Route path="/student-complaints" element={<StudentComplaint />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;