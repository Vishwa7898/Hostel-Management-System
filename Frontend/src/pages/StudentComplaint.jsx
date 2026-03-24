import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, CheckCircle, Clock, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, ArrowRight, AlertCircle, RefreshCw, Bell } from 'lucide-react';

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

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchComplaints();
  }, [navigate, token, user.role]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setComplaints([]);
    }
  };

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
    } catch (err) {
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
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed selection:bg-teal-200 selection:text-teal-900"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >

      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-[1400px] mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/20 flex relative">

        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 h-[76px] bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex justify-between items-center px-8 z-30 rounded-t-[2rem] shadow-sm">
          <div className="font-black text-3xl tracking-tight flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/student-dashboard')}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            </div>
            <span>Stay<span className="text-teal-100">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
            <span>Welcome, {user.name} <span className="text-teal-100 font-medium ml-1">({user.studentId || `STU${(user._id || "000").substring(0,6)}`})</span></span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 bg-slate-50/50 border-r border-slate-200/50 flex flex-col pt-28 pb-8 px-5 relative z-20 hidden md:flex backdrop-blur-xl">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black mb-6 shadow-sm">
              <span>Student Portal</span>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            
            <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/student-profile')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <User size={20} />
              <span>Profile</span>
            </div>
            <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <Calendar size={20} />
              <span>Attendance</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <Home size={20} />
              <span>Room Details</span>
            </div>
            <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3.5 bg-gradient-to-r from-teal-50 to-emerald-50/50 text-teal-700 rounded-xl cursor-pointer transition-all font-bold shadow-sm border border-teal-100/50 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-r-md"></div>
              <MessageSquare size={20} className="text-teal-600 group-hover:scale-110 transition-transform" />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div onClick={() => navigate('/student-notices')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <Bell size={20} />
              <span>Notices</span>
            </div>
            <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3.5 hover:bg-white/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-semibold">
              <UtensilsCrossed size={20} />
              <span>Food Order</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-200/50">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50/80 hover:text-red-600 rounded-xl cursor-pointer transition-all font-bold">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-28 px-6 md:px-10 pb-10 overflow-y-auto w-full relative z-10 bg-slate-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600 tracking-tight flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <MessageSquare size={36} className="text-teal-500" />
                </div>
                Support & Maintenance
              </h1>
              <p className="text-slate-500 font-medium text-lg mt-3 ml-2">Report issues in your room or common areas and track their resolution status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
              
              {/* Form Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 md:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-teal-200/40 transition-colors duration-700"></div>
                
                <h2 className="text-2xl font-black text-slate-800 mb-7 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <AlertCircle size={18} strokeWidth={3} />
                  </span>
                  File a New Report
                </h2>
                
                {error && (
                  <div className="mb-6 bg-red-50/80 backdrop-blur-sm text-red-600 px-5 py-4 rounded-2xl font-semibold text-sm flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-emerald-50/80 backdrop-blur-sm text-emerald-600 px-5 py-4 rounded-2xl font-semibold text-sm flex items-center gap-3 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle size={20} /> {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-black uppercase tracking-wider text-slate-500 mb-2">Location Type <span className="text-red-500">*</span></label>
                      <select 
                        value={locationType} 
                        onChange={e => setLocationType(e.target.value)} 
                        className="w-full p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-700 font-bold transition-all shadow-sm cursor-pointer appearance-none"
                      >
                        <option value="room">My Room</option>
                        <option value="general">Common Area</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-black uppercase tracking-wider text-slate-500 mb-2">Category <span className="text-red-500">*</span></label>
                      <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        className="w-full p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-700 font-bold transition-all shadow-sm cursor-pointer appearance-none"
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
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <label className="block text-[12px] font-black uppercase tracking-wider text-slate-500 mb-2">Room Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={roomNumber} 
                        onChange={e => setRoomNumber(e.target.value)} 
                        placeholder="e.g. A-101" 
                        className="w-full p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-800 font-bold transition-all shadow-sm placeholder:font-normal placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[12px] font-black uppercase tracking-wider text-slate-500 mb-2">Brief Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="e.g. Broken AC in my room" 
                      className="w-full p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-800 font-bold transition-all shadow-sm placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-black uppercase tracking-wider text-slate-500 mb-2">Full Description <span className="text-red-500">*</span></label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Please provide as much detail as possible so we can send the right person..." 
                      className="w-full p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-800 font-medium transition-all shadow-sm resize-none h-32 placeholder:text-slate-400 line-height-[1.6]"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-4 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50 hover:bg-teal-50 transition-colors cursor-pointer" onClick={() => setAnonymous(!anonymous)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${anonymous ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}>
                      {anonymous && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Submit Anonymously</p>
                      <p className="text-[12px] text-slate-500 font-medium mt-0.5">Your name will be hidden from the maintenance staff.</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-4 rounded-xl font-black text-lg shadow-[0_8px_20px_rgba(20,184,166,0.25)] hover:shadow-[0_12px_25px_rgba(20,184,166,0.35)] transition-all active:scale-[0.98] mt-8 flex justify-center items-center gap-2 border border-teal-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <ChevronDown className="rotate-[-90deg]" />}
                    {loading ? 'Submitting Report...' : 'Submit Report'}
                  </button>
                </form>
              </div>

              {/* List Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 md:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex flex-col h-[800px]">
                <div className="flex justify-between items-center mb-7 border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Clock size={18} strokeWidth={3} />
                    </span>
                    My Reports
                  </h2>
                  <div className="text-[12px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">{complaints.length} Total</div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
                  {complaints.length === 0 ? (
                    <div className="text-center flex flex-col items-center justify-center h-full text-slate-500">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                        <CheckCircle size={40} className="text-slate-300" />
                      </div>
                      <p className="text-xl font-bold text-slate-700 mb-2">No Reports Yet</p>
                      <p className="text-[15px] max-w-[250px] mx-auto text-slate-500 font-medium">When you submit a complaint, you'll be able to track its status here.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {complaints.map(complaint => (
                        <div key={complaint._id} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                          {complaint.status === 'Done' ? (
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -z-10"></div>
                          ) : (
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-full -z-10"></div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                complaint.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {complaint.status}
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-sm">
                                {complaint.category}
                              </span>
                            </div>
                            <span className="text-[12px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="text-[17px] font-black text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">{complaint.title}</h3>
                          <p className="text-[14px] text-slate-600 leading-relaxed mb-5 font-medium">{complaint.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-y-3 gap-x-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-[13px]">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Home size={16} className="text-slate-400" /> 
                              <span className="font-bold">
                                {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                              </span>
                            </div>
                            
                            {complaint.assignedWorker && (
                              <div className="flex items-center gap-2 text-slate-600 pl-5 border-l-2 border-slate-200/80">
                                <User size={16} className="text-slate-400" />
                                <span className="font-bold">Staff: <span className="text-teal-600">{complaint.assignedWorker}</span></span>
                              </div>
                            )}
                            
                            {complaint.anonymous && (
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 ml-auto">
                                Ghost Mode
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
    </div>
  );
}
