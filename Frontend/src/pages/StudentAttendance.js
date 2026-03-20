import React, { useState } from 'react';

const StudentAttendance = ({ navigate }) => {
  const [status, setStatus] = useState('IN'); // 'IN' or 'OUT'
  const [checkoutTime, setCheckoutTime] = useState('');
  const [purpose, setPurpose] = useState('Shopping');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [error, setError] = useState(false);
  
  const [history, setHistory] = useState([
    { id: 1, type: 'OUT', date: 'Date', time: 'Check-Out Time', status: 'Shopping' } // just a header demo
  ]);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!checkoutTime) {
      setError(true);
      return;
    }
    setError(false);
    setStatus('OUT');
    setHistory([...history, { 
      id: Date.now(), 
      type: 'OUT', 
      date: checkoutTime.split('T')[0] || '15 Oct 2023', 
      time: checkoutTime.split('T')[1] || '12:30 PM', 
      status: purpose 
    }]);
  };

  const handleCheckin = () => {
    setStatus('IN');
  };

  return (
    <div>
      <div className="dash-header">
        <div className="dash-titlebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          StaySphere
        </div>
        <div className="dash-user">
          Welcome, Dilani Perera (Student ID: STU202345) &nbsp; 
          <button style={{background:'white', color:'#20878c', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer'}} onClick={() => navigate('student-login')}>Logout</button>
        </div>
      </div>

      <div className="dash-body">
        <h1 className="dash-main-title">
          My <span>Attendance</span> - Check In / Check Out
        </h1>

        <div className="grid-layout">
          <div>
            <div className="status-cards">
              <div className="status-card status-card-green">
                <div className="title">Currently<br/>IN Hostel</div>
                <div className="subtitle">{status === 'IN' ? '12:30 PM, 15 Oct 2023' : '--'}</div>
                <div className="status-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>

              <div className="status-card status-card-orange">
                <div className="title">Go Outside?</div>
                {status === 'IN' ? (
                  <button className="status-card-btn" style={{ background: '#d87024', marginTop: '15px' }} onClick={() => document.getElementById('checkout-time').focus()}>
                    Check-Out Now
                  </button>
                ) : (
                  <button className="status-card-btn" style={{ background: '#d87024', marginTop: '15px' }} onClick={handleCheckin}>
                    Check-In Now (Return)
                  </button>
                )}
              </div>
            </div>

            <div className="form-panel">
              <form onSubmit={handleCheckout}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Check-Out Time <span className="req">*</span></label>
                      {error && <span className="badge-red">Check-out time is required</span>}
                    </div>
                    <div className="input-with-icon">
                      <input 
                        id="checkout-time"
                        type="datetime-local" 
                        className={`form-input ${error ? 'error' : ''}`}
                        value={checkoutTime}
                        onChange={(e) => setCheckoutTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expected Return <span className="req">*</span></label>
                    <div className="input-with-icon">
                      <input 
                        type="datetime-local" 
                        className="form-input"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Purpose</label>
                  <select 
                    className="form-input" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Medical">Medical</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-green" 
                  style={{ background: '#399663', padding: '16px', fontSize: '18px' }}
                  disabled={status === 'OUT'}
                >
                  Confirm Check-Out
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="history-panel">
              <div className="form-panel-header" style={{ fontWeight: '600', fontSize: '18px' }}>
                Recent History
              </div>
              <table className="history-table">
                <tbody>
                  {history.map((h, i) => (
                    <tr key={h.id}>
                      <td style={{ color: '#555' }}>
                        {h.date === 'Date' ? 'Date' : (h.type === 'IN' ? 'Check-In' : 'Check-Out Time')}
                      </td>
                      <td>
                        {h.status === 'Shopping' && h.date === 'Date' ? 'Status' : (
                          <span className={h.type === 'IN' ? 'badge-green' : 'badge-red'} style={{ background: h.type === 'IN' ? '#e6f7ec' : '#399663', color: 'white' }}>
                            {h.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ color: '#555' }}>Check-Out Time</td>
                    <td><span className="badge-red" style={{ background: '#d32f2f', color: 'white' }}>Medical</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555' }}>Check-Out Time</td>
                    <td><span className="badge-red" style={{ background: '#399663', color: 'white' }}>Shopping</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555' }}>Check-Out Time</td>
                    <td><span className="badge-red" style={{ background: '#d32f2f', color: 'white' }}>Home</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;

