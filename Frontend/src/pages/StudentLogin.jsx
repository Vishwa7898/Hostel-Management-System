import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, ChevronDown } from 'lucide-react';
import studentLoginBackground from '../assets/image4.jpg';

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
        const isAdmin = ['Admin', 'Warden', 'Accountant'].includes(data.role);
        navigate(isAdmin ? '/admin-dashboard' : '/student-home');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${studentLoginBackground})` }}
    >


      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold drop-shadow-lg mb-2 tracking-tight">
            <span className="text-gray-200">Welcome to </span>
            <span><span className="text-slate-500">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
          </h1>
          <p className="text-xl font-medium text-gray-200 drop-shadow-md tracking-wider uppercase">Hostel Management System</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all hover:scale-[1.01]">
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
            
            <div className="text-center mt-4 space-y-2">
              <div>
                <Link to="/student-register" className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
                  Don't have an account? Create one
                </Link>
              </div>
              <div>
                <Link to="/admin-login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  Are you an Admin/Warden? Login here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
