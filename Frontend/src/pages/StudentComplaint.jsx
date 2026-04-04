import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, CheckCircle, Clock, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('room');
  const [roomNumber, setRoomNumber] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!category || !title || !description || !locationType) {
      return setError('Please fill in all required fields.');
    }
    
    if (locationType === 'room' && !roomNumber) {
      return setError('Room number is required for room complaints.');
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          title,
          description,
          locationType,
          roomNumber: locationType === 'room' ? roomNumber : '',
          anonymous
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Complaint submitted successfully');
        setCategory('');
        setTitle('');
        setDescription('');
        setRoomNumber('');
        setAnonymous(false);
        fetchComplaints();
      } else {
        setError(data.message || 'Error submitting complaint');
      }
    } catch {
      setError('Server error connection failed');
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-teal-700 rounded-2xl cursor-pointer font-semibold shadow-sm">
                <span>Complaints</span>
                <ChevronDown size={18} />
              </div>
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
              <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-teal-500/10 to-white text-teal-700 rounded-2xl cursor-pointer transition-colors font-medium border border-teal-100 shadow-sm">
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
              <div className="rounded-[32px] border border-slate-200/70 bg-slate-950/95 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.32)] overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-teal-300 font-semibold">Maintenance Hub</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Submit your request with confidence</h1>
                    <p className="mt-5 max-w-2xl text-slate-300 leading-8">Report any issue in your accommodation or shared facilities and keep track of progress in one place. Our team reviews complaints daily.</p>
                  </div>
                  <div className="rounded-[28px] bg-white/10 p-4 flex items-center justify-center w-28 h-28 border border-white/10">
                    <MessageSquare className="text-teal-300" size={36} />
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[28px] bg-white/10 p-5 border border-white/10">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">Total requests</p>
                    <p className="mt-4 text-3xl font-bold text-white">{complaints.length}</p>
                  </div>
                  <div className="rounded-[28px] bg-white/10 p-5 border border-white/10">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">Open issues</p>
                    <p className="mt-4 text-3xl font-bold text-emerald-300">{pendingCount}</p>
                  </div>
                  <div className="rounded-[28px] bg-white/10 p-5 border border-white/10">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">Resolved</p>
                    <p className="mt-4 text-3xl font-bold text-amber-300">{resolvedCount}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="text-lg font-semibold text-slate-900">Quick guidance</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">Tip</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">Choose the right category, describe the issue clearly, and submit anonymously if you prefer. This helps the team resolve it faster.</p>
                </div>
                <div className="rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-teal-600 to-slate-900 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                  <p className="text-lg font-semibold">Need faster action?</p>
                  <p className="mt-3 text-sm leading-7 text-teal-100/90">Use the room location option and add precise details so maintenance can act quickly.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><AlertCircle className="text-orange-500" /> File a New Complaint</h2>
                    <p className="mt-2 text-sm text-slate-500">Submit an issue and our team will review it promptly.</p>
                  </div>
                </div>
                {error && (
                  <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2">
                    <CheckCircle size={18} /> {success}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Location Type <span className="text-red-500">*</span></label>
                      <select 
                        value={locationType} 
                        onChange={e => setLocationType(e.target.value)} 
                        className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                      >
                        <option value="room">Room</option>
                        <option value="general">General (Common Area)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
                      <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                      >
                        <option value="">Select Category</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Cleaning">Cleaning / Hygiene</option>
                        <option value="Internet">Wi-Fi / Internet</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  {locationType === 'room' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={roomNumber} 
                        onChange={e => setRoomNumber(e.target.value)} 
                        placeholder="e.g. A-101" 
                        className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="Brief description of the issue" 
                      className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Provide full details about the issue..." 
                      className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium resize-none h-32"
                    ></textarea>
                  </div>
                  <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-3xl border border-teal-100">
                    <input 
                      type="checkbox" 
                      id="anonymous" 
                      checked={anonymous} 
                      onChange={e => setAnonymous(e.target.checked)} 
                      className="w-5 h-5 text-teal-600 bg-white border-teal-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="anonymous" className="text-sm font-semibold text-slate-700 cursor-pointer flex-1">
                      Submit Anonymously
                      <p className="text-xs text-slate-500 font-medium mt-1">Your name won't be visible to administration.</p>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-3xl font-semibold text-lg shadow-[0_20px_40px_rgba(231,111,60,0.25)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </form>
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
                  <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-emerald-700 text-sm font-semibold">Resolved {resolvedCount}</div>
                  <div className="rounded-3xl bg-amber-50 px-4 py-3 text-amber-700 text-sm font-semibold">Open {pendingCount}</div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-slate-600 text-sm font-semibold">Recent first</div>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {complaints.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full text-slate-500">
                      <CheckCircle size={60} className="text-slate-200 mb-4" />
                      <p className="text-lg font-medium">No complaints history found.</p>
                      <p className="text-sm mt-2 max-w-xs mx-auto">You can submit a new complaint using the form if you are facing any issues.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints.map(complaint => (
                        <div key={complaint._id} className="border border-slate-200 hover:border-teal-100 bg-slate-50 rounded-3xl p-5 transition-all shadow-sm">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-3 py-1 rounded-2xl text-xs font-semibold uppercase tracking-[0.18em] ${
                                complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {complaint.status}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-1 rounded-2xl">{complaint.category}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">{complaint.title}</h3>
                          <p className="text-sm text-slate-600 leading-7 mb-4">{complaint.description}</p>
                          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Home size={16} />
                              <span className="font-medium whitespace-nowrap">{complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}</span>
                            </div>
                            {complaint.assignedWorker && (
                              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                <User size={16} />
                                <span className="font-medium">Assigned: <span className="text-teal-600">{complaint.assignedWorker}</span></span>
                              </div>
                            )}
                            {complaint.anonymous && (
                              <div className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Ghost Mode</div>
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
    </div>
  );
}
