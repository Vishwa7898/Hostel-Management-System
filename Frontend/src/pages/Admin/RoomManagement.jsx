import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatRs = (n) =>
  typeof n === 'number' ? `Rs. ${n.toLocaleString()}` : `Rs. ${n}`;

const MAX_FLOOR = 4;
const MAX_BEDS = 3;
const ALLOWED_ROOM_TYPES = ['single', 'double', 'triple'];
const ALLOWED_ROOM_STATUS = ['available', 'occupied', 'maintenance', 'unavailable'];
const hasImageData = (v) => typeof v === 'string' && v.trim().length > 0;

const validateAddRoomForm = (form) => {
  const e = {};
  const roomNo = form.roomNumber != null ? String(form.roomNumber).trim() : '';
  if (!roomNo) e.roomNumber = 'Room number is required.';
  else if (roomNo.length > 40) e.roomNumber = 'Room number is too long (max 40 characters).';

  const floorEmpty = form.floor === '' || form.floor === null || form.floor === undefined;
  if (floorEmpty) {
    e.floor = `Floor is required (1–${MAX_FLOOR}).`;
  } else {
    const f = Number(form.floor);
    if (!Number.isFinite(f) || !Number.isInteger(f) || f < 1 || f > MAX_FLOOR) {
      e.floor = `Floor must be a whole number from 1 to ${MAX_FLOOR}.`;
    }
  }

  if (!ALLOWED_ROOM_TYPES.includes(form.roomType)) {
    e.roomType = 'Choose single, double, or triple.';
  }

  const priceEmpty = form.pricePerMonth === '' || form.pricePerMonth === null || form.pricePerMonth === undefined;
  if (priceEmpty) {
    e.pricePerMonth = 'Monthly rate is required.';
  } else {
    const p = Number(form.pricePerMonth);
    if (!Number.isFinite(p) || p < 10000) {
      e.pricePerMonth = 'Monthly rate must be at least Rs. 10000.';
    }
  }

  const capEmpty = form.capacity === '' || form.capacity === null || form.capacity === undefined;
  if (capEmpty) {
    e.capacity = `Total beds is required (1–${MAX_BEDS}).`;
  } else {
    const cap = Number(form.capacity);
    if (!Number.isFinite(cap) || !Number.isInteger(cap) || cap < 1 || cap > MAX_BEDS) {
      e.capacity = `Total beds must be a whole number from 1 to ${MAX_BEDS}.`;
    }
  }

  const availEmpty = form.availableBeds === '' || form.availableBeds === null || form.availableBeds === undefined;
  if (availEmpty) {
    e.availableBeds = 'Available beds is required.';
  } else {
    const avail = Number(form.availableBeds);
    const cap = Number(form.capacity);
    if (!Number.isFinite(avail) || !Number.isInteger(avail) || avail < 0) {
      e.availableBeds = `Available beds must be a whole number from 0 to ${MAX_BEDS}.`;
    } else if (avail > MAX_BEDS) {
      e.availableBeds = `Available beds cannot exceed ${MAX_BEDS}.`;
    } else if (Number.isFinite(cap) && avail > cap) {
      e.availableBeds = 'Available beds cannot be greater than total beds.';
    }
  }

  if (form.description != null && String(form.description).length > 2000) {
    e.description = 'Description is too long (max 2000 characters).';
  }
  if (!ALLOWED_ROOM_STATUS.includes(form.status)) {
    e.status = 'Select a valid status.';
  }
  if (!hasImageData(form.imageDataUrl)) {
    e.imageDataUrl = 'Room image is required.';
  }
  return e;
};

