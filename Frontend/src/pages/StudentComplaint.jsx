import React, { useState, useEffect } from 'react';
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
      className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
    >

      <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">

        <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/student-dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <span>Welcome, {user.name} (Student ID: {user.studentId || `STU${(user._id || "000").substring(0,6)}`})</span>
          </div>
        </div>

        <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
              <span>Complaints</span>
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
            <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Calendar size={20} />
              <span>Attendance</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <Home size={20} />
              <span>Room Details</span>
            </div>
            <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <MessageSquare size={20} />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div onClick={() => navigate('/student-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <UtensilsCrossed size={20} />
              <span>Food Order</span>
            </div>
          </div>
          <div className="mt-8">
            <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>

        <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto w-full">

          <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8 relative">
            Complaints & Maintenance
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> File a New Complaint
              </h2>
              
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2">
                  <CheckCircle size={18} /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location Type <span className="text-red-500">*</span></label>
                    <select 
                      value={locationType} 
                      onChange={e => setLocationType(e.target.value)} 
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                    >
                      <option value="room">Room</option>
                      <option value="general">General (Common Area)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value)} 
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
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
                    <label className="block text-sm font-bold text-slate-700 mb-2">Room Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={roomNumber} 
                      onChange={e => setRoomNumber(e.target.value)} 
                      placeholder="e.g. A-101" 
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Brief description of the issue" 
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Provide full details about the issue..." 
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium resize-none h-28"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    checked={anonymous} 
                    onChange={e => setAnonymous(e.target.checked)} 
                    className="w-5 h-5 text-orange-600 bg-white border-orange-300 rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="anonymous" className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
                    Submit Anonymously
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Your name won't be visible to administration.</p>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#e76f3c] hover:bg-[#d05c2a] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.99] mt-6 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">My Complaints Details</h2>
                <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{complaints.length} Total</div>
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
                      <div key={complaint._id} className="border border-slate-100 hover:border-teal-100 bg-slate-50/50 hover:bg-teal-50/20 rounded-2xl p-5 transition-all w-full">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                              complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {complaint.status}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              {complaint.category}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{complaint.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{complaint.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 bg-white p-3 rounded-xl border border-slate-100 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Home size={16} /> 
                            <span className="font-medium whitespace-nowrap">
                              {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                            </span>
                          </div>
                          
                          {complaint.assignedWorker && (
                            <div className="flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-4">
                              <User size={16} />
                              <span className="font-medium">Assigned: <span className="text-teal-600">{complaint.assignedWorker}</span></span>
                            </div>
                          )}
                          
                          {complaint.anonymous && (
                            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-wider ml-auto">
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
  );
}
