import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

export default function StudentComplaint() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('room');
  const [roomNumber, setRoomNumber] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
  }, [navigate, token, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!category || !title || !description || !locationType) {
      return setError('Please fill in all required fields.');
    }
    
    if (locationType === 'room') {
      if (!roomNumber) {
        return setError('Room number is required for room complaints.');
      }
      
      const validRooms = {
        1: ["101", "102", "103", "104", "105"],
        2: ["106", "107", "108", "109", "110"],
        3: ["111", "112", "113", "114", "115"],
        4: ["116", "117", "118", "119", "120"]
      };
      
      const floor = roomNumber.charAt(0);
      if (!validRooms[floor] || !validRooms[floor].includes(roomNumber)) {
        return setError(`Invalid room number. Please select a valid room.`);
      }
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          title,
          description,
          locationType,
          roomNumber: locationType === 'room' ? roomNumber : '',
          anonymous
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Complaint submitted successfully');
        setCategory('');
        setTitle('');
        setDescription('');
        setRoomNumber('');
        setAnonymous(false);
      } else {
        setError(data.message || 'Error submitting complaint');
      }
    } catch {
      setError('Server error connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentShell activeKey="complaints" title="Submit Complaint">
      <div className="flex-1 w-full">
          <div className="mb-10 grid gap-8">
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-teal-700 font-semibold">Maintenance Hub</p>
                    <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900">Submit your request with confidence</h1>
                    <p className="mt-5 max-w-2xl text-slate-600 leading-8">Report any issue in your accommodation or shared facilities. Our team reviews complaints daily and works to resolve them promptly.</p>
                  </div>
                  <div className="rounded-[28px] bg-teal-100 p-4 flex items-center justify-center w-28 h-28 border border-teal-200">
                    <MessageSquare className="text-teal-700" size={36} />
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-700 to-cyan-700 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
                  <p className="text-lg font-semibold">Track your complaints</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100/90">View the status and progress of all your submitted complaints.</p>
                  <button 
                    onClick={() => navigate('/student-complaints')}
                    className="mt-4 bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-4 rounded-2xl font-semibold text-sm transition-colors"
                  >
                    View My Complaints →
                  </button>
                </div>
                <div className="rounded-[28px] border border-teal-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-teal-700 font-semibold">Tips for faster resolution</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>- Use a clear title with issue type</li>
                    <li>- Mention exact room/location details</li>
                    <li>- Add concise steps or symptoms</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-teal-200 bg-gradient-to-br from-slate-50 via-white to-teal-50 p-6 md:p-8 shadow-[0_20px_50px_rgba(13,148,136,0.14)]">
              <div className="max-w-4xl mx-auto w-full">
                <div className="rounded-[28px] bg-white p-6 md:p-8 text-slate-900 shadow-[0_24px_60px_rgba(13,148,136,0.2)] border-2 border-teal-300 ring-4 ring-teal-100/70">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-teal-700 font-semibold">Complaint Form</p>
                      <h3 className="mt-3 text-3xl font-bold text-slate-900">Tell us what needs fixing</h3>
                    </div>
                    <div className="rounded-full bg-teal-100 p-3 ring-2 ring-teal-200">
                      <AlertCircle className="text-teal-700" size={26} />
                    </div>
                  </div>
                  {error && (
                    <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2">
                      <AlertCircle size={18} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2">
                      <CheckCircle size={18} /> {success}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Location Type <span className="text-orange-500">*</span></label>
                        <select 
                          value={locationType} 
                          onChange={e => setLocationType(e.target.value)} 
                          className="w-full p-3 border border-slate-200 rounded-3xl bg-slate-50 text-slate-700 font-medium outline-none transition-all duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-200/60"
                        >
                          <option value="room">Room</option>
                          <option value="general">General (Common Area)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category <span className="text-orange-500">*</span></label>
                        <select 
                          value={category} 
                          onChange={e => setCategory(e.target.value)} 
                          className="w-full p-3 border border-slate-200 rounded-3xl bg-slate-50 text-slate-700 font-medium outline-none transition-all duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-200/60"
                        >
                          <option value="">Select Category</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Cleaning">Cleaning / Hygiene</option>
                          <option value="Internet">Wi-Fi / Internet</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    {locationType === 'room' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number <span className="text-orange-500">*</span></label>
                        <select 
                          value={roomNumber} 
                          onChange={e => setRoomNumber(e.target.value)} 
                          className="w-full p-3 border border-slate-200 rounded-3xl bg-slate-50 text-slate-700 font-medium outline-none transition-all duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-200/60 appearance-none"
                        >
                          <option value="">Select a room...</option>
                          <optgroup label="Floor 1" className="bg-white text-cyan-700">
                            <option value="101">Room 101</option>
                            <option value="102">Room 102</option>
                            <option value="103">Room 103</option>
                            <option value="104">Room 104</option>
                            <option value="105">Room 105</option>
                          </optgroup>
                          <optgroup label="Floor 2" className="bg-white text-cyan-700">
                            <option value="106">Room 106</option>
                            <option value="107">Room 107</option>
                            <option value="108">Room 108</option>
                            <option value="109">Room 109</option>
                            <option value="110">Room 110</option>
                          </optgroup>
                          <optgroup label="Floor 3" className="bg-white text-cyan-700">
                            <option value="111">Room 111</option>
                            <option value="112">Room 112</option>
                            <option value="113">Room 113</option>
                            <option value="114">Room 114</option>
                            <option value="115">Room 115</option>
                          </optgroup>
                          <optgroup label="Floor 4" className="bg-white text-cyan-700">
                            <option value="116">Room 116</option>
                            <option value="117">Room 117</option>
                            <option value="118">Room 118</option>
                            <option value="119">Room 119</option>
                            <option value="120">Room 120</option>
                          </optgroup>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Title <span className="text-orange-500">*</span></label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="Brief description of the issue" 
                        className="w-full p-3 border border-slate-200 rounded-3xl bg-slate-50 text-slate-700 font-medium outline-none transition-all duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-200/60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description <span className="text-orange-500">*</span></label>
                      <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Provide full details about the issue..." 
                        className="w-full p-3 border border-slate-200 rounded-3xl bg-slate-50 text-slate-700 font-medium resize-none h-36 outline-none transition-all duration-200 hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-200/60"
                      ></textarea>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                      <input 
                        type="checkbox" 
                        id="anonymous" 
                        checked={anonymous} 
                        onChange={e => setAnonymous(e.target.checked)} 
                        className="w-5 h-5 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-400 cursor-pointer"
                      />
                      <label htmlFor="anonymous" className="text-sm font-semibold text-slate-700 cursor-pointer flex-1">
                        Submit Anonymously
                        <p className="text-xs text-slate-500 font-medium mt-1">Your name won't be visible to administration.</p>
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white py-4 rounded-3xl font-semibold text-lg shadow-[0_18px_40px_rgba(13,148,136,0.25)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
      </div>
    </StudentShell>
  );
}