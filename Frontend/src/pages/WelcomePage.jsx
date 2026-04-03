import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BedDouble, Building2, ShieldCheck, UtensilsCrossed, Book, Key, Smile, School, Coffee } from 'lucide-react';
import staySphereLogo from '../assets/staysphere logo.png';
import sliitCampusImage from '../assets/hostel_bg.png';
import hostelRoomImage from '../assets/hostel-room.jpg';
import studyImage from '../assets/study.avif';
import studentDiningImage from '../assets/student_dining.jpg';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-800 selection:bg-cyan-100 overflow-x-hidden">
      {/* Custom Styles for Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 border-b border-cyan-400/30 bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <img src={staySphereLogo} alt="StaySphere logo" className="h-20 w-auto object-contain" />
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-widest font-bold text-white">SLIIT Hostel Management</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">Stay<span className="text-yellow-200">Sphere</span></h1>
            </div>
          </div>

          <div className="hidden items-center gap-9 text-xl font-bold text-white md:flex">
            {['Home', 'Facilities', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-cyan-100 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/student-register')}
            className="rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 px-7 py-3 text-base font-bold text-white shadow-xl shadow-cyan-300/50 transition-all hover:scale-105 active:scale-95"
          >
            New Student Register
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (The "Fuller" Middle Part) --- */}
      <section id="home" className="relative mx-auto flex min-h-[85vh] w-full max-w-7xl items-center px-5 py-12 md:px-8">
        
        {/* Background Decorative Icons & Paths */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
            <path d="M100,200 Q400,50 600,300 T900,100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="150" cy="400" r="40" className="fill-purple-100" />
            <circle cx="850" cy="700" r="60" className="fill-blue-50" />
          </svg>
          
          <School className="animate-float absolute top-[15%] left-[5%] text-purple-300 opacity-40" size={48} />
          <Book className="animate-float absolute bottom-[25%] left-[10%] text-blue-300 opacity-40" size={40} style={{ animationDelay: '1s' }} />
          <Key className="animate-float absolute top-[10%] left-[45%] text-yellow-300 opacity-40" size={32} style={{ animationDelay: '2s' }} />
          <Smile className="animate-float absolute top-[20%] right-[10%] text-pink-300 opacity-40" size={44} style={{ animationDelay: '1.5s' }} />
          <Coffee className="animate-float absolute bottom-[15%] right-[20%] text-orange-200 opacity-40" size={36} />
        </div>

        <div className="relative z-10 grid w-full gap-12 md:grid-cols-2 items-center">
          <div className="flex flex-col justify-center text-center md:text-left">
            <div className="mb-6 inline-flex self-center md:self-start items-center rounded-full bg-cyan-50 px-6 py-3 text-base font-bold text-cyan-600 border border-cyan-100 shadow-md">
              Welcome to SLIIT Hostel Community
            </div>
            
            <h2 className="mb-6 text-6xl font-black leading-[1.1] md:text-8xl">
              " Your <span className="text-yellow-500 italic font-serif">Home</span> , <br />
              <span className="text-purple-500">Away From</span> <br />
              <span className="text-blue-600 italic font-serif">Home</span> "
            </h2>

            <p className="mb-10 text-lg font-medium text-slate-500 leading-relaxed max-w-md mx-auto md:mx-0">
              Easy room booking, quick hostel notices, and safer student life in one simple platform.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button
                type="button"
                onClick={() => navigate('/student-login')}
                className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
              >
                Student Login
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin-login')}
                className="rounded-2xl bg-orange-100 px-8 py-4 text-lg font-bold text-orange-600 border-2 border-orange-200 transition-all hover:bg-orange-200 active:scale-95"
              >
                Admin Login
              </button>
            </div>
          </div>

          {/* Right Image with Stylized Frame */}
          <div className="relative group">
            {/* Colorful Glow Background */}
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-cyan-300 via-purple-300 to-yellow-200 opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl">
              <img
                src={sliitCampusImage}
                alt="SLIIT campus life"
                className="h-full min-h-[450px] w-full object-cover transform transition duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Small Floating Card over image */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 hidden sm:block animate-float">
               <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Verified Stay</p>
                    <p className="text-sm font-black text-slate-800">100% Safe Campus</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FACILITIES SECTION (Modified for Consistency) --- */}
      <section id="facilities" className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
        <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="text-4xl font-black font-Britannic Boldtext-slate-800 mb-4">Hostel Facilities</h3>
            <div className="h-1.5 w-20 bg-cyan-500 rounded-full"></div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { img: hostelRoomImage, title: "Comfortable Rooms", icon: <BedDouble />, color: "blue", bg: "bg-blue-50", desc: "Well-maintained rooms with study desks and beds." },
            { img: studyImage, title: "Shared Living Spaces", icon: <Building2 />, color: "emerald", bg: "bg-green-50", desc: "Friendly common areas for reading and meeting friends." },
            { img: studentDiningImage, title: "Hygienic Mess", icon: <UtensilsCrossed />, color: "orange", bg: "bg-orange-50", desc: "Nutritious meals prepared daily with menu transparency." }
          ].map((item, idx) => (
            <article key={idx} className={`group overflow-hidden rounded-3xl ${item.bg} border-2 ${item.color === 'blue' ? 'border-blue-200' : item.color === 'emerald' ? 'border-green-200' : 'border-orange-200'} shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2`}>
              <div className="h-60 overflow-hidden">
                <img src={item.img} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="p-8">
                <p className={`mb-3 flex items-center gap-2 text-xl font-bold ${item.color === 'blue' ? 'text-blue-600' : item.color === 'emerald' ? 'text-green-600' : 'text-orange-600'}`}>
                  <span className={`text-${item.color}-500`}>{item.icon}</span> {item.title}
                </p>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- Keep Original About & Footer --- */}
      <section id="about" className="bg-slate-900 py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 md:px-8">
          <p className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"><ShieldCheck size={22} className="text-cyan-300" /> Safe and Smart Hostel Life</p>
          <p className="max-w-4xl text-slate-300 leading-relaxed">
            StaySphere helps students and administrators manage hostel operations with better communication,
            digital records, and organized room systems built for SLIIT students.
          </p>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 px-5 py-8 text-slate-200 border-t border-slate-800 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h4 className="text-lg font-bold text-white">StaySphere</h4>
            <p className="mt-2 text-base text-slate-400">Hostel Management System - SLIIT Campus</p>
          </div>
          <div className="text-base text-slate-400">
            <p>Email: <span className="text-cyan-400">hostels@sliit.lk</span></p>
            <p>Phone: +94 11 754 4801</p>
            <p>Location: SLIIT Malabe Campus, Sri Lanka</p>
          </div>
        </div>
        <div className="mx-auto mt-6 w-full max-w-7xl border-t border-slate-800 pt-4 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} StaySphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}