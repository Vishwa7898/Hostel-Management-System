import React, { useState } from 'react';

const AdminLogin = ({ navigate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(true);
      return;
    }
    setError(false);
    navigate('admin-dashboard');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar background and overlay handled in CSS */}
      <div className="sidebar-dark">
        <div className="brand-text-orange">
          <svg className="brand-icon-orange" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          StaySphere
        </div>
        
        <div className="nav-item-dark" onClick={() => navigate('student-login')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Student
        </div>
        <div className="nav-item-dark active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.4 20h13.2A2 2 0 0 0 20.6 18c0-2-2.1-3.7-4.6-4.2a14.2 14.2 0 0 0-8 0C5.5 14.3 3.4 16 3.4 18a2 2 0 0 0 2 2z"/></svg>
          Admin
        </div>
        <div className="nav-item-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Management
        </div>
        <div className="nav-item-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Adto
        </div>
        <div className="nav-item-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Spucce
        </div>
        <div className="nav-item-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Hostel
        </div>
      </div>

      <div className="login-content-area">
        <div className="login-card login-card-admin">
          <div className="login-card-admin-inner">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '700', color: '#1a4e63' }}>
                <svg className="brand-icon-orange" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                StaySphere
              </div>
            </div>
            
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: '600' }}>Admin / Warden Login</h2>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address <span className="req">*</span></label>
                <div className="input-with-icon">
                  <input type="text" className="form-input" placeholder="Email Address" />
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.4 20h13.2A2 2 0 0 0 20.6 18c0-2-2.1-3.7-4.6-4.2a14.2 14.2 0 0 0-8 0C5.5 14.3 3.4 16 3.4 18a2 2 0 0 0 2 2z"/></svg>
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Password <span className="req">*</span></label>
                <input 
                  type="password" 
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="Password must be at least 8 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setTooltip(true)}
                  onBlur={() => setTooltip(false)}
                />
                {tooltip && <div className="tooltip">Example</div>}
                {error && <p className="error-text">Password must be at least 8 characters</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" style={{ appearance: 'none', background: 'transparent' }}>
                  <option>Warden / Accountant / Admin</option>
                  <option>Warden</option>
                  <option>Accountant</option>
                  <option>Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-orange">Login</button>
              
              {error && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ color: '#d32f2f', fontSize: '12px' }}>Invalid credentials - please try again</span>
                </div>
              )}
            </form>
          </div>
          <div className="login-card-admin-footer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              StaySphere
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: '0.9' }}>Hostel Management System</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
