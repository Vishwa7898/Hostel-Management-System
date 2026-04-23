import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Eye, EyeOff, Upload, User } from 'lucide-react';
import hostelBackground from '../assets/hostel_bg.png';

export default function StudentRegister() {
  const sriLankanProvinces = [
    'Northern Province',
    'Southern Province',
    'Easten Province',
    'Western Province',
    'Central Province',
    'North Central province',
    'Sabaragamuwa Province',
    'Uva Province',
    'North Western Province'
  ];

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    studentPhone: '',
    email: '',
    password: '',
    guardianName: '',
    contactNumber: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const profileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const lettersOnlyFields = ['name', 'guardianName', 'city'];
    const phoneFields = ['studentPhone', 'contactNumber'];

    if (lettersOnlyFields.includes(name)) {
      const sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');
      setFormData({ ...formData, [name]: sanitizedValue });
      return;
    }

    if (phoneFields.includes(name)) {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: sanitizedValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const lettersWithSpacesRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!lettersWithSpacesRegex.test(formData.name.trim())) {
      return setError('Full Name can only contain letters and spaces.');
    }

    if (!lettersWithSpacesRegex.test(formData.guardianName.trim())) {
      return setError('Guardian Name can only contain letters and spaces.');
    }

    if (!lettersWithSpacesRegex.test(formData.city.trim())) {
      return setError('City can only contain letters and spaces.');
    }

    if (!formData.province) {
      return setError('Please select a province.');
    }

    if (!phoneRegex.test(formData.studentPhone)) {
      return setError('Student Phone Number must contain exactly 10 digits.');
    }

    if (!phoneRegex.test(formData.contactNumber)) {
      return setError('Guardian Phone Number must contain exactly 10 digits.');
    }

    if (!emailRegex.test(formData.email.trim())) {
      return setError('Please enter a valid email address with @.');
    }

    if (!profilePhoto) return setError('Please upload a profile photo');
    if (!nicFront) return setError('Please upload ID Card Front');
    if (!nicBack) return setError('Please upload ID Card Back');
    if (!agreedToTerms) return setError('Please accept the Terms and Conditions');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    submitData.append('profilePhoto', profilePhoto);
    submitData.append('nicFront', nicFront);
    submitData.append('nicBack', nicBack);
    submitData.append('role', 'Student');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/student-dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 font-sans overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(14, 180, 200, 0.2), rgba(39, 175, 108, 0.2)), url(${hostelBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent)]"></div>

      <div className="bg-white/95 backdrop-blur-xl w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        <div className="p-10 md:p-12">
          <form onSubmit={handleRegister} className="space-y-10">
            
            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-green-600 to-gray-600 bg-clip-text text-transparent mb-2">StaySphere</h1>
              <p className="text-3xl font-bold text-gray-800">Student Registration</p>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center">
              <div 
                onClick={() => profileInputRef.current.click()}
                className="group relative cursor-pointer"
              >
                <div className={`w-40 h-40 rounded-full border-8 border-white shadow-xl overflow-hidden bg-gradient-to-br from-pink-400 to-violet-400 transition-all duration-300 ${profilePhoto ? '' : 'hover:scale-105'}`}>
                  {profilePhoto ? (
                    <img 
                      src={URL.createObjectURL(profilePhoto)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                      <Camera size={48} className="mb-2 opacity-80" />
                      <p className="text-sm font-medium">Add Photo</p>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-violet-500">
                  <Upload size={20} className="text-violet-600" />
                </div>
                <input 
                  type="file" 
                  required 
                  ref={profileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <input 
                  type="text" name="name" required placeholder="Full Name" 
                  value={formData.name} onChange={handleInputChange}
                  pattern="[A-Za-z\s]+"
                  title="Full Name can only contain letters and spaces."
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                />

                <input 
                  type="text" name="address" required placeholder="Address" 
                  value={formData.address} onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                />

                <input 
                  type="text" name="city" required placeholder="City" 
                  value={formData.city} onChange={handleInputChange}
                  pattern="[A-Za-z\s]+"
                  title="City can only contain letters and spaces."
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                />

                <select
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all"
                >
                  <option value="">Select Province</option>
                  {sriLankanProvinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>

                <input 
                  type="tel" name="studentPhone" required placeholder="Student Phone Number" 
                  value={formData.studentPhone} onChange={handleInputChange}
                  maxLength={10}
                  pattern="\d{10}"
                  title="Student Phone Number must be exactly 10 digits."
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                />

                <input 
                  type="email" name="email" required placeholder="Email Address" 
                  value={formData.email} onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                />

                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" required placeholder="Create Password" 
                    value={formData.password} onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-600"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Right Column - ID Uploads */}
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    ID Card Front <span className="text-red-500 text-xl">*</span>
                  </p>
                  <div className="border-2 border-dashed border-violet-300 hover:border-violet-500 rounded-3xl h-52 flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 transition-all overflow-hidden group relative">
                    {nicFront ? (
                      <img src={URL.createObjectURL(nicFront)} className="w-full h-full object-cover" alt="ID Front" />
                    ) : (
                      <div className="text-center">
                        <Upload size={40} className="mx-auto text-violet-400 mb-3" />
                        <p className="font-medium text-violet-700">Upload Front Side</p>
                        <p className="text-sm text-slate-500 mt-1">Click or drag image</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      required 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={e => setNicFront(e.target.files[0])} 
                    />
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    ID Card Back <span className="text-red-500 text-xl">*</span>
                  </p>
                  <div className="border-2 border-dashed border-violet-300 hover:border-violet-500 rounded-3xl h-52 flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 transition-all overflow-hidden group relative">
                    {nicBack ? (
                      <img src={URL.createObjectURL(nicBack)} className="w-full h-full object-cover" alt="ID Back" />
                    ) : (
                      <div className="text-center">
                        <Upload size={40} className="mx-auto text-violet-400 mb-3" />
                        <p className="font-medium text-violet-700">Upload Back Side</p>
                        <p className="text-sm text-slate-500 mt-1">Click or drag image</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      required 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={e => setNicBack(e.target.files[0])} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input 
                type="text" name="guardianName" required placeholder="Guardian Name" 
                value={formData.guardianName} onChange={handleInputChange}
                pattern="[A-Za-z\s]+"
                title="Guardian Name can only contain letters and spaces."
                className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
              />
              <input 
                type="tel" name="contactNumber" required placeholder="Guardian Phone Number" 
                value={formData.contactNumber} onChange={handleInputChange}
                maxLength={10}
                pattern="\d{10}"
                title="Guardian Phone Number must be exactly 10 digits."
                className="w-full px-6 py-4 rounded-2xl border border-transparent bg-zinc-100 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-200 outline-none text-lg transition-all" 
              />
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
                📋 Terms & Conditions
              </h3>
              <ul className="space-y-3 text-rose-700 text-[15px]">
                {[
                  "Daily check-in & check-out is mandatory using the system",
                  "Alcohol and illegal drugs are strictly prohibited",
                  "No fighting, harassment or disturbances allowed",
                  "Respect all residents and hostel staff at all times",
                  "Guardian details must be accurate for emergencies",
                  "Follow all safety & security guidelines",
                  "Maintain discipline and good conduct",
                  "Any illegal or unethical activity is strictly forbidden"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <label className="mt-6 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1.5 h-5 w-5 accent-violet-600 rounded"
                  required
                />
                <span className="text-slate-700 font-medium">
                  I have read and agree to the Terms and Conditions
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-2xl text-center font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all active:scale-[0.985] flex items-center justify-center gap-3"
            >
              Register Student
              <span className="text-2xl">🚀</span>
            </button>

            <div className="text-center">
              <Link 
                to="/student-login" 
                className="text-violet-600 hover:text-violet-800 font-semibold transition-colors"
              >
                Already have an account? Return to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}