import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Home,
  MessageSquare,
  CreditCard,
  UtensilsCrossed,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/student-dashboard' },
  { key: 'profile', label: 'Profile', icon: User, to: '/student-profile' },
  { key: 'attendance', label: 'Attendance', icon: Calendar, to: '/student-attendance' },
  { key: 'rooms', label: 'Room Details', icon: Home, to: '/student-rooms' },
  { key: 'complaints', label: 'Complaints', icon: MessageSquare, to: '/student-complaints' },
  { key: 'payments', label: 'Payments', icon: CreditCard, to: '/student-payments' },
  { key: 'notices', label: 'Notices', icon: Bell, to: '/student-notices' },
  { key: 'food', label: 'Food Order', icon: UtensilsCrossed, to: '/student-food-order' }
];

export default function StudentShell({ activeKey, title, subtitle, children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage:
          "radial-gradient(1200px 600px at 10% 0%, rgba(20, 184, 166, 0.20), transparent 55%), radial-gradient(1000px 500px at 90% 10%, rgba(59, 130, 246, 0.18), transparent 50%), linear-gradient(to bottom right, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.92)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')"
      }}
    >
      <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 h-[76px] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-slate-900 flex justify-between items-center px-6 sm:px-8 z-20 rounded-t-3xl border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-3 font-black text-2xl sm:text-3xl tracking-tight"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
            </span>
            <span>
              <span className="text-slate-900">Stay</span>
              <span className="text-teal-600">Sphere</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-sm font-extrabold text-slate-900">{user.name || 'Student'}</span>
              <span className="text-xs font-semibold text-slate-500">
                {user.studentId || (user._id ? `ID: ${String(user._id).slice(-6)}` : 'Student')}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-extrabold">
              {(user.name || 'S').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-col pt-24 pb-6 px-5 relative z-10 hidden md:flex">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold mb-4 border border-slate-200">
            <span className="text-sm tracking-wide uppercase">Menu</span>
            <ChevronDown size={18} />
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors font-semibold',
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  ].join(' ')}
                >
                  <Icon size={20} className={active ? 'text-white' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 pt-24 px-5 sm:px-8 pb-8 overflow-y-auto min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm sm:text-base text-slate-600">{subtitle}</p>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

