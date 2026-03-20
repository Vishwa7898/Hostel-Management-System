import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, ChevronDown } from 'lucide-react';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'Student' })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/student-dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-600 via-teal-400 to-green-300 font-sans">
      {/* Sidebar (as per screenshot) */}
      <div className="w-64 bg-white/95 text-slate-800 p-6 flex flex-col hidden md:flex rounded-r-3xl shadow-2xl z-10">
        <div className="font-bold text-3xl text-teal-700 mb-10 tracking-tight">Stay<span className="text-teal-500">Sphere</span></div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-teal-800 rounded-lg cursor-pointer font-medium mb-4">
            <span>Student View</span>
            <ChevronDown size={18} />
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 transition-colors">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 transition-colors">
            <Home size={20} />
            <span>Room Allocation</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 transition-colors">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 transition-colors">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
        </div>

        <div className="text-sm text-slate-500 text-center mt-auto">
          <p>© 2026 StaySphere |</p>
          <p>MERN Stack</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-md">Student Login</h1>
        
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Student Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1 ml-1">Please enter a valid email address</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-700 font-medium">Remember Me</label>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#4BB580] hover:bg-[#3d9e6d] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Login
            </button>
            
            <div className="text-center mt-4">
              <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
