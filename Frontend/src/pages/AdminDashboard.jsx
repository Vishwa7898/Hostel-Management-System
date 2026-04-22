import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminShell from '../components/layout/AdminShell';

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    fetchRecords();
    fetchNotifications();
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

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
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

  const title = dateFilter 
    ? `Attendance Report - ${dateFilter}` 
    : 'Complete Attendance Report';

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  const tableColumn = [
    "Student ID",
    "Student Name",
    "Date",
    "Check Out",
    "Check In",
    "Status"
  ];

  const tableRows = records.map(record => [
    record.user?.studentId || 'N/A',
    record.user?.name || 'N/A',
    record.date,
    record.checkOutTime 
      ? new Date(record.checkOutTime).toLocaleTimeString() 
      : '-',
    record.checkInTime 
      ? new Date(record.checkInTime).toLocaleTimeString() 
      : '-',
    record.status
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] }, // blue
    alternateRowStyles: { fillColor: [240, 249, 255] }
  });

  doc.save(`attendance_report${dateFilter ? '_' + dateFilter : ''}.pdf`);
};

  const insideCount = records.filter(r => r.status === 'Inside').length;
  const outsideCount = records.filter(r => r.status === 'Outside').length;

  const chartData = [
  { name: 'Inside', value: insideCount },
  { name: 'Outside', value: outsideCount }
];

const COLORS = ['#14b8a6', '#f97316']; // teal & orange

  return (
    <AdminShell
      activeKey="attendance"
      title="Admin Dashboard"
      subtitle="Monitor student movements and generate reports."
    >
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

<div className="p-6 border-b border-slate-100 bg-slate-50">
  <h3 className="text-lg font-bold text-slate-800 mb-3">Overdue Notifications</h3>
  {notifications.length === 0 ? (
    <p className="text-sm text-slate-500">No overdue notifications yet.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {notifications.map((note) => (
        <div key={note._id} className={`rounded-lg p-3 border ${note.isRead ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-sm font-semibold text-slate-800">{note.title}</p>
          <p className="text-xs text-slate-600 mt-1">{note.message}</p>
          <p className="text-[11px] text-slate-400 mt-2">
            {note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

  {/* INSIDE CARD */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-teal-500 hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase">Inside Students</p>
        <h2 className="text-4xl font-extrabold text-teal-600 mt-2">
          {insideCount}
        </h2>
      </div>

      <div className="bg-teal-100 p-4 rounded-full">
        🟢
      </div>
    </div>

    <div className="mt-4 text-sm text-gray-400">
      Currently inside hostel
    </div>
  </div>


  {/* OUTSIDE CARD */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-500 hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase">Outside Students</p>
        <h2 className="text-4xl font-extrabold text-orange-500 mt-2">
          {outsideCount}
        </h2>
      </div>

      <div className="bg-orange-100 p-4 rounded-full">
        🟠
      </div>
    </div>

    <div className="mt-4 text-sm text-gray-400">
      Currently outside hostel
    </div>
  </div>

</div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm uppercase tracking-wider">
                <th className="p-6 border-b font-bold text-sm">Student ID</th>
                <th className="p-6 border-b font-bold text-sm">Student Name</th>
                <th className="p-6 border-b font-bold text-sm">Date</th>
                <th className="p-6 border-b font-bold text-sm">Check Out</th>
                <th className="p-6 border-b font-bold text-sm">Check In</th>
                <th className="p-6 border-b font-bold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-50'} hover:bg-orange-100 border-b last:border-0 transition-all duration-200`}>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.user?.studentId || 'N/A'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.user?.name || 'N/A'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.date}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm ${record.status === 'Inside' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
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
          <div className="mt-10 p-6 rounded-2xl shadow-md border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-teal-50">
           <h3 className="text-3xl font-extrabold text-blue-600 mb-6 text-center tracking-wide">
  📊 Attendance Distribution</h3>

          <ResponsiveContainer width="100%" height={320}>
  <PieChart>
    
    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      innerRadius={60}   // 🔥 donut style
      outerRadius={110}
      paddingAngle={5}   // space between slices
      dataKey="value"
      label={({ name, percent }) =>
        `${name} ${(percent * 100).toFixed(0)}%`
      }
    >
      {chartData.map((entry, index) => (
        <Cell 
          key={index} 
          fill={index === 0 ? "#14b8a6" : "#f97316"} 
        />
      ))}
    </Pie>

    <Tooltip 
      contentStyle={{ borderRadius: '10px', border: 'none' }}
    />

    <Legend 
      verticalAlign="bottom"
      iconType="circle"
    />

  </PieChart>
</ResponsiveContainer>
</div>
        </div>
    </AdminShell>
  );
}
