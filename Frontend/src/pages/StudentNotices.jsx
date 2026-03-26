import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, CheckCircle, RefreshCw } from 'lucide-react';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readMap, setReadMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studentNoticesReadMap') || '{}');
    } catch {
      return {};
    }
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchNotices();
  }, [navigate, token, user.role]);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/notices', { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!res.ok) {
        throw new Error('Failed to fetch notices');
      }

      const noticesData = await res.json();
      
      const formattedNotices = (Array.isArray(noticesData) ? noticesData : []).map((n) => ({
        id: `notice-${n._id}`,
        title: n.title || 'Maintenance Notice',
        message: n.description || '',
        time: n.date || n.createdAt || new Date().toISOString(),
        author: n.author || 'Admin',
        type: 'info'
      }));

      const sorted = formattedNotices.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setNotices(sorted);
    } catch {
      setError('Unable to load notices right now.');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = useMemo(
    () => notices.filter((n) => !readMap[n.id]).length,
    [notices, readMap]
  );

  const markAsRead = (id) => {
    const updated = { ...readMap, [id]: true };
    setReadMap(updated);
    localStorage.setItem('studentNoticesReadMap', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = { ...readMap };
    notices.forEach((n) => {
      updated[n.id] = true;
    });
    setReadMap(updated);
    localStorage.setItem('studentNoticesReadMap', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const badgeClasses = {
    info: 'bg-teal-100 text-teal-800 border border-teal-200'
  };

  return (
    <div
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">
        <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/student-dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
              <span>Maintenance Notices</span>
              <ChevronDown size={18} />
            </div>
            <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/student-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <User size={20} />
              <span>Profile</span>
            </div>
            <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Calendar size={20} />
              <span>Attendance</span>
            </div>
            <div onClick={() => navigate('/student-rooms')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Home size={20} />
              <span>Room Details</span>
            </div>
            <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <MessageSquare size={20} />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-teal-700 font-bold rounded-lg cursor-pointer transition-colors">
              <Bell size={20} />
              <span>Notices</span>
            </div>
            <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <UtensilsCrossed size={20} />
              <span>Food Order</span>
            </div>
          </div>
          <div className="mt-8">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto w-full">
          <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8">Maintenance Notices</h1>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
              <div className="flex items-center gap-2">
                <Bell className="text-teal-600" />
                <span className="font-bold text-slate-700">{unreadCount} unread</span>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchNotices} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
                <button onClick={markAllAsRead} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium">
                  Mark all as read
                </button>
              </div>
            </div>

            {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-medium text-sm">{error}</div>}

            {loading && notices.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <RefreshCw size={44} className="mx-auto mb-3 text-slate-300 animate-spin" />
                <p>Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                <CheckCircle size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">You're All Caught Up</h3>
                <p>No new maintenance notices are available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full text-left border rounded-2xl px-5 py-5 transition-all shadow-sm ${readMap[n.id] ? 'bg-slate-50 border-slate-200' : 'bg-white border-teal-300 hover:bg-teal-50 hover:-translate-y-0.5 shadow-md'}`}
                  >
                    <div className="flex justify-between gap-4 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-800">{n.title}</h3>
                          {!readMap[n.id] && (
                            <span className={`text-[10px] tracking-wide uppercase font-bold px-2 py-0.5 rounded shadow-sm ${badgeClasses.info}`}>
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">{n.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/60">
                      <span className="text-xs font-medium text-slate-500">From: <span className="text-slate-700">{n.author}</span></span>
                      <span className="text-xs font-medium text-slate-400">{new Date(n.time).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
