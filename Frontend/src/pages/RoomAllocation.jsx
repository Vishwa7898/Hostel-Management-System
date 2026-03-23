import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RoomAllocation({ token }) {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals Control
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);

  // States for Editing/Assigning
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Form States - Price field එක අනිවාර්යයෙන්ම ඇතුළත් කර ඇත
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Single', floor: '', totalBeds: '', image: '', price: '' });
  const [roomEditData, setRoomEditData] = useState({ roomNumber: '', type: 'Single', floor: '', totalBeds: '', image: '', price: '' });
  const [studentData, setStudentData] = useState({ studentId: '', name: '', email: '', age: '', faculty: '', year: '1st Year' });
  const [assignment, setAssignment] = useState({ studentId: '', checkInDate: '', duration: '6 months' });

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, studentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms', config),
        axios.get('http://localhost:5000/api/students', config),
      ]);
      setRooms(roomsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (token) fetchData(); 
  }, [token]);

  // --- ROOM ACTIONS ---
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rooms', newRoom, config);
      alert('New Room Added Successfully!');
      setShowRoomModal(false);
      setNewRoom({ roomNumber: '', type: 'Single', floor: '', totalBeds: '', image: '', price: '' });
      fetchData();
    } catch (err) { 
      alert('Room Add Failed: ' + (err.response?.data?.message || err.message)); 
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/rooms/${editingRoomId}`, roomEditData, config);
      alert('Room Details Updated!');
      setShowEditRoomModal(false);
      fetchData();
    } catch (err) {
      alert('Room Update Failed');
    }
  };

  const openEditRoomModal = (room) => {
    setRoomEditData({
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      totalBeds: room.totalBeds,
      image: room.image || '',
      price: room.price || ''
    });
    setEditingRoomId(room._id);
    setShowEditRoomModal(true);
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`, config);
        fetchData();
      } catch (err) { alert('Room Delete Failed'); }
    }
  };

  // --- STUDENT ACTIONS ---
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/students/${editingStudentId}`, studentData, config);
        alert('Student Updated!');
      } else {
        await axios.post('http://localhost:5000/api/students/register', studentData, config);
        alert('Student Registered!');
      }
      setShowStudentModal(false);
      setStudentData({ studentId: '', name: '', email: '', age: '', faculty: '', year: '1st Year' });
      fetchData();
    } catch (err) { alert('Operation Failed'); }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId || !assignment.studentId) {
        alert("Please select a student and a room!");
        return;
    }
    const payload = {
      roomId: selectedRoomId,
      studentId: assignment.studentId,
      checkInDate: assignment.checkInDate,
      duration: assignment.duration
    };
    try {
      await axios.post('http://localhost:5000/api/allocations/assign', payload, config);
      alert('Student Assigned Successfully!');
      setShowAssignModal(false);
      setAssignment({ studentId: '', checkInDate: '', duration: '6 months' }); 
      fetchData(); 
    } catch (err) { 
      const errorMsg = err.response?.data?.message || "Check backend connection";
      alert('Assign Failed: ' + errorMsg); 
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`, config);
        fetchData();
      } catch (err) { alert('Delete Failed'); }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-600">Loading Hostel Data...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Room Allocation System</h1>
        <div className="flex gap-4">
          <button onClick={() => { setIsEditing(false); setShowStudentModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold shadow-md transition">
            + Register Student
          </button>
          <button onClick={() => setShowRoomModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold shadow-md transition">
            + Add New Room
          </button>
        </div>
      </div>

      {/* Main Rooms Table */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden mb-12">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Room No</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Occupancy (Occupied / Total)</th>
              <th className="px-6 py-4 text-left">Price (Rs.)</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => {
              // --- LOGIC FOR CAPACITY DISPLAY ---
              const occupied = room.occupiedCount !== undefined ? room.occupiedCount : (room.assignedStudentName ? 1 : 0);
              const total = room.totalBeds || room.capacity || 1;
              const isFull = occupied >= total;

              return (
                <tr key={room._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-700">{room.roomNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{room.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">{occupied} / {total} Beds</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${Math.min((occupied / total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-700">Rs. {room.price || '0'}</td>
                  <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isFull ? 'Full' : 'Available'}
                      </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <button 
                      disabled={isFull}
                      onClick={() => { setSelectedRoomId(room._id); setShowAssignModal(true); }} 
                      className={`font-bold ${isFull ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                    >
                      Assign
                    </button>
                    <button onClick={() => openEditRoomModal(room)} className="text-yellow-600 font-bold hover:underline">Edit</button>
                    <button onClick={() => deleteRoom(room._id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Registered Students Table */}
      <h2 className="text-xl font-bold mb-4 text-gray-700">Registered Students</h2>
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden mb-10">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Faculty</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                <td className="px-6 py-4 text-gray-600">{s.email}</td>
                <td className="px-6 py-4 text-gray-600">{s.faculty}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button onClick={() => { setStudentData(s); setEditingStudentId(s._id); setIsEditing(true); setShowStudentModal(true); }} className="text-blue-600 font-bold">Edit</button>
                  <button onClick={() => deleteStudent(s._id)} className="text-red-600 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: ADD NEW ROOM */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[400px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
                <input type="text" placeholder="Ex: R-109" className="w-full border p-2 rounded outline-none" required 
                  onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price per Month (Rs.)</label>
                <input type="number" placeholder="Ex: 5000" className="w-full border p-2 rounded outline-none bg-yellow-50" required 
                  onChange={(e) => setNewRoom({...newRoom, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Room Image URL</label>
                <input type="text" placeholder="room9.jpg" className="w-full border p-2 rounded outline-none" 
                  onChange={(e) => setNewRoom({...newRoom, image: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Room Type</label>
                <select className="w-full border p-2 rounded" value={newRoom.type} onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Floor No</label>
                  <input type="number" className="w-full border p-2 rounded outline-none" required 
                    onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Total Beds</label>
                  <input type="number" className="w-full border p-2 rounded outline-none" required 
                    onChange={(e) => setNewRoom({...newRoom, totalBeds: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowRoomModal(false)} className="px-4 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ROOM */}
      {showEditRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[400px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Room Details</h2>
            <form onSubmit={handleUpdateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
                <input type="text" className="w-full border p-2 rounded" required value={roomEditData.roomNumber}
                  onChange={(e) => setRoomEditData({...roomEditData, roomNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (Rs.)</label>
                <input type="number" className="w-full border p-2 rounded bg-yellow-50" required value={roomEditData.price}
                  onChange={(e) => setRoomEditData({...roomEditData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Total Beds</label>
                <input type="number" className="w-full border p-2 rounded" required value={roomEditData.totalBeds}
                  onChange={(e) => setRoomEditData({...roomEditData, totalBeds: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEditRoomModal(false)} className="text-gray-500 font-bold">Cancel</button>
                <button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded font-bold hover:bg-yellow-700">Update Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER STUDENT */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[450px] shadow-2xl">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Student Details' : 'Register New Student'}</h2>
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <input type="text" placeholder="Student ID" className="w-full border p-2 rounded outline-none" required value={studentData.studentId} onChange={(e) => setStudentData({...studentData, studentId: e.target.value})} />
              <input type="text" placeholder="Full Name" className="w-full border p-2 rounded outline-none" required value={studentData.name} onChange={(e) => setStudentData({...studentData, name: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded outline-none" required value={studentData.email} onChange={(e) => setStudentData({...studentData, email: e.target.value})} />
              <input type="text" placeholder="Faculty" className="w-full border p-2 rounded outline-none" required value={studentData.faculty} onChange={(e) => setStudentData({...studentData, faculty: e.target.value})} />
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" className="px-4 py-2 font-bold text-gray-500" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN STUDENT */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[400px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Student</h2>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <select className="w-full border p-2 rounded bg-gray-50" required 
                value={assignment.studentId}
                onChange={(e) => setAssignment({...assignment, studentId: e.target.value})}>
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
              </select>
              <input type="date" className="w-full border p-2 rounded" required 
                onChange={(e) => setAssignment({...assignment, checkInDate: e.target.value})} />
              <select className="w-full border p-2 rounded" value={assignment.duration}
                onChange={(e) => setAssignment({...assignment, duration: e.target.value})}>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
              </select>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow">Confirm Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}