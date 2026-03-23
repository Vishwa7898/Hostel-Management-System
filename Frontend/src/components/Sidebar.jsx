import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/');
    }
  };

  return (
    <div className="w-64 bg-slate-800 h-screen fixed top-0 left-0 text-white flex flex-col hidden lg:flex">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          ADMIN<span className="text-white">PANEL</span>
        </h2>
      </div>
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        <Link to="/admin-dashboard" className="px-4 py-3 rounded-xl hover:bg-slate-700 transition font-semibold text-slate-300">
          Dashboard
        </Link>
        <Link to="/room-allocation" className="px-4 py-3 rounded-xl hover:bg-slate-700 transition font-semibold text-slate-300">
          Room Allocation
        </Link>
        <Link to="/admin-food-order" className="px-4 py-3 rounded-xl hover:bg-slate-700 transition font-semibold text-slate-300">
          Food Orders
        </Link>
      </div>
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={handleSignOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
