import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, X } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ purpose: '', description: '', expectedReturnDate: '', expectedReturnTime: '' });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-dashboard');
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (rec) => {
    const expected = rec.expectedReturn ? new Date(rec.expectedReturn) : null;
    let expectedReturnDate = '';
    let expectedReturnTime = '';
    if (expected) {
      expectedReturnDate = expected.toISOString().split('T')[0];
      expectedReturnTime = expected.toTimeString().substring(0, 5);
    }
    setEditForm({
      purpose: rec.purpose || '',
      description: rec.description || '',
      expectedReturnDate,
      expectedReturnTime
    });
    setEditingRecord(rec);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    const body = {
  purpose: editForm.purpose,
  description: editForm.description
};

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${editingRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingRecord(null);
        fetchAttendance();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Server error updating record.');
    }
  };

  return (
    <div>
      <StudentShell activeKey="attendance" title="My Attendance History">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400 to-green-500 text-white text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-semibold">Date</th>
                  <th className="p-4 border-b font-semibold">Check Out Time</th>
                  <th className="p-4 border-b font-semibold">Check In Time</th>
                  <th className="p-4 border-b font-semibold">Status</th>
                  <th className="p-4 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                <tr key={record._id} className={`${ index % 2 === 0 ? 'bg-white' : 'bg-orange-50'} 
                  hover:bg-orange-100 border-b last:border-0 transition-all duration-200`}>
                    <td className="p-4 text-slate-600 font-medium">{record.date}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm shadow-sm">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </td>

                    <td className="p-4"><span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm shadow-sm">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                     </span>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm shadow-sm">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                    </td>

                    <td className="p-4 flex gap-3">
                      <button onClick={() => openEditModal(record)} className="text-blue-500 hover:text-blue-700 transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(record._id)} className="text-red-500 hover:text-red-700 transition">
                        <Trash2 size={18} />
                      </button>
                    </td>

                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-500 text-lg">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      </StudentShell>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setEditingRecord(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Record - {editingRecord.date}</h2>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Purpose</label>
                <select value={editForm.purpose} onChange={e => setEditForm({...editForm, purpose: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none text-sm font-semibold text-slate-600">
                  <option value="Home">Home</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:border-teal-500 outline-none text-sm font-semibold text-slate-600 h-24 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Expected Date</label>
                  <input 
                        type="date" 
                        value={editForm.expectedReturnDate} 
                        disabled 
                        className="w-full p-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Expected Time</label>
                  <input 
  type="time" 
  value={editForm.expectedReturnTime} 
  disabled 
  className="w-full p-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed" 
/>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#369567] hover:bg-[#2b7953] text-white py-3 rounded-xl font-bold text-lg mt-4 shadow-sm transition-all">
                Update Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
