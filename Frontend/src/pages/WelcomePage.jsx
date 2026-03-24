import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import welcomeBackground from '../assets/hostel_bg.png';
import staySphereLogo from '../assets/staysphere logo.png';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <img
        src={welcomeBackground}
        alt="Hostel background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <img
          src={staySphereLogo}
          alt="StaySphere logo"
          className="w-72 md:w-[460px] h-auto object-contain mx-auto -mb-16 drop-shadow-2xl"
        />

        <h1 className="text-5xl md:text-7xl font-extrabold mb-3 tracking-tight whitespace-nowrap drop-shadow-lg">
          <span className="text-black">Welcome to </span>
          <span className="text-slate-400">Stay</span>
          <span className="text-[#4BB580]">Sphere</span>
        </h1>
        <p className="text-xl md:text-4xl text-[#4BB580] font-semibold mb-8">
          “Your Home Away From Home”
        </p>

        <button
          type="button"
          onClick={() => navigate('/student-login')}
          className="inline-flex items-center gap-2 bg-[#4BB580] hover:bg-[#3d9e6d] text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Get Start
          <ArrowRight size={40} />
        </button>
      </div>
    </div>
  );
}
