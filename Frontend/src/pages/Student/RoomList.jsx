import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentShell from '../../components/layout/StudentShell';

const RoomList = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return navigate('/student-login');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setError('');
      const res = await axios.get('http://localhost:5000/api/rooms/available', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load rooms. Please log in and make sure backend is running.');
    }
  };

  const getRoomImageCandidates = (room) => {
    const localByNumber = [`/assets/rooms/${room.roomNumber}.jpg`, `/assets/rooms/${room.roomNumber}.png`];

    const localByType = [`/assets/rooms/${room.roomType}.jpg`, `/assets/rooms/${room.roomType}.png`];

    const apiImages = Array.isArray(room.images) ? room.images : [];
    return [
      ...apiImages,
      ...localByNumber,
      ...localByType,
      `https://picsum.photos/seed/${room.roomNumber}/500/300`
    ];
  };

  const getRoomImage = (room) => {
    const candidates = getRoomImageCandidates(room);
    if (Array.isArray(room.images) && room.images.length > 0) {
      return room.images[0] || candidates[0];
    }
    return candidates[0];
  };

  const getTodayLocalDateString = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleBookRoom = async () => {
    if (!checkInDate) {
      setError('Please select a check-in date.');
      return;
    }

    const today = getTodayLocalDateString();
    if (checkInDate < today) {
      setError('Check-in date cannot be in the past.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/rooms/book',
        { roomId: selectedRoom._id, checkInDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessage(res.data.message || 'Booking request sent successfully!');
      setSelectedRoom(null);
      setCheckInDate('');
      fetchAvailableRooms(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <StudentShell activeKey="rooms" title="Room Details" subtitle="Browse available rooms and submit a booking request.">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <button
            type="button"
            onClick={fetchAvailableRooms}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.99]"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No rooms available at the moment.
            </div>
          ) : (
            rooms.map((room) => (
              <article
                key={room._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative">
                  <img
                    src={getRoomImage(room)}
                    alt={`Room ${room.roomNumber}`}
                    className="h-44 w-full object-cover"
                    onError={(e) => {
                      const tried = e.currentTarget.dataset.tried ? Number(e.currentTarget.dataset.tried) : 0;
                      const candidates = getRoomImageCandidates(room);
                      const nextIndex = tried + 1;
                      if (nextIndex < candidates.length) {
                        e.currentTarget.dataset.tried = String(nextIndex);
                        e.currentTarget.src = candidates[nextIndex];
                      }
                    }}
                  />

                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold tracking-wide text-white">
                      {String(room.roomType || '').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800">
                        Room {room.roomNumber}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Floor {room.floor} • Capacity {room.currentOccupants}/{room.capacity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-500">Monthly</p>
                      <p className="text-base font-extrabold text-emerald-600">
                        Rs.{room.pricePerMonth?.toLocaleString?.() ?? room.pricePerMonth}
                      </p>
                    </div>
                  </div>

                  {room.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                      {room.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 active:scale-[0.99]"
                    >
                      Book This Room
                    </button>

                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Book Room {selectedRoom.roomNumber}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Select a check-in date to submit a booking request.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="checkin-date" className="block text-sm font-bold text-slate-700">
                    Check-in Date
                  </label>
                  <input
                    id="checkin-date"
                    type="date"
                    min={getTodayLocalDateString()}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.99]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookRoom}
                  disabled={loading}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                >
                  {loading ? 'Processing...' : 'Confirm Booking Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
};

export default RoomList;
