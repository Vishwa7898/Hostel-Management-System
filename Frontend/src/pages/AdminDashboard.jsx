import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminShell from '../components/layout/AdminShell';
import staysphereLogo from '../assets/staysphere logo.png';

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

  const getImageDataUrl = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleDownloadPDF = async () => {
  const doc = new jsPDF();

  try {
    const logoDataUrl = await getImageDataUrl(staysphereLogo);
    doc.addImage(logoDataUrl, 'PNG', 14, 8, 20, 20);
  } catch (err) {
    console.error('Failed to load StaySphere logo for PDF:', err);
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const nameY = 18;
  const centerX = pageWidth / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  const stayText = 'Stay';
  const sphereText = 'Sphere';
  const stayWidth = doc.getTextWidth(stayText);
  const sphereWidth = doc.getTextWidth(sphereText);
  const totalNameWidth = stayWidth + sphereWidth;
  const nameStartX = centerX - totalNameWidth / 2;

  doc.setTextColor(107, 114, 128); // gray
  doc.text(stayText, nameStartX, nameY);
  doc.setTextColor(34, 197, 94); // green
  doc.text(sphereText, nameStartX + stayWidth, nameY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(70, 70, 70);
  doc.text('Student Attendance Report', centerX, 28, { align: 'center' });

  if (dateFilter) {
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Date: ${dateFilter}`, centerX, 34, { align: 'center' });
  }

  const tableColumn = [
    "Student ID",
    "Student Name",
    "Date",
    "Check Out",
    "Expected Return Date",
    "Expected Return Time",
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
    record.expectedReturn ? new Date(record.expectedReturn).toLocaleDateString() : '-',
    record.expectedReturn ? new Date(record.expectedReturn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    record.checkInTime 
      ? new Date(record.checkInTime).toLocaleTimeString() 
      : '-',
    record.status
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: dateFilter ? 40 : 36,
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
      <div className="flex-1 min-w-0 px-0 py-0">
        <header className="rounded-[32px] bg-gradient-to-br from-slate-900 via-cyan-900 to-teal-800 text-white shadow-[0_28px_80px_rgba(15,23,42,0.3)] border border-cyan-700/40 p-8 mb-10 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/25 blur-3xl"></div>
          <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-teal-300/20 blur-3xl"></div>
          <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200 font-semibold"> Student Attendance</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">Attendance Management</h1>
              <p className="mt-4 max-w-2xl text-cyan-100/90">Monitor student movements, export reports, and keep records up to date.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/10 border border-white/20 p-5 text-center shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100 font-semibold">Inside Student</p>
                <p className="mt-3 text-3xl font-bold">{insideCount}</p>
              </div>
              <div className="rounded-[24px] bg-orange-500/20 border border-orange-300/60 p-5 text-center shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-orange-100 font-semibold">Outside Student</p>
                <p className="mt-3 text-3xl font-bold">{outsideCount}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 shadow-sm">
                <Users size={20} />
              </span>
              All Student Attendance 
            </h2>
        
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2">Filter by Date</label>
              <input
                type="date"
                className="border border-slate-300 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 bg-white shadow-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-4 py-3 font-semibold shadow-sm transition hover:bg-emerald-700"
            >
              <Download size={16} /> <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 text-white px-4 py-3 font-semibold shadow-sm transition hover:bg-slate-900"
            >
              <FileText size={16} /> <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-[#f7f3ee] rounded-[32px] shadow-[0_22px_60px_rgba(15,23,42,0.12)] border border-[#e7ddd1] overflow-hidden">



          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#ebe3d8] text-slate-700 text-sm uppercase tracking-wider">
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Student ID</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Student Name</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Date</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Check Out</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Expected Return Date</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Expected Return Time</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Check In</th>
                <th className="p-6 border-b border-[#e2d7ca] font-bold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record._id} className={`${index % 2 === 0 ? 'bg-[#f8f4ee]' : 'bg-[#f2e9dd]'} hover:bg-[#efe3d4] border-b border-[#eadfce] last:border-0 transition-all duration-200`}>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.user?.studentId || 'N/A'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.user?.name || 'N/A'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.date}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">
                    {record.expectedReturn ? new Date(record.expectedReturn).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-5 text-slate-700 text-base font-medium">
                    {record.expectedReturn ? new Date(record.expectedReturn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="p-5 text-slate-700 text-base font-medium">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="p-5 text-slate-700 text-base font-medium">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm ${record.status === 'Inside' ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="8" className="p-12 text-center text-slate-500 text-lg">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mt-10 p-6 rounded-2xl shadow-sm border border-[#e2d7ca] bg-gradient-to-br from-[#f8f4ee] via-white to-[#eefaf8]">
           <h3 className="text-3xl font-extrabold text-slate-800 mb-6 text-center tracking-wide">
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
          fill={COLORS[index % COLORS.length]} 
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
      </div>
    </AdminShell>
  );
}
