import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import welcomeBackground from '../assets/images3.jpg';
import staySphereLogo from '../assets/staysphere logo.png';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${welcomeBackground})` }}
    >
      <div className="w-full max-w-4xl text-center">
        <img
          src={staySphereLogo}
          alt="StaySphere logo"
          className="w-56 md:w-72 mx-auto mb-6 drop-shadow-2xl"
        />

        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight whitespace-nowrap drop-shadow-lg">
          <span className="text-white">Welcome to </span>
          <span className="text-slate-400">Stay</span>
          <span className="text-[#4BB580]">Sphere</span>
        </h1>
        <p className="text-lg md:text-xl text-white font-medium mb-8 drop-shadow-md">
          Stay Smart. Live Better.
        </p>

        <button
          type="button"
          onClick={() => navigate('/student-login')}
          className="inline-flex items-center gap-2 bg-[#4BB580] hover:bg-[#3d9e6d] text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Get Start
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
