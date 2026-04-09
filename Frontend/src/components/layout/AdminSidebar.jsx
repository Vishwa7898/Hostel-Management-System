import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Home,
  MessageSquare,
  CreditCard,
  Bell,
  UtensilsCrossed,
  LogOut,
  ChevronDown
} from 'lucide-react';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin-dashboard' },
  { key: 'profile', label: 'Profile', icon: User, to: '/admin-profile' },
  { key: 'attendance', label: 'Attendance', icon: Calendar, to: '/admin-dashboard' },
  { key: 'rooms', label: 'Room Details', icon: Home, to: '/admin-rooms' },
  { key: 'complaints', label: 'Complaints', icon: MessageSquare, to: '/admin-complaints' },
  { key: 'payments', label: 'Payments', icon: CreditCard, to: '/admin-payments' },
  { key: 'notices', label: 'Maintenance Notices', icon: Bell, to: '/admin-notices' },
  { key: 'food', label: 'Food Order', icon: UtensilsCrossed, to: '/admin-food-order' }
];

export default function AdminSidebar({ activeKey, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
      <button
        type="button"
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center space-x-2 font-black text-2xl mb-8 px-2 text-slate-900"
      >
        <span className="w-9 h-9 bg-orange-500 rounded-xl flex justify-center items-center text-white shadow-sm">
          <Home size={18} />
        </span>
        <span>
          <span className="text-slate-900">Stay</span>
          <span className="text-orange-500">Sphere</span>
        </span>
      </button>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold mb-3 border border-slate-200">
        <span className="text-sm tracking-wide uppercase">Admin Menu</span>
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
                active ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'
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
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

