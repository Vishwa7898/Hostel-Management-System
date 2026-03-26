import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell, RefreshCw, Plus, Edit2, Trash2, X } from 'lucide-react';

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
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-10 px-2 text-slate-800 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
          <div className="w-8 h-8 bg-orange-500 rounded flex justify-center items-center text-white">
            <Home size={18} />
          </div>
          <span><span className="text-gray-500">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
        </div>

        <div className="flex-1 space-y-2">
          <div onClick={() => navigate('/admin-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/admin-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div onClick={() => navigate('/admin-rooms')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div onClick={() => navigate('/admin-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div onClick={() => navigate('/admin-notices')} className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg cursor-pointer transition-colors font-bold">
            <Bell size={20} />
            <span>Maintenance Notices</span>
          </div>
          <div onClick={() => navigate('/admin-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <UtensilsCrossed size={20} />
            <span>Food Order</span>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex items-center justify-between z-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Maintenance <span className="text-orange-500">Notices</span></h1>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-800 leading-none">{user.name}</span>
              <span className="text-xs text-slate-500">{user.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Manage Notices</h2>
                <p className="text-slate-500 mt-1">Create and manage maintenance and general announcements for hostellers.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchNotices} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all shadow-sm">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> 
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold transition-all shadow-md hover:shadow-lg">
                  <Plus size={18} /> New Notice
                </button>
              </div>
            </div>

            {error && !isModalOpen && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl font-medium flex items-center gap-3">
                <X className="cursor-pointer" onClick={() => setError('')} size={18} />
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {loading && notices.length === 0 ? (
                <div className="text-center py-12 text-slate-500">Loading notices...</div>
              ) : notices.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                  <Bell size={48} className="mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Notices Yet</h3>
                  <p className="text-slate-500 mb-6">Create the first maintenance notice to inform the students.</p>
                  <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors">
                    Create Notice
                  </button>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">Notice</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(notice.date || notice.createdAt).toLocaleString()}</span>
                        <span className="text-xs text-slate-400 font-medium ml-1">By: {notice.author}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{notice.title}</h3>
                      <p className="text-slate-600 whitespace-pre-wrap">{notice.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button 
                        onClick={() => handleOpenModal(notice)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors border border-slate-200"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(notice._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors border border-red-100"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-medium text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Notice Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="e.g. Water Supply Interruption"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all min-h-[120px] resize-y"
                    placeholder="Details about the maintenance notice..."
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitLoading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
