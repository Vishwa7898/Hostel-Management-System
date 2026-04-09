import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard
} from 'lucide-react';
import AdminShell from '../components/layout/AdminShell';

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

  return (
    <AdminShell activeKey="payments" title="Payments Overview">
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
    </AdminShell>
  );
}

