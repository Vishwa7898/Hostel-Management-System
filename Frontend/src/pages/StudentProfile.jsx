import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, User, Calendar, Home, MessageSquare, CreditCard, UtensilsCrossed, Key, X } from 'lucide-react';

export default function StudentProfile() {
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: 'Colombo', contactNumber: '', guardianName: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-profile');
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || 'Colombo',
          contactNumber: data.contactNumber || '',
          guardianName: data.guardianName || ''
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordForm.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage('Password updated successfully!');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordMessage('');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Error updating password');
      }
    } catch (err) {
      setPasswordError('Server error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setError('');
        localStorage.setItem('user', JSON.stringify({ ...user, name: data.name, email: data.email }));
      } else {
        setError(data.message);
        setMessage('');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          localStorage.clear();
          navigate('/');
        } else {
          const data = await res.json();
          setError(data.message);
        }
      } catch (err) {
        setError('Server error');
      }
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
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
          <div className="font-black text-4xl tracking-tight flex items-center space-x-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
            <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
              <span>Dashboard</span>
              <ChevronDown size={18} />
            </div>
            <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
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
            <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <MessageSquare size={20} />
              <span>Complaints</span>
            </div>
            <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div
              onClick={() => navigate(['Admin', 'Warden', 'Accountant'].includes(user.role) ? '/admin-food-order' : '/student-food-order')}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium"
            >
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

        {/* Main Content */}
        <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto">
          <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8 relative">My Profile</h1>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-3xl">
            {message && <div className="mb-6 bg-teal-50 text-teal-700 px-4 py-3 rounded-lg font-medium">{message}</div>}
            {error && <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg font-medium">{error}</div>}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                  <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Hambanthota">Hambanthota</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Guardian Name</label>
                  <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow transition-colors">
                    Update Profile
                  </button>
                  <button type="button" onClick={handleDelete} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 rounded-xl shadow-sm transition-colors border border-red-200">
                    Delete Account
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Key size={20} />
                  Change / Forgot Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Password Modal Overlay */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="p-6">
              {passwordMessage && <div className="mb-4 bg-teal-50 text-teal-700 px-4 py-2 rounded font-medium text-sm">{passwordMessage}</div>}
              {passwordError && <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded font-medium text-sm">{passwordError}</div>}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password (optional)</label>
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Leave blank if forgotten" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="submit" 
                  className="bg-[#107c7c] hover:bg-[#0c6161] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                  <Key size={18} />
                  Update Password
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
