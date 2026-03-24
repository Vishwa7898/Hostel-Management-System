import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentRoomDetails() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({ roomId: null, status: '', message: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms', config);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchRooms();
    }
  }, [token]);

  // Book room
  const handleBookRoom = async (roomId) => {
    setBookingStatus({ roomId, status: 'loading', message: 'Booking...' });

    try {
      await axios.post('http://localhost:5000/api/allocations/assign', {
        roomId,
        studentId: user._id,
        checkInDate: new Date().toISOString().split('T')[0],
        duration: '6 months'
      }, config);

      setBookingStatus({ roomId, status: 'success', message: 'Room booked successfully!' });
      fetchRooms(); // Refresh list
      setTimeout(() => setBookingStatus({ roomId: null, status: '', message: '' }), 2500);
    } catch (err) {
      setBookingStatus({
        roomId,
        status: 'error',
        message: err.response?.data?.message || 'Failed to book room'
      });
      setTimeout(() => setBookingStatus({ roomId: null, status: '', message: '' }), 3000);
    }
  };

  // Room type images
  const getRoomImage = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('single')) return 'https://images.unsplash.com/photo-1618776181193-4e6a0e5c8e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (t.includes('double')) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (t.includes('triple')) return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1618776181193-4e6a0e5c8e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Matches your screenshot exactly */}
      <div className="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 pt-6 hidden lg:flex flex-col">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 text-3xl font-black text-emerald-600">
            <span>Stay</span><span className="text-slate-800">Sphere</span>
          </div>
        </div>
        <div className="flex-1 px-3 space-y-1">
          <a href="/student-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium">📊 Dashboard</a>
          <a href="/student-profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium">👤 Profile</a>
          <a href="/student-attendance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium">📅 Attendance</a>
          
          {/* Highlighted Room Details */}
          <a href="/student-room-details" className="flex items-center gap-3 px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-semibold shadow-sm">🏠 Room Details</a>
          
          <a href="/student-complaints" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium">📢 Complaints</a>
          <a href="/student-payments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium">💰 Payments</a>
        </div>
        <div className="p-4 border-t">
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Yellow Header - Exact like your image */}
        <div className="bg-yellow-400 py-4 px-8 flex justify-between items-center shadow-md">
          <div className="text-2xl font-black">StaySphere</div>
          <div className="font-medium">
            Welcome, {user.name || 'Student'} (Student ID: {user.studentId || '—'})
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Room Details</h1>
          <p className="text-slate-500 mb-8">Choose your preferred room type</p>

          {loading ? (
            <div className="text-center py-12 text-xl text-slate-500">Loading available rooms...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => {
                const isFull = (room.occupiedCount || 0) >= room.totalBeds;
                const status = bookingStatus.roomId === room._id ? bookingStatus.status : '';

                return (
                  <div key={room._id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-gray-100">
                    {/* Room Image */}
                    <div className="h-64 relative">
                      <img 
                        src={getRoomImage(room.type)} 
                        alt={`Room ${room.roomNumber}`}
                        className="w-full h-full object-cover"
                      />
                      {isFull && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-5 py-1.5 rounded-full">FULL</div>
                      )}
                    </div>

                    {/* Room Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-800">Room {room.roomNumber}</h3>
                      <p className="text-emerald-600 font-medium mt-1">{room.type} • Floor {room.floor}</p>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <div>
                          <span className="text-3xl font-black text-emerald-700">Rs. {room.price}</span>
                          <span className="text-xs block text-slate-400">per month</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-sm">Beds Occupied</span><br />
                          <span className="font-bold">{room.occupiedCount || 0} / {room.totalBeds}</span>
                        </div>
                      </div>

                      {/* Book Button */}
                      <button
                        onClick={() => handleBookRoom(room._id)}
                        disabled={isFull || status === 'loading' || status === 'success'}
                        className={`mt-8 w-full py-4 rounded-2xl font-bold text-white text-lg transition-all ${
                          isFull ? 'bg-gray-300 cursor-not-allowed' :
                          status === 'success' ? 'bg-emerald-500' :
                          status === 'loading' ? 'bg-orange-400' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {isFull ? 'NO BEDS AVAILABLE' :
                         status === 'loading' ? 'BOOKING...' :
                         status === 'success' ? 'BOOKED ✓' : 'BOOK THIS ROOM'}
                      </button>

                      {bookingStatus.roomId === room._id && bookingStatus.message && (
                        <div className={`mt-4 text-center text-sm font-medium ${bookingStatus.status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                          {bookingStatus.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}