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

export default function StudentSidebar({ activeKey, onLogout }) {
  const navigate = useNavigate();

  return (
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