const statusStyles = {
  available: 'bg-emerald-500 text-white ring-emerald-400/40',
  maintenance: 'bg-amber-500 text-white ring-amber-400/40',
  unavailable: 'bg-rose-500 text-white ring-rose-400/40',
  occupied: 'bg-slate-700 text-white ring-slate-600/50'
};

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [bookingActionId, setBookingActionId] = useState(null);
  const [removingRoomId, setRemovingRoomId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    roomType: 'all',
    floor: 'all'
  });
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

  const pendingList = useMemo(
    () => bookings.filter((b) => b.status === 'pending'),
    [bookings]
  );
  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        if (filters.status !== 'all' && room.status !== filters.status) return false;
        if (filters.roomType !== 'all' && room.roomType !== filters.roomType) return false;
        if (filters.floor !== 'all' && Number(room.floor) !== Number(filters.floor)) return false;
        return true;
      }),
    [rooms, filters]
  );

  const stats = useMemo(() => {
    const availableRooms = rooms.filter((r) => r.status === 'available').length;
    const maintenance = rooms.filter((r) => r.status === 'maintenance').length;
    const totalBedsFree = rooms.reduce(
      (acc, r) => acc + Math.max(0, r.capacity - r.currentOccupants),
      0
    );
    return {
      totalRooms: rooms.length,
      pending: pendingList.length,
      availableRooms,
      maintenance,
      totalBedsFree
    };
  }, [rooms, pendingList.length]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => {
      if (!name || !(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setMessage('');
    setError('');

    if (!['floor', 'pricePerMonth', 'capacity', 'availableBeds'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (value === '') {
      setForm((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    let num = Number(value);
    if (!Number.isFinite(num)) return;

    setForm((prev) => {
      if (name === 'floor') {
        num = Math.min(MAX_FLOOR, Math.max(1, Math.round(num)));
        return { ...prev, floor: num };
      }
      if (name === 'pricePerMonth') {
        return { ...prev, pricePerMonth: num };
      }
      if (name === 'capacity') {
        const cap = Math.min(MAX_BEDS, Math.max(1, Math.round(num)));
        const availRaw = prev.availableBeds;
        const availNum = Number.isFinite(availRaw) ? availRaw : cap;
        const avail = Math.min(Math.min(MAX_BEDS, cap), Math.max(0, Math.round(availNum)));
        return { ...prev, capacity: cap, availableBeds: avail };
      }
      if (name === 'availableBeds') {
        const cap = Number.isFinite(prev.capacity) ? prev.capacity : MAX_BEDS;
        const maxAvail = Math.min(MAX_BEDS, cap);
        const avail = Math.min(maxAvail, Math.max(0, Math.round(num)));
        return { ...prev, availableBeds: avail };
      }
      return prev;
    });
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
      setFieldErrors((prev) => {
        if (!('imageDataUrl' in prev)) return prev;
        const next = { ...prev };
        delete next.imageDataUrl;
        return next;
      });
    } catch (err) {
      setError('Failed to read image file.');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setFieldErrors({});
    scrollToTop();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please log in again.');
      return;
    }

    const validationErrors = validateAddRoomForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('Please correct the highlighted fields.');
      scrollToTop();
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
      setFieldErrors({});
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
      const msg = err.response?.data?.message || err.message || 'Failed to add room.';
      setError(msg);
    }
    setSaving(false);
  };

  const bookingIdStr = (b) => (b?._id != null ? String(b._id) : b?.id != null ? String(b.id) : '');

  const updateStatus = async (roomId, newStatus) => {
    const id = roomId != null ? String(roomId) : '';
    if (!id) return;
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/rooms/${id}`, { status: newStatus }, { headers: authHeaders() });
      setMessage('Room status updated.');
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update room status.');
    }
  };

  const handleBookingStatus = async (booking, status) => {
    const id = bookingIdStr(booking);
    if (!id) {
      setError('Invalid booking. Please refresh the page.');
      return;
    }
    setError('');
    setMessage('');
    setBookingActionId(id);
    scrollToTop();
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/booking/${id}/status`,
        { status },
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
      );
      setMessage(status === 'confirmed' ? 'Booking confirmed.' : 'Booking rejected.');
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update booking status.');
      scrollToTop();
    } finally {
      setBookingActionId(null);
    }
  };

  const handleRemoveRoom = async (room) => {
    const id = room?._id != null ? String(room._id) : room?.id != null ? String(room.id) : '';
    if (!id) return;
    const label = room?.roomNumber != null ? String(room.roomNumber) : 'this room';
    if (!window.confirm(`Remove ${label} from the directory? Related booking records will be deleted.`)) {
      return;
    }
    setError('');
    setMessage('');
    setRemovingRoomId(id);
    scrollToTop();
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, { headers: authHeaders() });
      setMessage('Room removed.');
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to remove room.');
      scrollToTop();
    } finally {
      setRemovingRoomId(null);
    }
  };

  const inputBaseClass =
    'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2';
  const fieldClass = (name) =>
    [
      inputBaseClass,
      fieldErrors[name]
        ? 'border-rose-400 ring-1 ring-rose-200/80 focus:border-rose-500 focus:ring-rose-200/80'
        : 'border-slate-200/90 focus:border-teal-500 focus:ring-teal-200/80'
    ].join(' ');

  const fieldHint = (name) =>
    fieldErrors[name] ? (
      <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
        {fieldErrors[name]}
      </p>
    ) : null;

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
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
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-900 active:scale-[0.98]"
          >
            <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh data
          </button>
        </div>

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-emerald-900 shadow-sm backdrop-blur-sm">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-200/60 text-emerald-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <p className="pt-0.5 font-medium">{message}</p>
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-rose-900 shadow-sm backdrop-blur-sm">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-200/60 text-rose-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            <p className="pt-0.5 font-medium">{error}</p>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {[
            { label: 'Total rooms', value: stats.totalRooms, sub: 'in directory', accent: 'from-slate-700 to-slate-600' },
            { label: 'Pending requests', value: stats.pending, sub: 'need action', accent: 'from-amber-500 to-orange-500' },
            { label: 'Listed available', value: stats.availableRooms, sub: 'rooms open', accent: 'from-teal-600 to-teal-500' },
            { label: 'Free beds', value: stats.totalBedsFree, sub: 'capacity left', accent: 'from-emerald-600 to-teal-600' },
            { label: 'Maintenance', value: stats.maintenance, sub: 'rooms', accent: 'from-amber-600 to-amber-500' }
          ].map((card) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 p-4 shadow-md shadow-slate-900/10 backdrop-blur-sm transition hover:shadow-lg hover:shadow-slate-900/15"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 opacity-95"
                aria-hidden
              />
              <div
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-400 opacity-[0.28] blur-2xl transition group-hover:opacity-40"
                aria-hidden
              />
              <p className="relative text-xs font-semibold uppercase tracking-wide text-emerald-900/70">
                {card.label}
              </p>
              <p className="relative mt-1 text-2xl font-extrabold tabular-nums text-emerald-900">
                {card.value}
              </p>
              <p className="relative mt-0.5 text-xs text-emerald-900/60">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <form
              className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-md"
              onSubmit={handleAddRoom}
              noValidate
            >
              <div className="h-1.5 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500" />
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Add new room</h3>
                    <p className="mt-1 text-sm text-slate-500">Publish a room for student booking.</p>
                  </div>
                  <span className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 ring-1 ring-teal-100">
                    New
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="add-room-number" className="block text-sm font-bold text-slate-700">
                      Room number
                    </label>
                    <input
                      id="add-room-number"
                      name="roomNumber"
                      value={form.roomNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. A-101"
                      autoComplete="off"
                      className={fieldClass('roomNumber')}
                    />
                    {fieldHint('roomNumber')}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="add-floor" className="block text-sm font-bold text-slate-700">
                        Floor (1–{MAX_FLOOR})
                      </label>
                      <input
                        id="add-floor"
                        type="number"
                        min="1"
                        max={MAX_FLOOR}
                        name="floor"
                        value={form.floor}
                        onChange={handleFormChange}
                        className={fieldClass('floor')}
                      />
                      {fieldHint('floor')}
                    </div>
                    <div>
                      <label htmlFor="add-room-type" className="block text-sm font-bold text-slate-700">
                        Type
                      </label>
                      <select
                        id="add-room-type"
                        name="roomType"
                        value={form.roomType}
                        onChange={handleFormChange}
                        className={fieldClass('roomType')}
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                      </select>
                      {fieldHint('roomType')}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="add-price" className="block text-sm font-bold text-slate-700">
                      Monthly rate (Rs.)
                    </label>
                    <input
                      id="add-price"
                      type="number"
                      min="10000"
                      step="1"
                      name="pricePerMonth"
                      value={form.pricePerMonth}
                      onChange={handleFormChange}
                      className={fieldClass('pricePerMonth')}
                    />
                    {fieldHint('pricePerMonth')}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="add-capacity" className="block text-sm font-bold text-slate-700">
                        Total beds (1–{MAX_BEDS})
                      </label>
                      <input
                        id="add-capacity"
                        type="number"
                        min="1"
                        max={MAX_BEDS}
                        name="capacity"
                        value={form.capacity}
                        onChange={handleFormChange}
                        className={fieldClass('capacity')}
                      />
                      {fieldHint('capacity')}
                    </div>
                    <div>
                      <label htmlFor="add-available" className="block text-sm font-bold text-slate-700">
                        Available beds (0–{MAX_BEDS})
                      </label>
                      <input
                        id="add-available"
                        type="number"
                        min="0"
                        max={Math.min(MAX_BEDS, Number.isFinite(form.capacity) ? form.capacity : MAX_BEDS)}
                        name="availableBeds"
                        value={form.availableBeds}
                        onChange={handleFormChange}
                        className={fieldClass('availableBeds')}
                      />
                      {fieldHint('availableBeds')}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="add-status" className="block text-sm font-bold text-slate-700">
                      Status
                    </label>
                    <select
                      id="add-status"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      className={fieldClass('status')}
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="occupied">Occupied</option>
                    </select>
                    {fieldHint('status')}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700">Room image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-4 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:border-teal-300 hover:bg-teal-50/30 file:hover:bg-teal-700"
                    />
                    {fieldHint('imageDataUrl')}
                    <p className="mt-2 text-xs text-slate-500">Use a reasonably small image to stay within upload limits.</p>
                  </div>

                  <div>
                    <label htmlFor="add-description" className="block text-sm font-bold text-slate-700">
                      Description
                    </label>
                    <textarea
                      id="add-description"
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Facilities, view, notes for students…"
                      className={`${fieldClass('description')} min-h-28 resize-y`}
                    />
                    {fieldHint('description')}
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-900/25 transition hover:from-teal-500 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                  >
                    {saving ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Adding…
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add room
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-8 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-teal-50/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Pending bookings</h2>
                    <p className="text-sm text-slate-500">Confirm or reject student requests.</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-900 ring-1 ring-amber-200/80">
                  {stats.pending} waiting
                </span>
              </div>

              <div className="p-4 sm:p-6">
                {pendingList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/60 text-slate-500">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-slate-700">No pending bookings</p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">When students submit requests, they will appear here for review.</p>
                  </div>
                ) : (
                  <ul className="grid gap-4">
                    {pendingList.map((b, idx) => {
                      const bId = bookingIdStr(b);
                      const busy = bookingActionId === bId;
                      const initial = displayStudent(b.student).charAt(0).toUpperCase();
                      return (
                        <li
                          key={bId || `pending-${idx}`}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm transition hover:border-teal-200/80 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
                        >
                          <div className="flex min-w-0 flex-1 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-lg font-extrabold text-white shadow-md shadow-teal-900/20">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-900">{displayStudent(b.student)}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                  </svg>
                                  Room {b.room?.roomNumber ?? '—'}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span>
                                  Check-in{' '}
                                  <time className="font-semibold text-slate-800">
                                    {new Date(b.checkInDate).toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </time>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
                            <p className="text-right text-lg font-extrabold text-emerald-700">{formatRs(b.totalAmount)}</p>
                            <div className="flex flex-wrap justify-end gap-2">
                              <button
                                type="button"
                                disabled={busy || !bId}
                                onClick={() => handleBookingStatus(b, 'confirmed')}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {busy ? '…' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                disabled={busy || !bId}
                                onClick={() => handleBookingStatus(b, 'rejected')}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {busy ? '…' : 'Reject'}
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-teal-50/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">All rooms</h2>
                    <p className="text-sm text-slate-500">Inventory and quick status updates.</p>
                  </div>
                </div>
                <span className="inline-flex w-fit rounded-full bg-teal-100 px-4 py-1.5 text-sm font-bold text-teal-900 ring-1 ring-teal-200/80">
                  {filteredRooms.length} shown
                </span>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-3">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="all">All status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters((prev) => ({ ...prev, roomType: e.target.value }))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="all">All type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                  <select
                    value={filters.floor}
                    onChange={(e) => setFilters((prev) => ({ ...prev, floor: e.target.value }))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="all">All floors</option>
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                  </select>
                </div>

                {filteredRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-slate-700">No rooms yet</p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">Use the form on the left to add your first room.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredRooms.map((room) => {
                      const roomId = room?._id != null ? String(room._id) : String(room?.id ?? '');
                      const free = Math.max(0, room.capacity - room.currentOccupants);
                      const occupancyPct =
                        room.capacity > 0 ? Math.round((room.currentOccupants / room.capacity) * 100) : 0;
                      const badge = statusStyles[room.status] || statusStyles.unavailable;
                      const removing = removingRoomId === roomId;
                      return (
                        <article
                          key={roomId}
                          className="group flex flex-col rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/90 p-5 shadow-sm transition hover:border-teal-200/70 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Room</p>
                              <p className="text-2xl font-extrabold tracking-tight text-slate-900">{room.roomNumber}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                Floor {room.floor} · {String(room.roomType || '').charAt(0).toUpperCase()}
                                {String(room.roomType || '').slice(1)}
                              </p>
                            </div>
                            <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-extrabold capitalize ring-1 ${badge}`}>
                              {room.status}
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                              <span>Occupancy</span>
                              <span>
                                {room.currentOccupants}/{room.capacity} beds
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
                                style={{ width: `${Math.min(100, occupancyPct)}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{free} bed{free !== 1 ? 's' : ''} free</p>
                          </div>

                          <p className="mt-4 text-lg font-extrabold text-emerald-700">{formatRs(room.pricePerMonth)}</p>
                          <p className="text-xs text-slate-500">per month</p>

                          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() => updateStatus(roomId, 'available')}
                              disabled={removing}
                              className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 sm:flex-none"
                            >
                              Available
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(roomId, 'maintenance')}
                              disabled={removing}
                              className="flex-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center text-xs font-extrabold text-amber-900 transition hover:bg-amber-100 active:scale-[0.98] disabled:opacity-50 sm:flex-none"
                            >
                              Maintenance
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(room)}
                              disabled={removing}
                              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-center text-xs font-extrabold text-rose-700 transition hover:bg-rose-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                              {removing ? 'Removing…' : 'Remove'}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomManagement;
