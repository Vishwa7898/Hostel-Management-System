import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCw, Home, User } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

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
    <StudentShell
      activeKey="complaints"
      title="Complaints"
      subtitle="Report maintenance issues and track progress."
    >

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    File a new complaint
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Provide clear details to get faster resolution.
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                  Student
                </span>
              </div>
              
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={locationType} 
                      onChange={e => setLocationType(e.target.value)} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-slate-800 font-semibold"
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-slate-800 font-semibold"
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-slate-800 font-semibold"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Provide full details about the issue..." 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-slate-800 font-semibold resize-y min-h-28"
                  />
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    checked={anonymous} 
                    onChange={e => setAnonymous(e.target.checked)} 
                    className="mt-0.5 w-5 h-5 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="anonymous" className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
                    Submit Anonymously
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Your name won't be visible to administration.</p>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-extrabold text-base shadow-sm hover:shadow transition-all active:scale-[0.99] mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                  {loading ? 'Submitting...' : 'Submit complaint'}
                </button>
              </form>
            </section>

            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col min-h-[520px]">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">My complaints</h2>
                  <p className="mt-1 text-sm text-slate-600">Statuses update as staff process your request.</p>
                </div>
                <div className="text-xs font-extrabold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  {complaints.length} total
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1">
                {complaints.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center h-full text-slate-500">
                    <CheckCircle size={56} className="text-slate-200 mb-4" />
                    <p className="text-base font-bold text-slate-700">No complaints yet</p>
                    <p className="text-sm mt-2 max-w-xs mx-auto">Submit a complaint using the form and it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map(complaint => (
                      <div key={complaint._id} className="border border-slate-200 hover:border-teal-200 bg-white hover:bg-teal-50/30 rounded-2xl p-5 transition-colors w-full">
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
                        
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">{complaint.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{complaint.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Home size={16} /> 
                            <span className="font-medium whitespace-nowrap">
                              {complaint.locationType === 'room' ? `Room ${complaint.roomNumber}` : 'General Area'}
                            </span>
                          </div>
                          
                          {complaint.assignedWorker && (
                            <div className="flex items-center gap-1.5 text-slate-500 border-l border-slate-300/60 pl-4">
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
            </section>

          </div>
    </StudentShell>
  );
}
