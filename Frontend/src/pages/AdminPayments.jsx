import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  User,
  Home,
  MessageSquare,
  CreditCard,
  Calendar,
  UtensilsCrossed,
  Bell
} from 'lucide-react';

const PAYMENT_COLORS = {
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-amber-100 text-amber-700',
};

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPayment, setFilterPayment] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchOrders();
  }, [token, user.role]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/food/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const visibleOrders = useMemo(() => {
    if (!filterPayment) return orders;
    return orders.filter((o) => (o.paymentStatus || 'unpaid') === filterPayment);
  }, [orders, filterPayment]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
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
          <div onClick={() => navigate('/admin-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div onClick={() => navigate('/admin-rooms')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-black rounded-lg font-medium cursor-pointer transition-colors">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div onClick={() => navigate('/admin-notices')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
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
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
            Payments <span className="text-orange-500">Overview</span>
          </h1>
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-3">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
              >
                <option value="">All payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              className="px-4 py-2 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading payments...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                      <th className="p-4 border-b font-semibold">Order</th>
                      <th className="p-4 border-b font-semibold">Student</th>
                      <th className="p-4 border-b font-semibold">Room</th>
                      <th className="p-4 border-b font-semibold">Amount</th>
                      <th className="p-4 border-b font-semibold">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50 border-b last:border-0">
                        <td className="p-4 text-slate-600 text-sm font-mono">#{o._id?.slice(-6)}</td>
                        <td className="p-4 font-medium">{o.studentName || o.student?.name}</td>
                        <td className="p-4 text-slate-600">{o.hostelRoom}</td>
                        <td className="p-4 font-semibold">Rs. {o.totalAmount}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${PAYMENT_COLORS[o.paymentStatus] || PAYMENT_COLORS.unpaid}`}>
                            {o.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {visibleOrders.length === 0 && (
                      <tr><td colSpan="5" className="p-12 text-center text-slate-500">No payments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

