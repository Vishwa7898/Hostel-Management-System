import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, RefreshCw, Plus, Edit2, Trash2, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import AdminShell from '../components/layout/AdminShell';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
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
    setFormErrors({});
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
    setFormData({ title: '', description: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const nextErrors = {};
    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      nextErrors.title = 'Title is required.';
    } else if (title.length < 5) {
      nextErrors.title = 'Title must be at least 5 characters.';
    } else if (title.length > 120) {
      nextErrors.title = 'Title cannot exceed 120 characters.';
    }

    if (!description) {
      nextErrors.description = 'Description is required.';
    } else if (description.length < 15) {
      nextErrors.description = 'Description must be at least 15 characters.';
    } else if (description.length > 1000) {
      nextErrors.description = 'Description cannot exceed 1000 characters.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix form errors before saving.');
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
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim()
        })
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
    
    // Optimistically remove the notice from the UI
    setNotices(prevNotices => prevNotices.filter(notice => notice._id !== id));
    
    try {
      const res = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete notice');
      // Refresh to ensure consistency
      await fetchNotices();
    } catch (err) {
      // If delete failed, restore the notice and show error
      alert(err.message || 'Error deleting notice');
      await fetchNotices(); // Refresh to restore the notice
    }
  };

  return (
    <AdminShell activeKey="notices" title="Maintenance Notices">
      <div className="flex-1 min-w-0 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-teal-300/10 rounded-full blur-[120px] pointer-events-none"></div>

        <main className="flex-1 overflow-x-hidden relative z-0">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-5">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-xl">
                    <Bell size={28} className="text-teal-600" strokeWidth={2.5} />
                  </div>
                  Manage Notices
                </h2>
                <p className="text-slate-500 font-medium text-lg mt-2">Broadcast important maintenance and general announcements.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button onClick={fetchNotices} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 font-bold transition-all shadow-sm active:scale-95">
                  <RefreshCw size={18} className={`${loading ? 'animate-spin text-teal-500' : 'text-slate-500'}`} /> 
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 font-bold transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 active:scale-95 border border-teal-500">
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
                  <RefreshCw size={44} className="mx-auto mb-4 text-teal-400 animate-spin" />
                  <p className="text-lg font-medium text-slate-500">Loading notices...</p>
                </div>
              ) : notices.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-16 text-center border border-slate-200/60 shadow-sm">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell size={48} className="text-teal-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">No Notices Yet</h3>
                  <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">Create your first maintenance notice to keep the students informed.</p>
                  <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 font-bold rounded-xl hover:bg-teal-200 transition-colors shadow-sm border border-teal-200">
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
                {editingNotice ? <Edit2 size={24} className="text-teal-600" /> : <Plus size={24} className="text-teal-600" />}
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
                  <label className="block text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Notice Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: '' }));
                    }}
                    className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 ${
                      formErrors.title
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-slate-200/80 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                    }`}
                    placeholder="e.g. Water Supply Interruption"
                    required
                    minLength={5}
                    maxLength={120}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-red-500">{formErrors.title || ''}</span>
                    <span className="text-slate-400">{formData.title.trim().length}/120</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-slate-600 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all min-h-[140px] resize-y font-medium text-slate-800 placeholder:text-slate-400 ${
                      formErrors.description
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-slate-200/80 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                    }`}
                    placeholder="Provide full details about the maintenance..."
                    required
                    minLength={15}
                    maxLength={1000}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-red-500">{formErrors.description || ''}</span>
                    <span className="text-slate-400">{formData.description.trim().length}/1000</span>
                  </div>
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
                  disabled={submitLoading || !formData.title.trim() || !formData.description.trim()}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-teal-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 border border-teal-500"
                >
                  {submitLoading ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  {submitLoading ? 'Saving...' : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
