import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, AlertCircle, RefreshCw, CheckCircle, ChevronDown, UserPlus, Filter } from 'lucide-react';

export default function AdminComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [assignWorkers, setAssignWorkers] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchComplaints();
  }, [navigate, token, user.role]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status, assignedWorker) => {
    try {
      const body = {};
      if (status) body.status = status;
      if (assignedWorker !== undefined) body.assignedWorker = assignedWorker;

      const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchComplaints();
      }
    } catch (error) {
      console.error('Failed to update complaint', error);
    }
  };

  const filteredComplaints = complaints.filter(c => statusFilter === 'All' || c.status === statusFilter);
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'Done').length;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-10 px-2 text-slate-800 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-8 h-8 bg-cyan-600 rounded flex justify-center items-center text-white">
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
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 bg-cyan-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div onClick={() => navigate('/admin-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
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

      <div className="flex-1 flex flex-col min-w-0 px-8 py-8">
        <header className="rounded-[32px] bg-gradient-to-br from-cyan-700 via-slate-950 to-violet-700 text-white shadow-[0_32px_100px_rgba(15,23,42,0.25)] border border-white/10 p-8 mb-10 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"></div>
          <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
          <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200 font-semibold">Admin Complaints</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">Complaints & Maintenance Management</h1>
              <p className="mt-4 max-w-2xl text-cyan-100/90">Track, assign, and resolve student issues with clear oversight and friendly action tools.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-white/10 border border-white/10 p-5 text-center shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100 font-semibold">Total</p>
                <p className="mt-3 text-3xl font-bold">{totalCount}</p>
              </div>
              <div className="rounded-[24px] bg-cyan-500/10 border border-cyan-200 p-5 text-center shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100 font-semibold">Pending</p>
                <p className="mt-3 text-3xl font-bold">{pendingCount}</p>
              </div>
              <div className="rounded-[24px] bg-violet-500/10 border border-violet-200 p-5 text-center shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-violet-100 font-semibold">Resolved</p>
                <p className="mt-3 text-3xl font-bold">{resolvedCount}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 shadow-sm">
                  <AlertCircle size={20} />
                </span>
                Complaints & Maintenance Management
              </h2>
              <p className="text-slate-500 max-w-2xl">Track, assign, and resolve student issues with confidence.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Filter size={14}/> Filter Status</label>
                <select 
                  className="border border-slate-300 rounded-3xl px-4 py-3 text-slate-700 outline-none focus:border-cyan-500 bg-white shadow-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Complaints</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Resolved</option>
                </select>
              </div>
              <button 
                onClick={fetchComplaints}
                className="mt-2 sm:mt-0 inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white px-4 py-3 font-semibold shadow-lg transition hover:from-cyan-700 hover:to-violet-700"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="bg-white/95 rounded-[32px] shadow-[0_30px_80px_rgba(59,130,246,0.15)] border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-100 to-violet-100 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-bold w-1/4">Student & Details</th>
                  <th className="p-4 border-b font-bold w-1/3">Issue description</th>
                  <th className="p-4 border-b font-bold">Category</th>
                  <th className="p-4 border-b font-bold">Assignment</th>
                  <th className="p-4 border-b font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint._id} className="transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-50 group border-b border-slate-200 last:border-0">
                    <td className="p-4 align-top">
                      <div className="font-semibold text-slate-900 text-base">{complaint.anonymous ? 'Anonymous Student' : complaint.displayName}</div>
                      <div className="flex items-center gap-1 mt-2 whitespace-nowrap text-sm text-slate-600">
                        <Home size={14} className="text-cyan-500" />
                        <span>
                          {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    
                    <td className="p-4 align-top max-w-sm">
                      <h3 className="font-semibold text-slate-900 mb-2 leading-snug">{complaint.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed max-h-28 overflow-hidden">{complaint.description}</p>
                    </td>

                    <td className="p-4 align-top">
                      <span className="inline-flex items-center justify-center rounded-full bg-cyan-100 text-cyan-700 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm">
                        {complaint.category}
                      </span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        <div className="relative w-full">
                          <input 
                            type="text" 
                            placeholder="Assign Worker"
                            value={assignWorkers[complaint._id] !== undefined ? assignWorkers[complaint._id] : complaint.assignedWorker || ''}
                            onChange={(e) => setAssignWorkers({ ...assignWorkers, [complaint._id]: e.target.value })}
                            className="w-full border border-slate-300 rounded-full px-10 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500 bg-white shadow-sm"
                          />
                          <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        {assignWorkers[complaint._id] !== undefined && assignWorkers[complaint._id] !== (complaint.assignedWorker || '') && (
                          <button 
                            onClick={() => {
                              handleUpdate(complaint._id, undefined, assignWorkers[complaint._id]);
                              const newVals = { ...assignWorkers };
                              delete newVals[complaint._id];
                              setAssignWorkers(newVals);
                            }}
                            className="w-full rounded-full bg-cyan-500 text-white text-xs font-bold uppercase tracking-wide py-2 transition hover:bg-cyan-600"
                          >
                            Save assignment
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 align-top text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide w-full text-center ${complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-cyan-100 text-cyan-700 border border-cyan-200'}`}>
                          {complaint.status}
                        </span>
                        
                        {complaint.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdate(complaint._id, 'Done')}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-slate-900 text-white px-3 py-2 text-xs font-semibold transition hover:bg-slate-800 shadow-sm"
                          >
                            <CheckCircle size={14} /> Mark Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredComplaints.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-500 text-lg bg-slate-50/50">
                    <CheckCircle size={48} className="mx-auto mb-3 text-emerald-200" />
                    No complaints found.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
