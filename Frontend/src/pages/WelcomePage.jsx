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
      <div className="w-full max-w-xl rounded-3xl bg-black/35 backdrop-blur-sm border border-white/30 p-8 md:p-12 text-center shadow-2xl">
        <img
          src={staySphereLogo}
          alt="StaySphere logo"
          className="w-36 md:w-44 mx-auto mb-5 drop-shadow-lg"
        />

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Welcome to StaySphere
        </h1>
        <p className="text-lg md:text-xl text-white/95 font-medium mb-8">
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
