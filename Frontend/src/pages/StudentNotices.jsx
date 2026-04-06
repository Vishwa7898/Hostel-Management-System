import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

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
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed selection:bg-teal-200 selection:text-teal-900"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-[1400px] mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/20 flex relative">
        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 h-[76px] bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex justify-between items-center px-8 z-30 rounded-t-[2rem] shadow-sm">
          <div className="font-black text-3xl tracking-tight flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/student-dashboard')}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            </div>
            <span>Stay<span className="text-teal-100">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 bg-slate-50/50 border-r border-slate-200/50 flex flex-col pt-28 pb-8 px-5 relative z-20 hidden md:flex backdrop-blur-xl">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black mb-6 shadow-sm">
              <span>Student Portal</span>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/student-profile')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <User size={20} />
              <span>Profile</span>
            </div>
            <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <Calendar size={20} />
              <span>Attendance</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <Home size={20} />
              <span>Room Details</span>
            </div>
            <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <MessageSquare size={20} />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div onClick={() => navigate('/student-notices')} className="flex items-center space-x-3 px-4 py-3.5 bg-gradient-to-r from-teal-50 to-emerald-50/50 text-teal-700 rounded-xl cursor-pointer transition-all font-bold shadow-sm border border-teal-100/50 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-r-md"></div>
              <Bell size={20} className="text-teal-600 group-hover:scale-110 transition-transform" />
              <span>Notices</span>
            </div>
            <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <UtensilsCrossed size={20} />
              <span>Food Order</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-200/50">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50/80 hover:text-red-600 rounded-xl cursor-pointer transition-all font-bold">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-28 px-6 md:px-10 pb-10 overflow-y-auto w-full relative z-10 bg-slate-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600 tracking-tight flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Bell size={36} className="text-teal-500" />
                  </div>
                  Maintenance Notices
                </h1>
                <p className="text-slate-500 font-medium text-lg mt-3 ml-2">Stay updated with the latest announcements regarding hostel maintenance.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={fetchNotices} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <RefreshCw size={18} className={`${loading ? 'animate-spin text-teal-600' : 'text-slate-500'}`} /> 
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button onClick={markAllAsRead} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 active:scale-95 border border-teal-500 flex items-center gap-2">
                  <CheckCircle size={18} /> Mark all as read
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 md:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
              
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <Bell size={18} strokeWidth={3} />
                  </span>
                  <h2 className="text-2xl font-black text-slate-800">Recent Updates</h2>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/90 px-3 py-1.5 rounded-lg border border-emerald-100 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[12px] font-black uppercase tracking-widest text-emerald-700">{unreadCount} unread</span>
                </div>
              </div>

              {error && <div className="mb-6 bg-red-50/80 backdrop-blur-sm text-red-600 px-5 py-4 rounded-2xl font-semibold border border-red-100 flex items-center gap-3"><AlertCircle size={20} /> {error}</div>}

              {loading && notices.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <RefreshCw size={50} className="mx-auto mb-4 text-teal-300 animate-spin" />
                  <p className="text-lg font-medium">Loading updates for you...</p>
                </div>
              ) : notices.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                    <CheckCircle size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">You're All Caught Up</h3>
                  <p className="text-slate-500 font-medium">No new maintenance notices are available.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {notices.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full text-left rounded-2xl px-6 py-6 transition-all duration-300 relative group overflow-hidden ${
                        readMap[n.id] 
                          ? 'bg-slate-50/50 border border-slate-200/60 shadow-sm opacity-80 hover:opacity-100' 
                          : 'bg-white border-2 border-teal-400 hover:border-teal-500 shadow-md hover:shadow-lg hover:-translate-y-1'
                      }`}
                    >
                      {!readMap[n.id] && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-400 to-emerald-500"></div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${readMap[n.id] ? 'text-slate-700' : 'text-slate-900 group-hover:text-teal-700 transition-colors'}`}>
                              {n.title}
                            </h3>
                            {!readMap[n.id] && (
                              <span className="text-[10px] tracking-widest uppercase font-black px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse flex items-center gap-1">
                                NEW
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/80">
                              <Calendar size={14} className="text-slate-400" />
                              {new Date(n.time).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/80">
                              <User size={14} className="text-slate-400" />
                              By: {n.author}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className={`text-[15px] leading-relaxed whitespace-pre-wrap mt-4 p-4 rounded-xl ${readMap[n.id] ? 'bg-white text-slate-600 border border-slate-100' : 'bg-teal-50/50 text-slate-700 border border-teal-100/50'}`}>
                        {n.message}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}