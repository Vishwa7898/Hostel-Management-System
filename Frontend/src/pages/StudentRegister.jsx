import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Eye, EyeOff } from 'lucide-react';

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', studentPhone: '', email: '', password: '', guardianName: '', contactNumber: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const profileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!profilePhoto) return setError('Please upload a profile photo');
    if (!nicFront) return setError('Please upload ID Card Front');
    if (!nicBack) return setError('Please upload ID Card Back');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    submitData.append('profilePhoto', profilePhoto);
    submitData.append('nicFront', nicFront);
    submitData.append('nicBack', nicBack);
    submitData.append('role', 'Student');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        // Note: When using FormData, do NOT set Content-Type manually. Fetch sets it automatically with the boundary.
        body: submitData
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/student-dashboard');
      } else {
        setError(data.message || 'Error occurred during registration');
      }
    } catch (err) {
      setError('Server error while connecting to backend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hostel-bg-student p-6 font-sans">
      <div className="bg-white/80 backdrop-blur-lg border border-teal-100/50 w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12 relative flex flex-col items-center">

        <div className="text-center mb-8 font-outfit">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">
            <span className="text-slate-500">Stay</span>
            <span className="text-[#4BB580]">Sphere</span>
          </h1>
          <h2 className="text-3xl font-extrabold text-[#8b4513] mt-1">Student Registration</h2>
        </div>

        <form onSubmit={handleRegister} className="w-full flex flex-col items-center">

          {/* Profile Photo Circular Upload */}
          <div className="mb-10 relative cursor-pointer group" onClick={() => profileInputRef.current.click()}>
            <div className={`w-36 h-36 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md transition-all ${profilePhoto ? '' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
              {profilePhoto ? (
                <img src={URL.createObjectURL(profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={48} className="text-slate-500 opacity-60" />
              )}
            </div>
            <input type="file" required ref={profileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Left Column Text Fields */}
            <div className="space-y-4">
              <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />

              <input type="text" name="address" required placeholder="Address" value={formData.address} onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />

              <input type="text" name="city" required placeholder="City" value={formData.city} onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />

              <input type="text" name="studentPhone" required placeholder="Student Phone Number" value={formData.studentPhone} onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />

              <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />

              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="Password" value={formData.password} onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Right Column File Uploads */}
            <div className="space-y-6">

              <div className="bg-slate-200/50 p-4 rounded-2xl relative">
                <p className="font-semibold text-slate-800 mb-2">ID Card Front <span className="text-red-500">*</span></p>
                <div className="flex bg-slate-300 w-full h-24 rounded-xl items-center justify-center relative overflow-hidden border-2 border-dashed border-slate-400">
                  {nicFront ? (
                    <img src={URL.createObjectURL(nicFront)} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="opacity-50">Upload Front</div>
                  )}
                  <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNicFront(e.target.files[0])} />
                </div>
              </div>

              <div className="bg-slate-200/50 p-4 rounded-2xl relative">
                <p className="font-semibold text-slate-800 mb-2">ID Card Back <span className="text-red-500">*</span></p>
                <div className="flex bg-slate-300 w-full h-24 rounded-xl items-center justify-center relative overflow-hidden border-2 border-dashed border-slate-400">
                  {nicBack ? (
                    <img src={URL.createObjectURL(nicBack)} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="opacity-50">Upload Back</div>
                  )}
                  <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNicBack(e.target.files[0])} />
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <input type="text" name="guardianName" required placeholder="Guardian Name" value={formData.guardianName} onChange={handleInputChange}
              className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-400 outline-none text-slate-800" />

            <input type="text" name="contactNumber" required placeholder="Guardian Phone Number" value={formData.contactNumber} onChange={handleInputChange}
              className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-teal-400 outline-none text-slate-800" />
          </div>

          {error && <p className="text-red-600 font-semibold mt-4 bg-red-100 px-4 py-2 rounded-lg">{error}</p>}

          <button type="submit" className="w-full bg-[#4BB580] hover:bg-[#3d9e6d] text-white font-bold text-xl py-4 rounded-xl mt-8 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
            Register Student
          </button>

          <Link to="/" className="text-teal-600 hover:text-teal-800 font-medium mt-6 transition-colors">
            Return to Login
          </Link>

        </form>
      </div>
    </div>
  );
}
