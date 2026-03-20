import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Users, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchRecords();
  }, [dateFilter]);

  const fetchRecords = async () => {
    try {
      const url = dateFilter ? `http://localhost:5000/api/attendance?date=${dateFilter}` : 'http://localhost:5000/api/attendance';
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-orange-500 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Stay<span className="text-orange-200">Sphere</span> Admin</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user.name} ({user.role})</span>
          <button onClick={handleLogout} className="flex items-center space-x-1 bg-orange-600 px-3 py-1 rounded hover:bg-orange-700 transition">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center space-x-2">
              <Users size={24} className="text-orange-500" />
              <span>Attendance Management</span>
            </h2>
            <p className="text-slate-500">Monitor student movements and generate reports.</p>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Filter by Date</label>
              <input 
                type="date" 
                className="border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none focus:border-orange-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <button 
              onClick={handleDownloadReport}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 mt-5 rounded flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Download size={18} /> <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 border-b font-semibold">Student Name</th>
                <th className="p-4 border-b font-semibold">Email</th>
                <th className="p-4 border-b font-semibold">Date</th>
                <th className="p-4 border-b font-semibold">Check Out</th>
                <th className="p-4 border-b font-semibold">Check In</th>
                <th className="p-4 border-b font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record._id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                  <td className="p-4 text-slate-800 font-medium">{record.user?.name || 'N/A'}</td>
                  <td className="p-4 text-slate-600 text-sm">{record.user?.email || 'N/A'}</td>
                  <td className="p-4 text-slate-600">{record.date}</td>
                  <td className="p-4 text-slate-600">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-4 text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${record.status === 'Inside' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="6" className="p-12 text-center text-slate-500 text-lg">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
