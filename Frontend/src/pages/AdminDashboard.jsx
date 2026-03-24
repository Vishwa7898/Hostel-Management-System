import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Users, Calendar, FileText, LayoutDashboard, User, Home, MessageSquare, CreditCard, UtensilsCrossed, Bell } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(236, 136, 36);
    const title = dateFilter 
      ? `Attendance Report - ${dateFilter}` 
      : 'Complete Attendance Report';
    doc.text(title, 14, 22);
    
    const tableColumn = ["Student ID", "Student Name", "Date", "Check Out", "Check In", "Status"];
    const tableRows = [];
    
    records.forEach(record => {
      const recordData = [
        record.user?.studentId || 'N/A',
        record.user?.name || 'N/A',
        record.date,
        record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-',
        record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-',
        record.status
      ];
      tableRows.push(recordData);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [236, 136, 36], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    
    doc.save(`attendance_report${dateFilter ? '_' + dateFilter : ''}.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-10 px-2 text-slate-800">
          <div className="w-8 h-8 bg-orange-500 rounded flex justify-center items-center text-white">
            <Home size={18} />
          </div>
          <span><span className="text-gray-500">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/admin-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div onClick={() => navigate('/admin-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div onClick={() => navigate('/admin-notifications')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Bell size={20} />
            <span>Notifications</span>
          </div>
          <div onClick={() => navigate('/admin-food-order')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <UtensilsCrossed size={20} />
            <span>Food Order</span>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Admin <span className="text-orange-500">Dashboard</span></h1>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-800 leading-none">{user.name}</span>
              <span className="text-xs text-slate-500">{user.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">
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
            <div className="flex space-x-2 mt-5">
              <button 
                onClick={handleDownloadReport}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded flex items-center space-x-1 transition-colors shadow-sm text-sm"
              >
                <Download size={16} /> <span>CSV</span>
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center space-x-1 transition-colors shadow-sm text-sm"
              >
                <FileText size={16} /> <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 border-b font-semibold">Student ID</th>
                <th className="p-4 border-b font-semibold">Student Name</th>
                <th className="p-4 border-b font-semibold">Date</th>
                <th className="p-4 border-b font-semibold">Check Out</th>
                <th className="p-4 border-b font-semibold">Check In</th>
                <th className="p-4 border-b font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record._id} className="hover:bg-slate-50 border-b last:border-0 transition-colors">
                  <td className="p-4 text-slate-600 text-sm font-semibold">{record.user?.studentId || 'N/A'}</td>
                  <td className="p-4 text-slate-800 font-medium">{record.user?.name || 'N/A'}</td>
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
    </div>
  );
}
