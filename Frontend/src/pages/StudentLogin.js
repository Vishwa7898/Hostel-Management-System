import React, { useState } from 'react';

const StudentLogin = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError(true);
      return;
    }
    setError(false);
    navigate('student-attendance');
  };

  return (
    <div className="student-layout">
      {/* Sidebar */}
      <div className="sidebar-light">
        <div className="brand-text-green">StaySphere</div>
        
        <div className="nav-item-light active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Student View
        </div>
        <div className="nav-item-light" onClick={() => navigate('student-attendance')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          Dashboard
        </div>
        <div className="nav-item-light">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Attendance
        </div>
        <div className="nav-item-light">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Room Allocation
        </div>
        <div className="nav-item-light">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Payments
        </div>
        <div className="nav-item-light">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Complaints
        </div>

        <div style={{ marginTop: 'auto', fontSize: '12px', color: '#888', textAlign: 'center' }}>
          © 2026 StaySphere | MERN Stack<br/>
          <button style={{background:'transparent', border:'none', color:'#4FB176', marginTop:'10px', cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('admin-login')}>Switch to Admin Login</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content-area">
        <div className="login-header">Student Login</div>
        
        <div className="login-card">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '600' }}>Student Login</h2>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address <span className="req">*</span></label>
              <input 
                type="text" 
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="error-text">Please enter a valid email address</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="req">*</span></label>
              <div className="input-with-icon">
                <input 
                  type="password" 
                  className="form-input"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ accentColor: '#333' }} />
              <label htmlFor="remember" style={{ fontSize: '14px', fontWeight: '500' }}>Remember Me</label>
            </div>

            <button type="submit" className="btn btn-green">Login</button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <a href="#" style={{ color: '#247B8F', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;

