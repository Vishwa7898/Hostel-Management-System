import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BedDouble, Building2, ShieldCheck } from 'lucide-react';
import staySphereLogo from '../assets/staysphere logo.png';
import sliitCampusImage from '../assets/sliit-campus.jpg';
import hostelRoomImage from '../assets/hostel-room.jpg';
import studyImage from '../assets/study.avif';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-200 text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <img src={staySphereLogo} alt="StaySphere logo" className="h-11 w-auto object-contain" />
            <div>
              <p className="text-sm font-semibold text-slate-500">SLIIT Hostel Management</p>
              <h1 className="text-xl font-extrabold text-slate-800">StaySphere</h1>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-[#4BB580]">Home</a>
            <a href="#facilities" className="transition hover:text-[#4BB580]">Facilities</a>
            <a href="#about" className="transition hover:text-[#4BB580]">About</a>
            <a href="#contact" className="transition hover:text-[#4BB580]">Contact</a>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student-login')}
            className="rounded-lg bg-[#4BB580] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3d9e6d]"
          >
            Student Login
          </button>
        </div>
      </nav>

      <section id="home" className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 pt-8 md:grid-cols-2 md:px-8 md:pt-12">
        <div className="flex flex-col justify-center">
          <p className="mb-3 inline-block w-fit rounded-full bg-[#4BB580]/15 px-3 py-1 text-sm font-bold text-[#2f8657]">
            Welcome to SLIIT Hostel Community
          </p>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Your trusted place to stay, study, and grow.
          </h2>
          <p className="mb-6 text-lg text-slate-600">
            Easy room booking, quick hostel notices, and safer student life in one simple platform.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/student-register')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4BB580] px-6 py-3 font-bold text-white shadow transition hover:bg-[#3d9e6d]"
            >
              Register Now
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin-login')}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
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
        <h3 className="mb-6 text-2xl font-extrabold text-slate-800">Hostel Facilities</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={hostelRoomImage} alt="Comfortable hostel room" className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="mb-2 flex items-center gap-2 text-lg font-bold"><BedDouble size={20} /> Comfortable Rooms</p>
              <p className="text-slate-600">
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

      <section id="about" className="bg-white py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 md:px-8">
          <p className="flex items-center gap-2 text-xl font-bold text-slate-800"><ShieldCheck size={22} /> Safe and Smart Hostel Life</p>
          <p className="max-w-4xl text-slate-600">
            StaySphere helps students and administrators manage hostel operations with better communication,
            digital records, and organized room systems built for SLIIT students.
          </p>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 px-5 py-8 text-slate-200 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h4 className="text-lg font-bold text-white">StaySphere</h4>
            <p className="mt-2 text-sm text-slate-400">Hostel Management System - SLIIT Campus</p>
          </div>
          <div className="text-sm text-slate-300">
            <p>Email: hostels@sliit.lk</p>
            <p>Phone: +94 11 754 4801</p>
            <p>Location: SLIIT Malabe Campus, Sri Lanka</p>
          </div>
        </div>
        <div className="mx-auto mt-6 w-full max-w-7xl border-t border-slate-700 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} StaySphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
