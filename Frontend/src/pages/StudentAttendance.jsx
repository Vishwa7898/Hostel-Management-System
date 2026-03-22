import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Edit, Trash2, X } from 'lucide-react';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ purpose: '', description: '', expectedReturnDate: '', expectedReturnTime: '' });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (rec) => {
    const expected = rec.expectedReturn ? new Date(rec.expectedReturn) : null;
    let expectedReturnDate = '';
    let expectedReturnTime = '';
    if (expected) {
      expectedReturnDate = expected.toISOString().split('T')[0];
      expectedReturnTime = expected.toTimeString().substring(0, 5);
    }
    setEditForm({
      purpose: rec.purpose || '',
      description: rec.description || '',
      expectedReturnDate,
      expectedReturnTime
    });
    setEditingRecord(rec);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    const body = {
      purpose: editForm.purpose,
      description: editForm.description,
      expectedReturn: editForm.expectedReturnDate && editForm.expectedReturnTime 
        ? `${editForm.expectedReturnDate}T${editForm.expectedReturnTime}:00` 
        : null
    };

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${editingRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingRecord(null);
        fetchAttendance();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Server error updating record.');
    }
  };

  return (
    <div 
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
              <span>Dashboard</span>
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
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Calendar size={20} />
              <span>Attendance</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Home size={20} />
              <span>Room Details</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <MessageSquare size={20} />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div
              onClick={() => navigate(['Admin', 'Warden', 'Accountant'].includes(user.role) ? '/admin-food-order' : '/student-food-order')}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium"
            >
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

        {/* Main Content */}
        <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">My Attendance History</h1>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-semibold">Date</th>
                  <th className="p-4 border-b font-semibold">Check Out Time</th>
                  <th className="p-4 border-b font-semibold">Check In Time</th>
                  <th className="p-4 border-b font-semibold">Status</th>
                  <th className="p-4 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record._id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                    <td className="p-4 text-slate-600 font-medium">{record.date}</td>
                    <td className="p-4 text-slate-600">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="p-4 text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${record.status === 'Inside' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <button onClick={() => openEditModal(record)} className="text-blue-500 hover:text-blue-700 transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(record._id)} className="text-red-500 hover:text-red-700 transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-500 text-lg">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setEditingRecord(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Record - {editingRecord.date}</h2>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Purpose</label>
                <select value={editForm.purpose} onChange={e => setEditForm({...editForm, purpose: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none text-sm font-semibold text-slate-600">
                  <option value="Home">Home</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none text-sm font-semibold text-slate-600 h-24 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Expected Date</label>
                  <input type="date" value={editForm.expectedReturnDate} onChange={e => setEditForm({...editForm, expectedReturnDate: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Expected Time</label>
                  <input type="time" value={editForm.expectedReturnTime} onChange={e => setEditForm({...editForm, expectedReturnTime: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#369567] hover:bg-[#2b7953] text-white py-3 rounded-xl font-bold text-lg mt-4 shadow-sm transition-all">
                Update Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
