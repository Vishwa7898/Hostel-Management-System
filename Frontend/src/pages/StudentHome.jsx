import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Home,
  LogOut,
  ShieldCheck,
  UtensilsCrossed,
} from 'lucide-react';
import staySphereLogo from '../assets/staysphere logo.png';
import sliitCampusImage from '../assets/hostel_bg.png';
import hostelRoomImage from '../assets/hostel-room.jpg';
import hostelCommonAreaImage from '../assets/hostel-common-area.jpg';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', tea: 'Tea' };

export default function StudentHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!token) {
      navigate('/student-login');
      return;
    }
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) {
      navigate('/admin-dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, roomsRes] = await Promise.all([
          fetch('http://localhost:5000/api/food/orders/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/rooms/mybookings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const ordersData = await ordersRes.json();
        const roomsData = await roomsRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
        setBookings(Array.isArray(roomsData) ? roomsData.slice(0, 6) : []);
      } catch {
        setOrders([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token, user.role]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-green-50 text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-cyan-600/40 bg-gradient-to-r from-cyan-500/90 to-blue-700/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <img src={staySphereLogo} alt="StaySphere logo" className="h-20 w-auto object-contain" />
            <div>
              <p className="text-base font-semibold text-cyan-100">SLIIT Hostel Management</p>
              <h1 className="text-2xl font-extrabold text-white">StaySphere</h1>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-lg font-semibold text-white md:flex">
            <a href="#home" className="transition hover:text-cyan-200">Home</a>
            <a
              href="#facilities"
              className="transition hover:text-cyan-200"
            >
              Facilities
            </a>
            <a href="#about" className="transition hover:text-cyan-200">About</a>
            <a href="#contact" className="transition hover:text-cyan-200">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/student-dashboard')}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-cyan-300"
            >
              Student Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </span>
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-10 pt-8 md:grid-cols-2 md:px-8 md:pt-12">
        <div className="flex flex-col justify-center">
          <p className="mb-3 inline-block w-fit rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-bold text-cyan-700">
            Welcome, {user.name || 'Student'}
          </p>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Manage your hostel life in one place.
          </h2>
          <p className="mb-6 max-w-xl text-lg text-slate-600">
            You can view your recent food orders and room booking details as you scroll down.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/student-food-order')}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white shadow transition hover:bg-cyan-600"
            >
              Food Order
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/student-rooms')}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Room Details
            </button>
            <button
              type="button"
              onClick={() => scrollToId('room-details')}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
            >
              View My Rooms
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
        <h3 className="mb-6 text-2xl font-extrabold text-slate-800">Your Quick Facilities</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={hostelRoomImage} alt="Comfortable hostel room" className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="mb-2 flex items-center gap-2 text-lg font-bold">
                <BedDouble size={20} /> Room Details
              </p>
              <p className="mb-4 text-slate-600">
                Browse your room booking info and manage requests.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToId('room-details')}
                  className="rounded-lg bg-[#4BB580] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3d9e6d]"
                >
                  Scroll to My Rooms
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/student-rooms')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Manage
                </button>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={hostelCommonAreaImage} alt="Hostel common area" className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="mb-2 flex items-center gap-2 text-lg font-bold">
                <Building2 size={20} /> Food Orders
              </p>
              <p className="mb-4 text-slate-600">
                See your recent meal orders at the bottom of this page.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToId('food-orders')}
                  className="rounded-lg bg-[#4BB580] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3d9e6d]"
                >
                  Scroll to My Orders
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/student-food-order')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Order Food
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="about" className="bg-white py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 md:px-8">
          <p className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <ShieldCheck size={22} /> Safe and Smart Hostel Life
          </p>
          <p className="max-w-4xl text-slate-600">
            StaySphere helps students manage hostel operations with room booking, food orders, and digital updates designed for SLIIT students.
          </p>
        </div>
      </section>

      <section id="food-orders" className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-extrabold text-slate-800">My Recent Food Orders</h3>
          <button
            type="button"
            onClick={() => navigate('/student-food-order')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-orange-600 transition hover:bg-slate-50"
          >
            <UtensilsCrossed size={18} />
            View all
          </button>
        </div>

        {loading ? (
          <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">No food orders yet.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Meal</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-50 text-sm">
                      <td className="py-3 px-4">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">{MEAL_LABELS[order.mealTime] || order.mealTime || '-'}</td>
                      <td className="py-3 px-4 font-semibold">Rs. {order.totalAmount ?? '-'}</td>
                      <td className="py-3 px-4 capitalize">{order.status || 'pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section id="room-details" className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-extrabold text-slate-800">My Room Details</h3>
          <button
            type="button"
            onClick={() => navigate('/student-rooms')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-slate-50"
          >
            <Home size={18} />
            Manage rooms
          </button>
        </div>

        {loading ? (
          <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">Loading room bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">No room booking details yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Room</p>
                <p className="text-xl font-extrabold text-slate-800">
                  {booking.room?.roomNumber ? `Room ${booking.room.roomNumber}` : 'Room N/A'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Type: <span className="font-semibold">{booking.room?.roomType || '-'}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Check-in:{' '}
                  <span className="font-semibold">
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '-'}
                  </span>
                </p>
                <p className="text-sm text-slate-600">
                  Status: <span className="font-semibold capitalize">{booking.status || '-'}</span>
                </p>
              </article>
            ))}
          </div>
        )}
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
