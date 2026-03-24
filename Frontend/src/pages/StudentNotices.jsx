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
      const [complaintsRes, attendanceRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/complaints/my', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/attendance/my', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/food/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const complaintsData = complaintsRes.ok ? await complaintsRes.json() : [];
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : [];
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      const complaintNotices = (Array.isArray(complaintsData) ? complaintsData : []).slice(0, 8).map((c) => ({
        id: `complaint-${c._id}`,
        title: `Complaint ${c.status || 'Pending'}`,
        message: `${c.title || 'Complaint'}${c.assignedWorker ? ` - Assigned to ${c.assignedWorker}` : ''}`,
        time: c.updatedAt || c.createdAt || new Date().toISOString(),
        type: c.status === 'Done' ? 'success' : 'info'
      }));

      const attendanceNotices = (Array.isArray(attendanceData) ? attendanceData : []).slice(0, 6).map((a) => ({
        id: `attendance-${a._id}`,
        title: `Attendance ${a.status || ''}`.trim(),
        message: a.checkInTime ? 'Check-in recorded successfully.' : 'Check-out recorded successfully.',
        time: a.checkInTime || a.checkOutTime || new Date().toISOString(),
        type: a.checkInTime ? 'success' : 'warning'
      }));

      const orderNotices = (Array.isArray(ordersData) ? ordersData : []).slice(0, 6).map((o) => ({
        id: `order-${o._id}`,
        title: `Food Order ${o.status || 'pending'}`,
        message: `Total Rs. ${o.totalAmount || 0} - ${(o.items || []).length} item(s).`,
        time: o.updatedAt || o.createdAt || new Date().toISOString(),
        type: o.status === 'cancelled' ? 'warning' : o.status === 'served' ? 'success' : 'info'
      }));

      const merged = [...complaintNotices, ...attendanceNotices, ...orderNotices].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setNotices(merged);
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
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-sky-100 text-sky-700'
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
              <span>Notices</span>
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
            <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
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
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
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
          <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8">My Notices</h1>

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

            {notices.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle size={44} className="mx-auto mb-3 text-slate-300" />
                <p>No notices available.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full text-left border rounded-2xl px-4 py-4 transition-colors ${readMap[n.id] ? 'bg-slate-50 border-slate-200' : 'bg-white border-teal-200 hover:bg-teal-50/40'}`}
                  >
                    <div className="flex justify-between gap-3 items-start">
                      <div>
                        <h3 className="font-bold text-slate-800">{n.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${badgeClasses[n.type] || badgeClasses.info}`}>
                        {readMap[n.id] ? 'READ' : 'NEW'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{new Date(n.time).toLocaleString()}</p>
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
