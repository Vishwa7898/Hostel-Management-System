import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-indigo-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/student-dashboard')}>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              HOSTEL<span className="text-slate-800">NAV</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              to="/student-dashboard" 
              className="text-slate-600 hover:text-indigo-600 font-semibold px-3 py-2 rounded-md transition-colors text-sm uppercase tracking-wide"
            >
              Dashboard
            </Link>
            <Link 
              to="/available-rooms" 
              className="text-slate-600 hover:text-indigo-600 font-semibold px-3 py-2 rounded-md transition-colors text-sm uppercase tracking-wide"
            >
              Rooms
            </Link>
            <Link 
              to="/student-food-order" 
              className="text-slate-600 hover:text-indigo-600 font-semibold px-3 py-2 rounded-md transition-colors text-sm uppercase tracking-wide"
            >
              Food Order
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm uppercase tracking-wide"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-500 hover:text-indigo-600 focus:outline-none p-2 rounded-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
