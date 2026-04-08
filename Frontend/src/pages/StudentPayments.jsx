import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, LayoutDashboard, User, CreditCard, UtensilsCrossed, ArrowRight, CheckCircle, Clock, Calendar, MessageSquare, Bell } from 'lucide-react';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', tea: 'Tea' };

export default function StudentPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/food/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const unpaidOrders = orders.filter(o => o.paymentStatus === 'unpaid' || !o.paymentStatus);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

  return (
    <div
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">
        {/* Top Header Bar inside the card */}
        <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/student-dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <span>Welcome, {user.name} (Student ID: {user.studentId || `STU${(user._id || "000").substring(0,6)}`})</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
              <span>Payments</span>
              <span className="text-xs text-slate-500 font-bold">Menu</span>
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
            <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <UtensilsCrossed size={20} />
              <span>Food Order</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-teal-700 font-bold rounded-lg cursor-pointer transition-colors">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div onClick={() => navigate('/student-notices')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Bell size={20} />
              <span>Notices</span>
            </div>
          </div>
          <div className="mt-8">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto min-w-0">
          <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8">
            Payments <span className="text-orange-600">& History</span>
          </h1>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Unpaid Orders</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{unpaidOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock size={24} className="text-amber-600" />
                </div>
              </div>
              <button
                onClick={() => navigate('/student-food-order')}
                className="mt-4 text-amber-600 font-medium text-sm hover:underline flex items-center gap-1"
              >
                Pay Now <ArrowRight size={14} />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Paid Orders</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{paidOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="mt-4 text-slate-600">Loading payment history...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Unpaid Orders */}
              {unpaidOrders.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <h2 className="text-lg font-bold text-slate-800 px-6 py-4 border-b border-slate-100">Pending Payment</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm font-medium">
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Meal</th>
                          <th className="px-6 py-3">Items</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidOrders.map((o) => (
                          <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-medium">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
                            <td className="px-6 py-4">{MEAL_LABELS[o.mealTime] || o.mealTime}</td>
                            <td className="px-6 py-4 text-sm">
                              {o.items?.map((i, idx) => (
                                <span key={idx}>{i.foodItem?.name || 'Item'} x{i.quantity}{idx < (o.items?.length || 0) - 1 ? ', ' : ''}</span>
                              ))}
                            </td>
                            <td className="px-6 py-4 font-semibold">Rs. {o.totalAmount}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => navigate('/student-food-order')}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm"
                              >
                                Pay Now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payment History */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-slate-800 px-6 py-4 border-b border-slate-100">Payment History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-40" />
                    <p>No payment history yet.</p>
                    <button onClick={() => navigate('/student-food-order')} className="mt-3 text-orange-500 font-medium hover:underline">
                      Order food to get started
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm font-medium">
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Meal</th>
                          <th className="px-6 py-3">Items</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-medium">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
                            <td className="px-6 py-4">{MEAL_LABELS[o.mealTime] || o.mealTime}</td>
                            <td className="px-6 py-4 text-sm">
                              {o.items?.map((i, idx) => (
                                <span key={idx}>{i.foodItem?.name || 'Item'} x{i.quantity}{idx < (o.items?.length || 0) - 1 ? ', ' : ''}</span>
                              ))}
                            </td>
                            <td className="px-6 py-4 font-semibold">Rs. {o.totalAmount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                o.status === 'served' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {o.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {o.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}