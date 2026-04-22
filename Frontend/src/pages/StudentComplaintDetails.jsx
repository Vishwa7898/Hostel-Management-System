import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Home, MessageSquare, UtensilsCrossed } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

export default function StudentComplaintDetails() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('');

  // Edit state
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocationType, setEditLocationType] = useState('room');
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editAnonymous, setEditAnonymous] = useState(false);

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

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint._id);
    setEditCategory(complaint.category);
    setEditTitle(complaint.title);
    setEditDescription(complaint.description);
    setEditLocationType(complaint.locationType);
    setEditRoomNumber(complaint.roomNumber);
    setEditAnonymous(complaint.anonymous);
  };

  const handleCancelEdit = () => {
    setEditingComplaint(null);
    setEditCategory('');
    setEditTitle('');
    setEditDescription('');
    setEditLocationType('room');
    setEditRoomNumber('');
    setEditAnonymous(false);
  };

  const handleUpdateComplaint = async (complaintId) => {
    if (!editCategory || !editTitle || !editDescription || !editLocationType) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (editLocationType === 'room' && !editRoomNumber) {
      setError('Room number is required for room complaints.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category: editCategory,
          title: editTitle,
          description: editDescription,
          locationType: editLocationType,
          roomNumber: editLocationType === 'room' ? editRoomNumber : '',
          anonymous: editAnonymous
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setEditingComplaint(null);
        fetchComplaints(); // Refresh the list
      } else {
        setError(data.message || 'Error updating complaint');
      }
    } catch {
      setError('Server error connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchComplaints(); // Refresh the list
      } else {
        const data = await res.json();
        setError(data.message || 'Error deleting complaint');
      }
    } catch {
      setError('Server error connection failed');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <StudentShell activeKey="complaints" title="My Complaints Details">
      <div className="flex-1 w-full">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
              {error}
            </div>
          )}
          <div className="mb-10 grid gap-8">
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                <div className="absolute -right-8 top-12 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl"></div>
                <div className="absolute -left-8 top-24 h-28 w-28 rounded-full bg-teal-200/40 blur-3xl"></div>
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-teal-700 font-semibold">Maintenance Hub</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900">Track your requests</h1>
                    <p className="mt-5 max-w-2xl text-slate-600 leading-8">Monitor the progress of all complaints you've submitted. Our team works diligently to resolve issues promptly.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-[28px] bg-teal-100 p-4 flex items-center justify-center w-28 h-28 border border-teal-200 shadow-sm">
                      <MessageSquare className="text-teal-700" size={36} />
                    </div>
                    <button 
                      onClick={() => navigate('/student-file-complaint')}
                      className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-[0_16px_35px_rgba(13,148,136,0.3)]"
                    >
                      + New Complaint
                    </button>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[28px] bg-white/80 p-6 border border-slate-200 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">Total requests</p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{complaints.length}</p>
                  </div>
                  <div className="rounded-[28px] bg-amber-50 p-6 border border-amber-200 shadow-sm backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-semibold">Pending issues</p>
                    <p className="mt-4 text-3xl font-bold text-amber-800">{pendingCount}</p>
                  </div>
                  <div className="rounded-[28px] bg-emerald-100/70 p-6 border border-emerald-200 shadow-sm backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-700 font-semibold">Resolved</p>
                    <p className="mt-4 text-3xl font-bold text-emerald-800">{resolvedCount}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-700 to-cyan-700 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-3xl bg-white/10 p-3">
                      <UtensilsCrossed className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Need to file a new complaint?</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100/90">Use the 'Complaints' menu or the button above to report any issues immediately.</p>
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
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
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
                    <button
                      type="button"
                      onClick={() => navigate('/student-file-complaint')}
                      className="mt-5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-teal-700 hover:to-cyan-800"
                    >
                      File New Complaint
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {displayedComplaints.map(complaint => (
                      <div key={complaint._id} className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-slate-700"></div>
                        <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] ${
                              complaint.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {complaint.status}
                            </span>
                            <span className="text-xs text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-3 py-2 rounded-full">{complaint.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            {complaint.status === 'Pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(complaint)}
                                  className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-full hover:bg-teal-700 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComplaint(complaint._id)}
                                  className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-full hover:bg-rose-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingComplaint === complaint._id ? (
                          <div className="space-y-4 rounded-3xl border-2 border-teal-200 bg-teal-50/40 p-5 shadow-[0_12px_30px_rgba(13,148,136,0.15)]">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-teal-200/70 focus:border-teal-500"
                                >
                                  <option value="">Select Category</option>
                                  <option value="Electrical">Electrical</option>
                                  <option value="Plumbing">Plumbing</option>
                                  <option value="Cleaning">Cleaning</option>
                                  <option value="Maintenance">Maintenance</option>
                                  <option value="Security">Security</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location Type</label>
                                <select
                                  value={editLocationType}
                                  onChange={(e) => setEditLocationType(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-teal-200/70 focus:border-teal-500"
                                >
                                  <option value="room">Room</option>
                                  <option value="general">General Area</option>
                                </select>
                              </div>
                            </div>
                            {editLocationType === 'room' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Room Number</label>
                                <input
                                  type="text"
                                  value={editRoomNumber}
                                  onChange={(e) => setEditRoomNumber(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-teal-200/70 focus:border-teal-500"
                                  placeholder="Enter room number"
                                />
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-teal-200/70 focus:border-teal-500"
                                placeholder="Brief title of the issue"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-teal-200/70 focus:border-teal-500"
                                placeholder="Detailed description of the issue"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`anonymous-${complaint._id}`}
                                checked={editAnonymous}
                                onChange={(e) => setEditAnonymous(e.target.checked)}
                                className="rounded"
                              />
                              <label htmlFor={`anonymous-${complaint._id}`} className="text-sm text-slate-700">Submit anonymously</label>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateComplaint(complaint._id)}
                                disabled={loading}
                                className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition-colors disabled:opacity-50"
                              >
                                {loading ? 'Updating...' : 'Update'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-4 py-2 rounded-2xl hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </StudentShell>
  );
}