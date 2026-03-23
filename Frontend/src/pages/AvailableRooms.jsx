import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/rooms', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        // Console එකේ බලන්න දත්ත එන හැටි. image field එකේ අගය එකිනෙකට වෙනස් විය යුතුයි.
        console.log("Rooms Data:", res.data); 
        setRooms(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AVAILABLE ROOMS</span>
            </h2>
            <div className="h-1.5 w-32 bg-yellow-400 mt-3 rounded-full mx-auto md:mx-0"></div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-xl px-8 py-4 rounded-3xl text-center min-w-[150px]">
            <span className="text-3xl font-black text-indigo-600 block leading-none">{rooms.length}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Live Units</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-900 font-bold">Loading Live Data...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {rooms.map((room) => (
              <div key={room._id} className="group bg-white/80 backdrop-blur-sm rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white flex flex-col">
                
                {/* 1. Dynamic Image Handling */}
                <div className="h-56 overflow-hidden relative bg-gray-200">
                  <img 
                    // Database එකේ ඇති image නම අනුව public/images/rooms/ වෙතින් පින්තූරය ගනී
                    src={`/images/rooms/${room.image || 'room1.webp'}`} 
                    alt={`Room ${room.roomNumber}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => { 
                      // පින්තූරය නැතිනම් පමණක් placeholder එකක් පෙන්වයි
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; 
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md shadow-lg text-indigo-600 font-bold px-4 py-1 rounded-xl text-xs uppercase">
                    {room.type || 'Double'}
                  </div>
                </div>

                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Room {room.roomNumber}</h3>
                  
                  {/* Monthly Rate */}
                  <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100/50 transition-colors group-hover:bg-indigo-50">
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1 text-center font-sans">Monthly Rate</p>
                    <p className="text-3xl font-black text-indigo-700 text-center">
                      Rs.{(room.price || room.rent || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* 2. Floor Section with Icon */}
                  <div className="mt-6 flex items-center justify-center gap-2 bg-slate-50 py-2 rounded-2xl border border-slate-100">
                    <span className="text-indigo-500 text-lg">📍</span> 
                    <p className="text-slate-600 font-bold uppercase tracking-tighter text-sm">
                      {room.floor || '1'} <span className="text-indigo-400 font-extrabold ml-1">FLOOR</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}