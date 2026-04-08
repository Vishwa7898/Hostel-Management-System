import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

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

  const unpaidOrders = orders.filter(o => o.paymentStatus === 'unpaid' || !o.paymentStatus);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

  return (
    <StudentShell activeKey="payments" title="Payments & History">
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
    </StudentShell>
  );
}