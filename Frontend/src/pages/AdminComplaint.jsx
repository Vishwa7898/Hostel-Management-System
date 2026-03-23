import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, AlertCircle, RefreshCw, CheckCircle, ChevronDown, UserPlus, Filter } from 'lucide-react';

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
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
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
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Admin <span className="text-orange-500">Complaints</span></h1>
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
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center space-x-2">
                <AlertCircle size={24} className="text-orange-500" />
                <span>Complaints & Maintenance Management</span>
              </h2>
              <p className="text-slate-500">Track, assign, and resolve student issues.</p>
            </div>
            <div className="flex space-x-3 items-center">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1"><Filter size={14}/> Filter Status</label>
                <select 
                  className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-orange-500 bg-white shadow-sm"
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
                className="mt-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors shadow-sm text-sm font-medium"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-bold w-1/4">Student & Details</th>
                  <th className="p-4 border-b font-bold w-1/3">Issue description</th>
                  <th className="p-4 border-b font-bold">Category</th>
                  <th className="p-4 border-b font-bold">Assignment</th>
                  <th className="p-4 border-b font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint._id} className="hover:bg-slate-50/80 border-b border-slate-100 last:border-0 transition-colors group">
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-800 text-base">{complaint.anonymous ? 'Anonymous Student' : complaint.displayName}</div>
                      <div className="flex items-center gap-1 mt-1.5 whitespace-nowrap">
                        <Home size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">
                          {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">
                        {new Date(complaint.createdAt).toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="p-4 align-top max-w-sm">
                      <h3 className="font-bold text-slate-800 mb-1 leading-snug">{complaint.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed max-h-20 flex-1">{complaint.description}</p>
                    </td>

                    <td className="p-4 align-top">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                        {complaint.category}
                      </span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        <div className="flex flex-col relative w-full">
                          <input 
                            type="text" 
                            placeholder="Assign Worker"
                            value={assignWorkers[complaint._id] !== undefined ? assignWorkers[complaint._id] : complaint.assignedWorker || ''}
                            onChange={(e) => setAssignWorkers({ ...assignWorkers, [complaint._id]: e.target.value })}
                            className="border border-slate-300 rounded-lg px-8 py-2 text-sm text-slate-700 outline-none focus:border-orange-500 bg-white shadow-sm w-full"
                          />
                          <UserPlus size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                        </div>
                        {assignWorkers[complaint._id] !== undefined && assignWorkers[complaint._id] !== (complaint.assignedWorker || '') && (
                          <button 
                            onClick={() => {
                              handleUpdate(complaint._id, undefined, assignWorkers[complaint._id]);
                              const newVals = { ...assignWorkers };
                              delete newVals[complaint._id];
                              setAssignWorkers(newVals);
                            }}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded w-full transition-colors"
                          >
                            Save assignment
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 align-top text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide w-full text-center ${complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                          {complaint.status}
                        </span>
                        
                        {complaint.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdate(complaint._id, 'Done')}
                            className="flex items-center justify-center gap-1.5 w-full bg-[#18181b] hover:bg-[#3f3f46] text-white px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
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
