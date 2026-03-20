import React, { useState } from 'react';

const AdminDashboard = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'attendance'
  
  // Mock Data
  const [users, setUsers] = useState([
    { id: 'STU202345', name: 'Dilani Perera', email: 'dilani@test.com', role: 'Student' },
    { id: 'STU202346', name: 'John Doe', email: 'john@test.com', role: 'Student' },
  ]);
  
  const [attendance, setAttendance] = useState([
    { id: 1, studentId: 'STU202345', date: '15 Oct 2023', time: '12:30 PM', type: 'OUT', status: 'Shopping' },
    { id: 2, studentId: 'STU202346', date: '15 Oct 2023', time: '08:00 AM', type: 'IN', status: 'Returned' },
  ]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'ADD_USER', 'EDIT_USER', 'ADD_ATT', 'EDIT_ATT'
  const [formData, setFormData] = useState({});

  const handleOpenModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalType === 'ADD_USER') {
      setUsers([...users, { ...formData, id: `STU${Math.floor(Math.random()*10000)}` }]);
    } else if (modalType === 'EDIT_USER') {
      setUsers(users.map(u => u.id === formData.id ? formData : u));
    } else if (modalType === 'ADD_ATT') {
      setAttendance([...attendance, { ...formData, id: Date.now() }]);
    } else if (modalType === 'EDIT_ATT') {
      setAttendance(attendance.map(a => a.id === formData.id ? formData : a));
    }
    closeModal();
  };

  const handleDeleteUser = (id) => {
    if(window.confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  const handleDeleteAtt = (id) => {
    if(window.confirm('Delete this attendance record?')) setAttendance(attendance.filter(a => a.id !== id));
  };

  const downloadCSV = () => {
    const headers = ['Student ID', 'Date', 'Time', 'Type', 'Status'];
    const rows = attendance.map(a => [a.studentId, a.date, a.time, a.type, `"${a.status}"`]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f7fa', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Dark Sidebar */}
      <div className="sidebar-dark" style={{ background: '#1d4052' }}>
        <div className="brand-text-orange" style={{ fontSize: '28px', marginBottom: '50px' }}>
          <svg className="brand-icon-orange" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          StaySphere
        </div>
        
        <div className={`nav-item-dark ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          User Management
        </div>
        <div className={`nav-item-dark ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Attendance Logs
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate('landing')}>Logout to Landing</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 50px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 className="dash-main-title" style={{ fontSize: '32px', margin: 0, color: '#1d4052' }}>
            {activeTab === 'users' ? 'User Management' : 'Attendance Configuration'}
          </h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            {activeTab === 'attendance' && (
              <button 
                className="btn btn-orange" 
                style={{ width: 'auto', background: '#e9f2f4', color: '#1d4052', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={downloadCSV}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download CSV
              </button>
            )}
            <button 
              className="btn btn-orange" 
              style={{ width: 'auto', background: 'linear-gradient(135deg, #f28b24 0%, #ea5c1b 100%)', padding: '12px 24px', borderRadius: '30px' }}
              onClick={() => handleOpenModal(activeTab === 'users' ? 'ADD_USER' : 'ADD_ATT')}
            >
              + Add New Record
            </button>
          </div>
        </div>

        <div className="history-panel" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          {activeTab === 'users' && (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '600' }}>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge-green">{u.role}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="action-btn edit" onClick={() => handleOpenModal('EDIT_USER', u)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'attendance' && (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Details/Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: '600' }}>{a.studentId}</td>
                    <td>{a.date} - {a.time}</td>
                    <td>
                      <span className={a.type === 'IN' ? 'badge-green' : 'badge-red'}>{a.type}</span>
                    </td>
                    <td>{a.status}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="action-btn edit" onClick={() => handleOpenModal('EDIT_ATT', a)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDeleteAtt(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="dash-main-title" style={{ marginTop: 0 }}>
              {modalType.includes('ADD') ? 'Add New Record' : 'Edit Record'}
            </h2>
            <form onSubmit={handleSave}>
              {modalType.includes('USER') ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-input" value={formData.role || 'Student'} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                      <option>Student</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input type="text" className="form-input" required value={formData.studentId || ''} onChange={(e) => setFormData({...formData, studentId: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="text" className="form-input" required placeholder="15 Oct 2023" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="text" className="form-input" required placeholder="12:30 PM" value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Type (IN/OUT)</label>
                      <select className="form-input" value={formData.type || 'OUT'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option>IN</option>
                        <option>OUT</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Status Details</label>
                      <input type="text" className="form-input" placeholder="Shopping / Returned" value={formData.status || ''} onChange={(e) => setFormData({...formData, status: e.target.value})} />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button type="button" className="btn" style={{ background: '#ddd', color: '#333' }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-orange">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
