import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, UtensilsCrossed, ArrowRight } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', tea: 'Tea' };

export default function StudentDashboard() {
  const [records, setRecords] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [status, setStatus] = useState('Inside');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [purpose, setPurpose] = useState('Home');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchAttendance();
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/food/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMyOrders(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      setMyOrders([]);
    }
  };

  useEffect(() => {
    if (status === 'Inside') {
      const updateCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        setCheckOutDate(`${year}-${month}-${day}`);
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        setCheckOutTime(`${hours}:${minutes}`);
      };

      updateCurrentTime();
      const intervalId = setInterval(updateCurrentTime, 60000);
      return () => clearInterval(intervalId);
    }
  }, [status]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
      const today = getLocalDateString();
      const todayRecord = Array.isArray(data) ? data.find((r) => r.date === today) : null;
      setStatus(todayRecord ? todayRecord.status : 'Inside');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (status === 'Inside') {
      if (!checkOutDate || !checkOutTime) {
        return setError('Check-out time is required');
      }
      if (!expectedDate || !expectedTime) {
        return setError('Expected return is required');
      }
    }

    try {
      const endpoint = status === 'Inside' ? 'checkout' : 'checkin';
      const body = status === 'Inside' ? {
        purpose,
        description,
        expectedReturn: `${expectedDate}T${expectedTime}:00`
      } : {};

      const res = await fetch(`http://localhost:5000/api/attendance/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setError('');
        fetchAttendance();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const getCurrentDateTimeString = () => {
    const now = new Date();
    return `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
  };

  const today = getLocalDateString();
  const todayRecords = records.filter((r) => r.date === today);
  const latestTodayRecord = todayRecords.length > 0 ? todayRecords[0] : null;

  return (
    <StudentShell activeKey="dashboard" title="My Attendance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (Cards + Form) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Top Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Status Card Green */}
                <div className={`p-6 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between ${status === 'Inside' ? 'bg-[#31a369]' : 'bg-[#e76f3c]'}`}>
                  <div className="relative z-10">
                    <p className="text-lg opacity-90 mb-1">Currently</p>
                    <h2 className="text-3xl font-bold mb-6">{status === 'Inside' ? 'IN Hostel' : 'OUTSIDE'}</h2>
                    <p className="font-medium">{getCurrentDateTimeString()}</p>
                  </div>
                  <div className="absolute top-6 right-6 z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    {status === 'Inside' ? <CheckCircle size={40} className="text-white fill-[#4add8e]" /> : <Clock size={40} className="text-white" />}
                  </div>
                </div>

                {/* Action Card Orange */}
                <div className={`p-6 rounded-2xl flex flex-col justify-center items-center shadow-inner ${status === 'Inside' ? 'bg-gradient-to-br from-[#f6ad6b] to-[#eb8a55]' : 'bg-gradient-to-br from-[#4ddbae] to-[#2bad7f]'}`}>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {status === 'Inside' ? 'Go Outside?' : 'Return to Hostel?'}
                  </h3>
                  {status === 'Outside' && (
                    <button onClick={handleAction} className="bg-[#1f8763] hover:bg-[#186a4e] text-white w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-2">
                      Check-In Now
                    </button>
                  )}
                  {status === 'Inside' && (
                    <div className="bg-[#cc5b22] text-white w-full py-3 rounded-xl font-bold text-lg text-center shadow-sm opacity-90">
                      Fill Form Below
                    </div>
                  )}
                </div>

              </div>

              {/* Form Box */}
              {status === 'Inside' && (
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100 relative">
                  {error && (
                    <div className="absolute top-6 right-8 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleAction} className="space-y-6 mt-4 md:mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Check-Out Time */}
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Check-Out Time (Auto-filled) <span className="text-red-500">*</span></label>
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-100 cursor-not-allowed text-slate-500 opacity-90">
                          <input type="time" required value={checkOutTime} readOnly className="w-1/2 p-3 bg-transparent outline-none border-r border-slate-200 cursor-not-allowed pointer-events-none" />
                          <input type="date" required value={checkOutDate} readOnly className="w-1/2 p-3 bg-transparent outline-none cursor-not-allowed pointer-events-none" />
                        </div>
                      </div>

                      {/* Expected Return */}
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Expected Return <span className="text-red-500">*</span></label>
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 focus-within:border-teal-500 transition-colors">
                          <input type="time" required value={expectedTime} onChange={e => setExpectedTime(e.target.value)} className="w-1/2 p-3 bg-transparent outline-none border-r border-slate-200 text-slate-700" />
                          <input type="date" required min={getLocalDateString()} value={expectedDate} onChange={e => setExpectedDate(e.target.value)} className="w-1/2 p-3 bg-transparent outline-none text-slate-700" />
                        </div>
                      </div>
                    </div>

                    {/* Purpose Dropdown */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Purpose</label>
                      <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full md:w-1/2 p-3 border border-orange-200 rounded-xl bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none uppercase text-sm font-semibold text-slate-700 tracking-wide">
                        <option value="Home">Home</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Medical">Medical</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Description Details */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Description (Optional)</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Note for the warden (if any)..." 
                      className="w-full p-3 border border-orange-200 rounded-xl bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-medium text-slate-700 resize-none h-24"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] mt-4">
                      Confirm Check-Out
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Right Column (History) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full">
                <h3 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Recent History</h3>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-100 font-medium font-outfit">
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestTodayRecord && (
                        <tr key={latestTodayRecord._id} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-2 text-slate-700">
                            <div className="font-semibold text-sm">{latestTodayRecord.date}</div>
                            <div className="text-xs text-slate-400 mt-1 max-w-[120px] truncate" title={latestTodayRecord.purpose}>
                              {latestTodayRecord.purpose || (latestTodayRecord.status === 'Inside' ? 'Check In' : 'Check Out')}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            {latestTodayRecord.checkOutTime && (
                              <div className="mb-2">
                                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${latestTodayRecord.status === 'Outside' && !latestTodayRecord.checkInTime ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>Out</span>
                                <span className="text-xs text-slate-600 ml-2">{new Date(latestTodayRecord.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                            {latestTodayRecord.checkInTime && (
                              <div>
                                <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-teal-100 text-teal-600">In</span>
                                <span className="text-xs text-slate-600 ml-2 pb-1">{new Date(latestTodayRecord.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                            {latestTodayRecord.status === 'Outside' && !latestTodayRecord.checkInTime && (
                              <div>
                                <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-slate-100 text-slate-400 opacity-50">In</span>
                                <span className="text-xs text-slate-400 ml-2 pb-1">--:--</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                      {todayRecords.length === 0 && (
                        <tr><td colSpan="2" className="py-8 text-center text-slate-400 text-sm">No history yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* My Recent Orders */}
            <div className="mt-8 col-span-full">
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 font-outfit">My Recent Food Orders</h3>
                  <button
                    onClick={() => navigate('/student-food-order')}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Order Food <ArrowRight size={18} />
                  </button>
                </div>
                {myOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <UtensilsCrossed size={40} className="mx-auto mb-2 opacity-50" />
                    <p>No orders yet. Order your next meal!</p>
                    <button onClick={() => navigate('/student-food-order')} className="mt-3 text-orange-500 font-medium hover:underline">Go to Food Order</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-100 font-medium">
                          <th className="pb-3 px-2">Date</th>
                          <th className="pb-3 px-2">Meal</th>
                          <th className="pb-3 px-2">Items</th>
                          <th className="pb-3 px-2">Amount</th>
                          <th className="pb-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((o) => (
                          <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-2 text-slate-700 font-medium">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-4 px-2">{MEAL_LABELS[o.mealTime] || o.mealTime}</td>
                            <td className="py-4 px-2 text-sm">
                              {o.items?.map((i, idx) => (
                                <span key={idx}>{i.foodItem?.name || 'Item'} x{i.quantity}{idx < (o.items?.length || 0) - 1 ? ', ' : ''}</span>
                              ))}
                            </td>
                            <td className="py-4 px-2 font-semibold">Rs. {o.totalAmount}</td>
                            <td className="py-4 px-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                o.status === 'served' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {o.status || 'pending'}
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

          </div>
    </StudentShell>
  );
}
