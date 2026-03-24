import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, RefreshCw, CheckCircle } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readMap, setReadMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminNoticesReadMap') || '{}');
    } catch {
      return {};
    }
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchNotices();
  }, [navigate, token, user.role]);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const [complaintsRes, attendanceRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/complaints', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/attendance', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/food/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const complaintsData = complaintsRes.ok ? await complaintsRes.json() : [];
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : [];
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      const complaintNotices = (Array.isArray(complaintsData) ? complaintsData : []).slice(0, 10).map((c) => ({
        id: `complaint-${c._id}`,
        title: c.status === 'Pending' ? 'New Pending Complaint' : 'Complaint Updated',
        message: `${c.title || 'Complaint'}${c.displayName ? ` by ${c.displayName}` : ''}`,
        time: c.updatedAt || c.createdAt || new Date().toISOString(),
        type: c.status === 'Pending' ? 'warning' : 'success'
      }));

      const attendanceNotices = (Array.isArray(attendanceData) ? attendanceData : []).slice(0, 8).map((a) => ({
        id: `attendance-${a._id}`,
        title: `Attendance Record - ${a.status || 'Unknown'}`,
        message: `${a.user?.name || 'Student'} (${a.user?.studentId || 'N/A'})`,
        time: a.checkInTime || a.checkOutTime || new Date().toISOString(),
        type: a.status === 'Outside' ? 'warning' : 'info'
      }));

      const orderNotices = (Array.isArray(ordersData) ? ordersData : []).slice(0, 8).map((o) => ({
        id: `order-${o._id}`,
        title: `Food Order ${o.status || 'pending'}`,
        message: `${o.user?.name || 'Student'} - Rs. ${o.totalAmount || 0}`,
        time: o.updatedAt || o.createdAt || new Date().toISOString(),
        type: o.status === 'cancelled' ? 'warning' : o.status === 'served' ? 'success' : 'info'
      }));

      const merged = [...complaintNotices, ...attendanceNotices, ...orderNotices].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setNotices(merged);
    } catch {
      setError('Unable to load admin notices right now.');
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
    localStorage.setItem('adminNoticesReadMap', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = { ...readMap };
    notices.forEach((n) => {
      updated[n.id] = true;
    });
    setReadMap(updated);
    localStorage.setItem('adminNoticesReadMap', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  const badgeClasses = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-sky-100 text-sky-700'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-10 px-2 text-slate-800 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-8 h-8 bg-orange-500 rounded flex justify-center items-center text-white">
            <Home size={18} />
          </div>
          <span><span className="text-gray-500">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
        </div>

        <div className="flex-1 space-y-2">
          <div onClick={() => navigate('/admin-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/admin-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Bell size={20} />
            <span>Notices</span>
          </div>
          <div onClick={() => navigate('/admin-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <UtensilsCrossed size={20} />
            <span>Food Order</span>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Admin <span className="text-orange-500">Notices</span></h1>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-800 leading-none">{user.name}</span>
              <span className="text-xs text-slate-500">{user.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
              <div className="flex items-center gap-2">
                <Bell className="text-orange-500" />
                <span className="font-bold text-slate-700">{unreadCount} unread</span>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchNotices} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-2">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
                <button onClick={markAllAsRead} className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium">
                  Mark all as read
                </button>
              </div>
            </div>

            {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg font-medium text-sm">{error}</div>}

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
                    className={`w-full text-left border rounded-xl px-4 py-4 transition-colors ${readMap[n.id] ? 'bg-slate-50 border-slate-200' : 'bg-white border-orange-200 hover:bg-orange-50/40'}`}
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
        </main>
      </div>
    </div>
  );
}
