import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  CreditCard,
  Bell,
  UtensilsCrossed,
  LogOut
} from 'lucide-react';

const RoomManagement = () => {
  const navigate = useNavigate();
  const displayStudent = (student) => {
    if (!student) return 'Student';
    if (typeof student === 'string') return `Student (${student.slice(-6)})`;
    if (student.name) return student.name;
    if (student._id) return `Student (${String(student._id).slice(-6)})`;
    return 'Student';
  };
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    roomNumber: '',
    floor: 1,
    roomType: 'triple',
    pricePerMonth: 45000,
    capacity: 3,
    availableBeds: 3,
    status: 'available',
    description: ''
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchAdminData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms/all', {
        headers: authHeaders()
      });
      setRooms(res.data.rooms || []);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load admin room data.');
      scrollToTop();
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['floor', 'pricePerMonth', 'capacity', 'availableBeds'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageDataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, imageDataUrl }));
    } catch (err) {
      setError('Failed to read image file.');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    scrollToTop();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please log in again.');
      return;
    }

    if (!form.roomNumber || !String(form.roomNumber).trim()) {
      setError('Room number is required.');
      return;
    }
    if (!Number.isFinite(form.floor) || form.floor < 1) {
      setError('Floor must be 1 or higher.');
      return;
    }
    if (!Number.isFinite(form.pricePerMonth) || form.pricePerMonth < 1000) {
      setError('Monthly rate must be at least Rs. 1000.');
      return;
    }
    if (!Number.isFinite(form.capacity) || form.capacity < 1) {
      setError('Total beds (capacity) must be 1 or higher.');
      return;
    }
    if (!Number.isFinite(form.availableBeds) || form.availableBeds < 0) {
      setError('Available beds cannot be negative.');
      return;
    }
    if (form.availableBeds > form.capacity) {
      setError('Available beds cannot be greater than capacity.');
      return;
    }

    const currentOccupants = form.capacity - form.availableBeds;

    const payload = {
      roomNumber: form.roomNumber.trim(),
      floor: form.floor,
      roomType: form.roomType,
      pricePerMonth: form.pricePerMonth,
      capacity: form.capacity,
      currentOccupants,
      status: form.status,
      description: form.description,
      images: form.imageDataUrl ? [form.imageDataUrl] : []
    };

    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/rooms/add', payload, {
        headers: authHeaders()
      });
      setMessage('Room added successfully. Students can now view it in Room Details.');
      setForm({
        roomNumber: '',
        floor: 1,
        roomType: 'triple',
        pricePerMonth: 45000,
        capacity: 3,
        availableBeds: 3,
        status: 'available',
        description: '',
        imageDataUrl: ''
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to add room.');
    }
    setSaving(false);
  };

  const updateStatus = async (roomId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${roomId}`,
        { status: newStatus },
        { headers: authHeaders() }
      );
      setMessage('Room status updated.');
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update room status.');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/booking/${bookingId}/status`,
        { status },
        { headers: authHeaders() }
      );
      setMessage(`Booking ${status}.`);
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-800">
              Admin <span className="text-orange-500">Navigation</span>
            </h2>
            <div className="text-sm font-semibold text-slate-600">
              {user.name || 'Admin'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <button type="button" onClick={() => navigate('/admin-dashboard')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button type="button" onClick={() => navigate('/admin-profile')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <User size={16} /> Profile
            </button>
            <button type="button" onClick={() => navigate('/admin-dashboard')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Calendar size={16} /> Attendance
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">
              <Home size={16} /> Room Details
            </button>
            <button type="button" onClick={() => navigate('/admin-complaints')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <MessageSquare size={16} /> Complaints
            </button>
            <button type="button" onClick={() => navigate('/admin-payments')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <CreditCard size={16} /> Payments
            </button>
            <button type="button" onClick={() => navigate('/admin-notices')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Bell size={16} /> Notices
            </button>
            <button type="button" onClick={() => navigate('/admin-food-order')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <UtensilsCrossed size={16} /> Food Order
            </button>
          </div>
          <div className="mt-3">
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Room <span className="text-orange-500">Management</span>
            </h1>
            <p className="mt-1 text-slate-500">
              Add rooms, upload images, manage availability and approve bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <form
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              onSubmit={handleAddRoom}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold text-slate-800">Add Room</h3>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  Admin
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Room Number</label>
                  <input
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={onChange}
                    placeholder="e.g. A-101"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Floor</label>
                    <input
                      type="number"
                      min="1"
                      name="floor"
                      value={form.floor}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Type</label>
                    <select
                      name="roomType"
                      value={form.roomType}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                      <option value="quad">Quad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700">Monthly Rate (Rs.)</label>
                  <input
                    type="number"
                    min="1000"
                    name="pricePerMonth"
                    value={form.pricePerMonth}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Total Beds</label>
                    <input
                      type="number"
                      min="1"
                      name="capacity"
                      value={form.capacity}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Available Beds</label>
                    <input
                      type="number"
                      min="0"
                      max={form.capacity}
                      name="availableBeds"
                      value={form.availableBeds}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700">Room Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-orange-700 hover:file:bg-orange-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Tip: Use a smaller image to avoid request limits.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Add details about room facilities"
                    className="mt-2 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                >
                  {saving ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
                <h2 className="text-lg font-extrabold text-slate-800">Pending Bookings</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {bookings.filter((b) => b.status === 'pending').length} pending
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Room</th>
                      <th className="px-5 py-3">Check-in</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings
                      .filter((b) => b.status === 'pending')
                      .map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {displayStudent(b.student)}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-700">Room {b.room.roomNumber}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {new Date(b.checkInDate).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-emerald-700">
                            Rs. {b.totalAmount}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleBookingStatus(b._id, 'confirmed')}
                                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 active:scale-[0.99]"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBookingStatus(b._id, 'rejected')}
                                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-rose-700 active:scale-[0.99]"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {bookings.filter((b) => b.status === 'pending').length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                          No pending bookings.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
                <h2 className="text-lg font-extrabold text-slate-800">All Rooms</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {rooms.length} rooms
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-5 py-3">Room</th>
                      <th className="px-5 py-3">Floor</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Beds</th>
                      <th className="px-5 py-3">Available</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => (
                      <tr key={room._id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 text-sm font-extrabold text-slate-800">{room.roomNumber}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{room.floor}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{room.roomType}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{room.capacity}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {Math.max(0, room.capacity - room.currentOccupants)}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-emerald-700">Rs. {room.pricePerMonth}</td>
                        <td className="px-5 py-4">
                          <span
                            className={[
                              'inline-flex rounded-full px-3 py-1 text-xs font-extrabold',
                              room.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700'
                                : room.status === 'maintenance'
                                  ? 'bg-amber-50 text-amber-700'
                                  : room.status === 'occupied'
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-rose-50 text-rose-700'
                            ].join(' ')}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => updateStatus(room._id, 'available')}
                              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 active:scale-[0.99]"
                            >
                              Set Available
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(room._id, 'maintenance')}
                              className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-extrabold text-white hover:bg-amber-600 active:scale-[0.99]"
                            >
                              Maintenance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rooms.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                          No rooms yet. Add your first room from the form.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomManagement;
