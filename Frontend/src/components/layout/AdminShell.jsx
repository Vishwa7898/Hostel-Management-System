import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ activeKey, title, subtitle, children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <AdminSidebar activeKey={activeKey} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-5 shadow-sm flex justify-between items-center">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-slate-600 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="font-extrabold text-sm text-slate-900">{user.name || 'Admin'}</span>
              <span className="text-xs text-slate-500">{user.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full border border-orange-100 flex items-center justify-center font-extrabold text-lg">
              {(user.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

