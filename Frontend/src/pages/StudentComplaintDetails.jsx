import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, CheckCircle, Clock, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentComplaintDetails() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const resolvedCount = complaints.filter((item) => item.status === 'Done').length;
  const pendingCount = complaints.length - resolvedCount;

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setComplaints([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchComplaints();
  }, [navigate, token, user.role, fetchComplaints]);

  const displayedComplaints = useMemo(() => {
    let list = [...complaints];

    if (filterStatus === 'done') {
      list = list.filter((complaint) => complaint.status === 'Done');
    } else if (filterStatus === 'open') {
      list = list.filter((complaint) => complaint.status !== 'Done');
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortOrder === 'oldest') {
      list.reverse();
    }

    return list;
  }, [complaints, filterStatus, sortOrder]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="bg-white/90 w-full max-w-[1440px] mx-auto rounded-[36px] overflow-hidden shadow-[0_34px_80px_rgba(15,23,42,0.18)] flex relative border border-white/60 backdrop-blur-xl">

        <div className="absolute top-0 left-0 right-0 h-[88px] bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100 text-slate-900 flex justify-between items-center px-8 z-20 rounded-t-[36px] border-b border-amber-200/70">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/student-dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold text-slate-700">
            <span>Welcome, {user.name} (Student ID: {user.studentId || `STU${(user._id || "000").substring(0,6)}`})</span>
          </div>
        </div>

        <div className="w-64 bg-white/95 border-r border-slate-200/80 flex flex-col pt-28 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-4">
            <div className="rounded-3xl bg-gradient-to-r from-teal-500/15 to-slate-100 p-4 border border-teal-100 shadow-sm">
              <div className="text-slate-500 uppercase tracking-[0.24em] text-xs font-semibold">Student Menu</div>
              <p className="mt-3 text-slate-900 font-semibold">Quick access to your campus essentials.</p>
            </div>
            <div className="space-y-2">
              <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div onClick={() => navigate('/student-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <User size={20} />
                <span>Profile</span>
              </div>
              <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <Calendar size={20} />
                <span>Attendance</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <Home size={20} />
                <span>Room Details</span>
              </div>
              <div onClick={() => navigate('/student-file-complaint')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <MessageSquare size={20} />
                <span>Complaints</span>
              </div>
              <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <CreditCard size={20} />
                <span>Payments</span>
              </div>
              <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors font-medium text-slate-700">
                <UtensilsCrossed size={20} />
                <span>Food Order</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl cursor-pointer transition-colors font-medium">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        <div className="flex-1 pt-28 px-6 pb-10 overflow-y-auto w-full">
          <div className="mb-10 grid gap-8">
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.32)]">
                <div className="absolute -right-8 top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"></div>
                <div className="absolute -left-8 top-24 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl"></div>
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 font-semibold">Maintenance Hub</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">Track your requests</h1>
                    <p className="mt-5 max-w-2xl text-slate-300 leading-8">Monitor the progress of all complaints you've submitted. Our team works diligently to resolve issues promptly.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-[28px] bg-white/10 p-4 flex items-center justify-center w-28 h-28 border border-white/10 shadow-lg">
                      <MessageSquare className="text-cyan-300" size={36} />
                    </div>
                    <button 
                      onClick={() => navigate('/student-file-complaint')}
                      className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-[0_18px_45px_rgba(59,130,246,0.3)] hover:shadow-[0_22px_55px_rgba(59,130,246,0.35)] transform hover:-translate-y-0.5"
                    >
                      + New Complaint
                    </button>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[28px] bg-slate-950/80 p-6 border border-slate-700 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">Total requests</p>
                    <p className="mt-4 text-3xl font-bold text-white">{complaints.length}</p>
                  </div>
                  <div className="rounded-[28px] bg-cyan-500/10 p-6 border border-cyan-300 shadow-sm backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200 font-semibold">Pending issues</p>
                    <p className="mt-4 text-3xl font-bold text-cyan-100">{pendingCount}</p>
                  </div>
                  <div className="rounded-[28px] bg-amber-500/10 p-6 border border-amber-300 shadow-sm backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold">Resolved</p>
                    <p className="mt-4 text-3xl font-bold text-amber-100">{resolvedCount}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-cyan-500 to-slate-900 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-3xl bg-white/10 p-3">
                      <UtensilsCrossed className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Need to file a new complaint?</p>
                      <p className="mt-2 text-sm leading-6 text-teal-100/90">Use the 'Complaints' menu or the button above to report any issues immediately.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/student-file-complaint')}
                    className="mt-3 bg-white text-slate-900 font-semibold px-5 py-3 rounded-3xl shadow-[0_18px_45px_rgba(255,255,255,0.12)] hover:bg-slate-100 transition-all"
                  >
                    File another request
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">My Complaints Details</h2>
                  <p className="mt-2 text-sm text-slate-500">Track the progress of every request you have filed.</p>
                </div>
                <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-full shadow-sm">{complaints.length} Total</div>
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('done');
                    setSortOrder('');
                  }}
                  className={`rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${filterStatus === 'done' ? 'bg-emerald-600 text-white border border-emerald-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'}`}
                >
                  Resolved {resolvedCount}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('open');
                    setSortOrder('');
                  }}
                  className={`rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${filterStatus === 'open' ? 'bg-amber-600 text-white border border-amber-600' : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100'}`}
                >
                  Pending {pendingCount}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder('recent');
                    setFilterStatus('all');
                  }}
                  className={`rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${sortOrder === 'recent' ? 'bg-slate-900 text-white border border-slate-900' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}
                >
                  Recent first
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {displayedComplaints.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center h-full text-slate-500">
                    <CheckCircle size={60} className="text-slate-200 mb-4" />
                    <p className="text-lg font-medium">No complaints history found.</p>
                    <p className="text-sm mt-2 max-w-xs mx-auto">You can submit a new complaint using the form if you are facing any issues.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {displayedComplaints.map(complaint => (
                      <div key={complaint._id} className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(59,130,246,0.12)]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500"></div>
                        <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] ${
                              complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {complaint.status}
                            </span>
                            <span className="text-xs text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-3 py-2 rounded-full">{complaint.category}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{complaint.title}</h3>
                        <p className="text-sm text-slate-600 leading-8 mb-6">{complaint.description}</p>
                        <div className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-5 rounded-[28px] border border-slate-200 text-sm text-slate-600">
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Home size={18} className="text-cyan-500" />
                            <span>{complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            <User size={18} className="text-indigo-500" />
                            <span>{complaint.assignedWorker ? `Assigned to ${complaint.assignedWorker}` : 'No assignment yet'}</span>
                          </div>
                          {complaint.anonymous && (
                            <div className="col-span-full rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-slate-400" /> Ghost Mode
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}