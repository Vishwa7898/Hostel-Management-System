import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Home, Users, Settings, FileText, CheckCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Warden');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Invalid credentials - please try again');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-700 via-teal-600 to-lime-400 font-sans relative overflow-hidden">
      {/* Background Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTIwIDIwaDIwdjIwSDIweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvc3ZnPg==')] pointer-events-none"></div>
      
      {/* Sidebar (as per screenshot) */}
      <div className="w-64 bg-slate-800/80 backdrop-blur-md text-white p-6 flex flex-col hidden md:flex z-10 border-r border-white/10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-12">
          <div className="w-8 h-8 bg-orange-500 rounded flex justify-center items-center text-white">
            <Home size={20} />
          </div>
          <span>StaySphere</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            <User size={18} />
            <span>Student</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 bg-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/30 cursor-pointer font-medium">
            <span className="w-5 flex justify-center"><CheckCircle size={18} /></span>
            <span>Admin</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            <Settings size={18} />
            <span>Management</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            <FileText size={18} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            <Users size={18} />
            <span>Staff</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">
            <Home size={18} />
            <span>Hostel</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 mb-16">
        
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 pt-10 relative mt-4">
          <div className="flex justify-center mb-4">
             <div className="flex items-center space-x-2 font-bold text-2xl text-slate-800">
              <div className="text-orange-500"><Home size={28} /></div>
              <span>StaySphere</span>
             </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 tracking-tight">Admin / Warden Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 pr-20 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="Password must be at least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm bg-teal-500 text-white px-2 py-1 rounded shadow cursor-pointer hover:bg-teal-600 transition-colors">
                  {showPassword ? 'Hide' : 'Example'}
                </button>
              </div>
              <p className="text-xs text-red-500 mt-1 ml-1">Password must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Role
              </label>
              <select 
                title="role"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white appearance-none"
              >
                <option value="Warden">Warden / Accountant / Admin</option>
                <option value="Admin">Admin</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ec8824] hover:bg-[#d6761b] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all mt-2 active:scale-[0.98]"
            >
              Login
            </button>

            {error && <p className="text-red-500 text-sm text-center font-medium mt-3">{error}</p>}
          </form>
        </div>
      </div>
      
      {/* Bottom Orange Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#ec8824] flex flex-col justify-center items-center text-white z-20">
         <div className="flex items-center space-x-2 font-bold text-lg">
            <span className="opacity-90"><Home size={18} /></span>
            <span>StaySphere</span>
         </div>
         <p className="text-xs opacity-90">Hostel Management System</p>
      </div>
    </div>
  );
}
