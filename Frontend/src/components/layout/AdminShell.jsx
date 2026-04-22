import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ activeKey, title, subtitle, children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!token) return;

    let mounted = true;
    const fetchUnreadNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!mounted) return;
        const unreadCount = Array.isArray(data) ? data.filter((n) => !n.isRead).length : 0;
        setUnreadNotifications(unreadCount);
      } catch {
        if (mounted) setUnreadNotifications(0);
      }
    };

    fetchUnreadNotifications();
    const intervalId = setInterval(fetchUnreadNotifications, 30000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <AdminSidebar activeKey={activeKey} onLogout={handleLogout} unreadNotifications={unreadNotifications} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-5 shadow-sm flex justify-between items-center">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-slate-600 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin-notifications')}
              className={`relative rounded-full border p-2 transition ${unreadNotifications > 0 ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </button>
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

