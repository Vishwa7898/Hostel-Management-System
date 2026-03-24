import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({ roomId: null, status: '', message: '' });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Premium generated images based on room type
  const getRoomImage = (type) => {
    const defaultImage = "/images/rooms/single_room.png"; // Default to single
    if (!type) return defaultImage;
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('single')) {
      return "/images/rooms/single_room.png";
    } else if (lowerType.includes('double')) {
      return "/images/rooms/double_room.png";
    } else if (lowerType.includes('triple') || lowerType.includes('family')) {
      return "/images/rooms/triple_room.png";
    }
    return defaultImage;
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRooms(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate('/');
    fetchRooms();
  }, []);

  const handleBookRoom = async (roomId) => {
    if (!user._id) {
      setBookingStatus({ roomId, status: 'error', message: 'User ID missing. Please re-login.' });
      return;
    }

    setBookingStatus({ roomId, status: 'loading', message: 'Booking...' });

    try {
      const res = await axios.post('http://localhost:5000/api/allocations/assign', {
        roomId,
        studentId: user._id, 
        checkInDate: new Date().toISOString(),
        duration: "1 Semester" // Default duration or prompt user
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setBookingStatus({ roomId, status: 'success', message: 'Booked Successfully!' });
      fetchRooms(); // Refresh the list to show updated capacity
      
      setTimeout(() => {
        setBookingStatus({ roomId: null, status: '', message: '' });
      }, 3000);
      
    } catch (err) {
      setBookingStatus({ 
        roomId, 
        status: 'error', 
        message: err.response?.data?.message || 'Error booking room' 
      });
      
      setTimeout(() => {
        setBookingStatus({ roomId: null, status: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative overflow-x-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              AVAILABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">ROOMS</span>
            </h2>
            <div className="h-1.5 w-24 bg-teal-400 mt-3 rounded-full mx-auto md:mx-0"></div>
            <p className="mt-4 text-slate-500 font-medium">Find and book your perfect hostel room with ease.</p>
          </div>
          
          <div className="bg-white border border-slate-200 shadow-md px-8 py-4 rounded-3xl text-center min-w-[150px]">
            <span className="text-3xl font-black text-teal-600 block leading-none">{rooms.length}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Units</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold loading-pulse">Loading Live Data...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {rooms.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500 font-medium text-lg border border-slate-200 border-dashed rounded-xl bg-white/50">
                No rooms available at the moment! Check back later.
              </div>
            )}
            
            {rooms.map((room) => {
              const isFull = (room.occupiedCount || 0) >= room.totalBeds;
              const isPendingBooking = bookingStatus.roomId === room._id && bookingStatus.status === 'loading';
              const isSuccess = bookingStatus.roomId === room._id && bookingStatus.status === 'success';
              const isError = bookingStatus.roomId === room._id && bookingStatus.status === 'error';

              return (
                <div key={room._id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col relative w-full transform hover:-translate-y-1">
                  
                  {/* Photo Section */}
                  <div className="h-64 overflow-hidden relative bg-slate-200">
                    <img 
                      src={getRoomImage(room.type)} 
                      alt={`Room ${room.roomNumber}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 shadow-md text-slate-800 font-black px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider">
                      {room.type || 'Standard'}
                    </div>
                    {isFull && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg tracking-widest uppercase border border-red-400 shadow-xl rotate-[-15deg] text-xl">
                          FULL
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-grow flex flex-col items-center">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Room {room.roomNumber}</h3>
                    
                    {/* Capacity Info */}
                    <div className="bg-slate-50 w-full py-3 px-4 rounded-xl border border-slate-100 mb-4 flex justify-between items-center group-hover:border-teal-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👤</span>
                        <span className="text-sm font-bold text-slate-600">Occupants</span>
                      </div>
                      <div className="font-black text-lg text-slate-700">
                        {room.occupiedCount || 0} <span className="text-slate-400 text-sm font-semibold mx-1">/</span> {room.totalBeds}
                      </div>
                    </div>

                    {/* Floor & Price */}
                    <div className="flex w-full gap-4 mb-6">
                      <div className="flex-1 bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Floor</span>
                        <span className="text-xl font-bold text-amber-700">{room.floor || 1}</span>
                      </div>
                      <div className="flex-1 bg-teal-50/50 rounded-xl p-3 border border-teal-100/50 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">Monthly</span>
                        <span className="text-lg font-black text-teal-800 tracking-tight">Rs.{(room.price || room.rent || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Error / Success Messages */}
                    {isError && (
                      <div className="w-full bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg mb-3 text-center border border-red-100">
                        {bookingStatus.message}
                      </div>
                    )}
                    {isSuccess && (
                      <div className="w-full bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-2 rounded-lg mb-3 text-center border border-emerald-100">
                        {bookingStatus.message}
                      </div>
                    )}

                    {/* Book Button */}
                    <button 
                      onClick={() => handleBookRoom(room._id)}
                      disabled={isFull || isPendingBooking || isSuccess}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm
                        ${isFull ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                         isSuccess ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' :
                         isPendingBooking ? 'bg-orange-300 text-white cursor-wait' : 
                         'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-200 hover:shadow-lg active:scale-95'}`}
                    >
                      {isFull ? 'NO BEDS AVAILABLE' : 
                       isPendingBooking ? 'PROCESSING...' : 
                       isSuccess ? 'BOOKED!' : 
                       'BOOK THIS ROOM'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}