import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, RefreshCw, Plus, Edit2, Trash2, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchNotices();
  }, [navigate, token, user.role]);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/notices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notices');
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError(err.message || 'Unable to load notices.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({ title: notice.title, description: notice.description });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', description: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setSubmitLoading(true);
    setError('');
    
    try {
      const url = editingNotice 
        ? `http://localhost:5000/api/notices/${editingNotice._id}`
        : 'http://localhost:5000/api/notices';
      
      const method = editingNotice ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save notice');
      
      await fetchNotices();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error saving notice.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete notice');
      await fetchNotices();
    } catch (err) {
      alert(err.message || 'Error deleting notice');
    }
  };

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
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-all font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-700 rounded-xl cursor-pointer transition-all font-bold shadow-sm border border-orange-100/50 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md"></div>
            <Bell size={20} className="text-orange-500" />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-teal-300/10 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 p-5 sticky top-0 z-10 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-black tracking-tight text-slate-800 hidden sm:block flex items-center gap-2">
            Maintenance <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Notices</span>
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
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-5">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Bell size={28} className="text-orange-500" strokeWidth={2.5} />
                  </div>
                  Manage Notices
                </h2>
                <p className="text-slate-500 font-medium text-lg mt-2">Broadcast important maintenance and general announcements.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button onClick={fetchNotices} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 font-bold transition-all shadow-sm active:scale-95">
                  <RefreshCw size={18} className={`${loading ? 'animate-spin text-orange-500' : 'text-slate-500'}`} /> 
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95 border border-orange-500">
                  <Plus size={20} strokeWidth={2.5} /> New Notice
                </button>
              </div>
            </div>

            {error && !isModalOpen && (
              <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-5 py-4 rounded-2xl font-semibold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3"><AlertCircle size={20} /> {error}</div>
                <X className="cursor-pointer hover:bg-red-100 p-1 rounded-full transition-colors" size={24} onClick={() => setError('')} />
              </div>
            )}

            <div className="grid gap-5">
              {loading && notices.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm">
                  <RefreshCw size={44} className="mx-auto mb-4 text-orange-400 animate-spin" />
                  <p className="text-lg font-medium text-slate-500">Loading notices...</p>
                </div>
              ) : notices.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-16 text-center border border-slate-200/60 shadow-sm">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell size={48} className="text-orange-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">No Notices Yet</h3>
                  <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">Create your first maintenance notice to keep the students informed.</p>
                  <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors shadow-sm border border-orange-200">
                    Create Notice
                  </button>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice._id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-400 to-emerald-500"></div>
                    
                    <div className="flex-1 pl-2">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-[11px] font-black uppercase tracking-wider rounded-md border border-teal-100 shadow-sm">Notice</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100/80 px-2 py-1 rounded-md">
                          <Clock size={12} /> {new Date(notice.date || notice.createdAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100/80 px-2 py-1 rounded-md">
                          <User size={12} /> {notice.author}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">{notice.title}</h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100/80">
                      <button 
                        onClick={() => handleOpenModal(notice)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all border border-slate-200 active:scale-95 shadow-sm"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(notice._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all border border-red-100 active:scale-95 shadow-sm"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/50 animate-in zoom-in-[0.97] duration-300">
            <div className="px-7 py-5 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {editingNotice ? <Edit2 size={24} className="text-orange-500" /> : <Plus size={24} className="text-orange-500" />}
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-200/70 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-7">
              {error && (
                <div className="mb-5 bg-red-50/80 border border-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-slate-600 mb-2">Notice Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    placeholder="e.g. Water Supply Interruption"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-slate-600 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all min-h-[140px] resize-y font-medium text-slate-800 placeholder:text-slate-400"
                    placeholder="Provide full details about the maintenance..."
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 border border-orange-500"
                >
                  {submitLoading ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  {submitLoading ? 'Saving...' : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
