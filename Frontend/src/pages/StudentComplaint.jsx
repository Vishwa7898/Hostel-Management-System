import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, CheckCircle, Clock, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentComplaint() {
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

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
  }, [navigate, token, user.role]);

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
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-cyan-50 via-slate-50 to-white"
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
              <div className="rounded-[32px] border border-slate-200/70 bg-white p-8 text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 font-semibold">Maintenance Hub</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Submit your request with confidence</h1>
                    <p className="mt-5 max-w-2xl text-slate-600 leading-8">Report any issue in your accommodation or shared facilities. Our team reviews complaints daily and works to resolve them promptly.</p>
                  </div>
                  <div className="rounded-[28px] bg-cyan-50 p-4 flex items-center justify-center w-28 h-28 border border-cyan-100">
                    <MessageSquare className="text-cyan-600" size={36} />
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[32px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-slate-50 p-6 text-slate-900 shadow-sm">
                  <p className="text-lg font-semibold">Track your complaints</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">View the status and progress of all your submitted complaints.</p>
                  <button 
                    onClick={() => navigate('/student-complaints')}
                    className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-2xl font-medium text-sm transition-colors shadow-sm"
                  >
                    View My Complaints →
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[28px] bg-white p-8 text-slate-900 shadow-sm border border-slate-200">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 font-semibold">Complaint Form</p>
                      <h3 className="mt-3 text-4xl font-bold text-slate-900">Tell us what needs fixing</h3>
                    </div>
                    <div className="rounded-full bg-cyan-50 p-4 text-cyan-600 shadow-sm">
                      <AlertCircle size={28} />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-7 mb-8">Describe the problem in detail so our team can assign the right support quickly. You can choose room or general category and submit anonymously if needed.</p>
                  <div className="space-y-4">
                    <div className="rounded-[28px] bg-cyan-50 p-5 border border-cyan-100 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Fast resolution</p>
                      <p className="mt-2 text-sm text-slate-600">Our maintenance team reviews every complaint and acts quickly on urgent issues.</p>
                    </div>
                    <div className="rounded-[28px] bg-emerald-50 p-5 border border-emerald-100 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Clear tracking</p>
                      <p className="mt-2 text-sm text-slate-600">Track your complaint status from the My Complaints page anytime.</p>
                    </div>
                    <div className="rounded-[28px] bg-amber-50 p-5 border border-amber-100 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Safe and simple</p>
                      <p className="mt-2 text-sm text-slate-600">Submit anonymously or with your details based on your comfort level.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[28px] bg-white p-8 md:p-10 text-slate-900 shadow-sm border border-slate-200">
                  {error && (
                    <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-3xl font-medium text-sm flex items-center gap-2 animate-bounce">
                      <AlertCircle size={18} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-3xl font-medium text-sm flex items-center gap-2 animate-pulse">
                      <CheckCircle size={18} className="animate-bounce" /> {success}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Location Type <span className="text-orange-400">*</span></label>
                        <select 
                          value={locationType} 
                          onChange={e => setLocationType(e.target.value)} 
                          className="w-full p-4 border border-slate-200 rounded-[32px] bg-white text-slate-900 font-medium outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        >
                          <option value="room">Room</option>
                          <option value="general">General (Common Area)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Category <span className="text-orange-400">*</span></label>
                        <select 
                          value={category} 
                          onChange={e => setCategory(e.target.value)} 
                          className="w-full p-4 border border-slate-200 rounded-[32px] bg-white text-slate-900 font-medium outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
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
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Room Number <span className="text-orange-400">*</span></label>
                        <input 
                          type="text" 
                          value={roomNumber} 
                          onChange={e => setRoomNumber(e.target.value)} 
                          placeholder="e.g. A-101" 
                          className="w-full p-4 border border-slate-200 rounded-[32px] bg-white text-slate-900 font-medium outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Title <span className="text-orange-400">*</span></label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="Brief description of the issue" 
                        className="w-full p-4 border border-slate-200 rounded-[32px] bg-white text-slate-900 font-medium outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Description <span className="text-orange-400">*</span></label>
                      <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Provide full details about the issue..." 
                        className="w-full p-4 border border-slate-200 rounded-[32px] bg-white text-slate-900 font-medium resize-none h-40 outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      ></textarea>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-[32px] border border-slate-200">
                      <input 
                        type="checkbox" 
                        id="anonymous" 
                        checked={anonymous} 
                        onChange={e => setAnonymous(e.target.checked)} 
                        className="w-5 h-5 text-cyan-500 bg-white border-slate-300 rounded focus:ring-cyan-400 cursor-pointer"
                      />
                      <label htmlFor="anonymous" className="text-sm font-semibold text-slate-900 cursor-pointer flex-1">
                        Submit Anonymously
                        <p className="text-xs text-slate-500 font-medium mt-1">Your name won't be visible to administration.</p>
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white py-4 rounded-[32px] font-semibold text-lg shadow-[0_20px_40px_rgba(14,165,233,0.25)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:shadow-[0_25px_50px_rgba(14,165,233,0.35)] transform hover:scale-[1.02]"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
