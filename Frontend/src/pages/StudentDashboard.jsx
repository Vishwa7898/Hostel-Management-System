import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('Inside');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
      if (data.length > 0) {
         setStatus(data[0].status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAttendance();
      else alert((await res.json()).message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-teal-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Stay<span className="text-teal-200">Sphere</span></h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="flex items-center space-x-1 bg-teal-700 px-3 py-1 rounded hover:bg-teal-800 transition">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-1">Current Status</h2>
            <div className="flex items-center space-x-2 text-slate-600">
               <MapPin size={18} className={status === 'Inside' ? 'text-teal-500' : 'text-orange-500'} />
               <span className="font-medium text-lg">{status === 'Inside' ? 'Inside Hostel' : 'Outside Hostel'}</span>
            </div>
          </div>
          <div>
            {status === 'Inside' ? (
              <button onClick={() => handleAction('checkout')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium shadow transition-colors">
                Check Out
              </button>
            ) : (
              <button onClick={() => handleAction('checkin')} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow transition-colors">
                Check In
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <div className="p-4 bg-slate-100 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700 flex items-center space-x-2">
              <Clock size={18} /> <span>Attendance History</span>
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Check Out</th>
                <th className="p-4 border-b">Check In</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record._id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                  <td className="p-4 text-slate-800">{record.date}</td>
                  <td className="p-4 text-slate-600">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-4 text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.status === 'Inside' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
