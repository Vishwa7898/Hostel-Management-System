import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BedDouble, Building2, ShieldCheck } from 'lucide-react';
import staySphereLogo from '../assets/staysphere logo.png';
import sliitCampusImage from '../assets/hostel_bg.png';
import hostelRoomImage from '../assets/hostel-room.jpg';
import studyImage from '../assets/study.avif';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-yellow-50 text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-cyan-600/40 bg-gradient-to-r from-cyan-500/90 to-blue-700/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <img src={staySphereLogo} alt="StaySphere logo" className="h-24 w-auto object-contain" />
            <div>
              <p className="text-sm font-semibold text-cyan-100">SLIIT Hostel Management</p>
              <h1 className="text-4xl font-black"><span className="text-cyan-100">Stay</span><span className="text-cyan-300">Sphere</span></h1>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-lg font-bold text-white md:flex">
            <a href="#home" className="transition text-white hover:text-cyan-200">Home</a>
            <a href="#facilities" className="transition text-white hover:text-cyan-200">Facilities</a>
            <a href="#about" className="transition text-white hover:text-cyan-200">About</a>
            <a href="#contact" className="transition text-white hover:text-cyan-200">Contact</a>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student-register')}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white transition hover:from-cyan-400 hover:to-blue-400"
          >
            New Student Register
          </button>
        </div>
      </nav>

      <section id="home" className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 pt-8 md:grid-cols-2 md:px-8 md:pt-12">
        <div className="flex flex-col justify-center">
          <p className="mb-3 inline-block w-fit rounded-full bg-cyan-500/20 px-3 py-1 text-lg font-bold text-cyan-700">
            Welcome to SLIIT Hostel Community
          </p>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl text-slate-900">
            "Your Home , Away From Home "
          </h2>
          <p className="mb-6 text-lg text-slate-700">
            Easy room booking, quick hostel notices, and safer student life in one simple platform.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/student-login')}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white shadow transition hover:bg-cyan-600"
            >
              Student Login
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin-login')}
              className="rounded-xl border border-orange-300 bg-orange-200 px-6 py-3 font-bold text-orange-900 transition hover:bg-orange-300"
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={sliitCampusImage}
            alt="SLIIT campus"
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
      </section>

      <section id="facilities" className="mx-auto w-full max-w-7xl px-5 pb-14 md:px-8">
        <h3 className="mb-6 text-2xl font-extrabold text-slate-900">Hostel Facilities</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={hostelRoomImage} alt="Comfortable hostel room" className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="mb-2 flex items-center gap-2 text-lg font-bold"><BedDouble size={20} /> Comfortable Rooms</p>
              <p className="text-slate-700">
                Well-maintained rooms with study desks, beds, and quiet environment for students.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={studyImage} alt="Hostel common area" className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="mb-2 flex items-center gap-2 text-lg font-bold"><Building2 size={20} /> Shared Living Spaces</p>
              <p className="text-slate-600">
                Friendly common areas for reading, meeting friends, and relaxing after lectures.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section id="about" className="bg-slate-900 py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 md:px-8">
          <p className="flex items-center gap-2 text-xl font-bold text-cyan-200"><ShieldCheck size={22} /> Safe and Smart Hostel Life</p>
          <p className="max-w-4xl text-slate-300">
            StaySphere helps students and administrators manage hostel operations with better communication,
            digital records, and organized room systems built for SLIIT students.
          </p>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 px-5 py-8 text-slate-200 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h4 className="text-lg font-bold text-white">StaySphere</h4>
            <p className="mt-2 text-base text-slate-400">Hostel Management System - SLIIT Campus</p>
          </div>
          <div className="text-base text-slate-300">
            <p>Email: hostels@sliit.lk</p>
            <p>Phone: +94 11 754 4801</p>
            <p>Location: SLIIT Malabe Campus, Sri Lanka</p>
          </div>
        </div>
        <div className="mx-auto mt-6 w-full max-w-7xl border-t border-slate-700 pt-4 text-sm text-slate-400">
          © {new Date().getFullYear()} StaySphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
