import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, AlertCircle, RefreshCw, CheckCircle, ChevronDown, UserPlus, Filter, Clock } from 'lucide-react';

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
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Sidebar Focus on modern clean look */}
      <div className="w-64 bg-white/70 backdrop-blur-2xl border-r border-slate-200/50 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.01)] z-20">
        <div className="flex items-center space-x-3 font-black text-2xl mb-10 px-2 cursor-pointer group transition-all" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex justify-center items-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Home size={18} strokeWidth={2.5} />
          </div>
          <span className="tracking-tight text-slate-800 hover:opacity-80 transition-opacity">Stay<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Sphere</span></span>
        </div>
        
        <div className="flex-1 space-y-1.5">
          <div onClick={() => navigate('/admin-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/admin-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-700 rounded-xl cursor-pointer transition-all font-bold shadow-sm border border-orange-100/50 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md"></div>
            <MessageSquare size={20} className="text-orange-500" />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div onClick={() => navigate('/admin-notices')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <AlertCircle size={20} />
            <span>Notices</span>
          </div>
          <div onClick={() => navigate('/admin-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <UtensilsCrossed size={20} />
            <span>Food Order</span>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200/50 pt-4">
          <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-all font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-teal-300/10 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 p-5 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-black tracking-tight text-slate-800 hidden sm:block flex items-center gap-2">
            Complaints <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Center</span>
          </h1>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-800 leading-none">{user.name}</span>
              <span className="text-xs text-slate-500 mt-1 font-medium">{user.role || 'Admin'}</span>
            </div>
            <div className="w-11 h-11 bg-gradient-to-tr from-orange-100 to-orange-50 text-orange-600 border border-orange-200 rounded-full flex items-center justify-center font-bold text-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden relative z-0">
          <div className="max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <AlertCircle size={28} className="text-orange-500" strokeWidth={2.5} />
                  </div>
                  System Maintenance
                </h2>
                <p className="text-slate-500 font-medium text-lg max-w-2xl">Track, assign, and quickly resolve student issues to keep the hostel running smoothly.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-48">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Filter size={14}/> Status Filter</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-white border border-slate-200 hover:border-orange-300 rounded-xl pl-4 pr-10 py-2.5 text-slate-700 font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Complaints</option>
                      <option value="Pending">Pending Action</option>
                      <option value="Done">Resolved</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button 
                  onClick={fetchComplaints}
                  className="mt-6 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm font-bold active:scale-95"
                >
                  <RefreshCw size={18} className={`${loading ? 'animate-spin text-orange-500' : 'text-slate-500'}`} /> 
                  <span className="hidden sm:inline">Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80">
                      <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Student Info</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-widest w-1/3">Issue Details</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Assignee</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-widest text-right">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && complaints.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <RefreshCw size={40} className="mx-auto text-orange-300 animate-spin mb-4" />
                          <p className="text-slate-500 font-medium">Loading records...</p>
                        </td>
                      </tr>
                    ) : filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle size={40} className="text-emerald-400" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">All Caught Up!</h3>
                          <p className="text-slate-500">No complaints found matching your criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map(complaint => (
                        <tr key={complaint._id} className="hover:bg-orange-50/30 transition-colors group">
                          {/* Student Info */}
                          <td className="px-6 py-5 align-top">
                            <div className="font-bold text-slate-800 text-[15px] mb-1.5">{complaint.anonymous ? 'Ghost Student' : complaint.displayName}</div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-100/80 w-max px-2.5 py-1 rounded-lg mb-2 border border-slate-200/60">
                              <Home size={14} className="text-slate-500" />
                              <span className="text-[13px] font-bold text-slate-600">
                                {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                              <Clock size={12} />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          
                          {/* Issue Details */}
                          <td className="px-6 py-5 align-top">
                            <h3 className="font-bold text-slate-900 text-[15px] mb-1.5 leading-snug group-hover:text-orange-600 transition-colors">{complaint.title}</h3>
                            <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-2 md:line-clamp-none">{complaint.description}</p>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-5 align-top">
                            <span className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/80 inline-block shadow-sm">
                              {complaint.category}
                            </span>
                          </td>

                          {/* Assignment */}
                          <td className="px-6 py-5 align-top">
                            <div className="flex flex-col gap-2 relative w-full sm:w-48">
                              <div className="relative group/input">
                                <input 
                                  type="text" 
                                  placeholder="Assign Worker..."
                                  value={assignWorkers[complaint._id] !== undefined ? assignWorkers[complaint._id] : complaint.assignedWorker || ''}
                                  onChange={(e) => setAssignWorkers({ ...assignWorkers, [complaint._id]: e.target.value })}
                                  className="w-full bg-white border border-slate-200 group-hover/input:border-orange-300 rounded-xl pl-9 pr-3 py-2 text-[14px] font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-400"
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
                                  className="text-[12px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 py-1.5 px-3 rounded-lg w-full transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle size={14} /> Assign
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-5 align-top text-right">
                            <div className="flex flex-col items-end gap-2.5">
                              <div className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border shadow-sm ${
                                complaint.status === 'Done' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {complaint.status === 'Done' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                {complaint.status}
                              </div>
                              
                              {complaint.status === 'Pending' && (
                                <button 
                                  onClick={() => handleUpdate(complaint._id, 'Done')}
                                  className="flex items-center justify-center gap-1.5 w-[110px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-[12px] font-bold transition-all shadow-md hover:shadow-lg active:scale-95 border border-slate-700 hover:-translate-y-0.5"
                                >
                                  <CheckCircle size={14} /> Resolve 
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
