import React from 'react';

const Landing = ({ navigate }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #09bed6 0%, #16d68b 50%, #a4ea58 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <h1 style={{ fontSize: '56px', fontWeight: '800', margin: 0, fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>StaySphere</h1>
      </div>
      
      <p style={{ fontSize: '20px', marginBottom: '50px', opacity: '0.9' }}>Hostel Management System</p>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Student Login Card */}
        <div 
          onClick={() => navigate('student-login')}
          style={{
            background: 'white',
            color: '#247B8F',
            padding: '40px 50px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            width: '240px'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Student Login</h2>
        </div>

        {/* Admin Login Card */}
        <div 
          onClick={() => navigate('admin-login')}
          style={{
            background: '#f28b24',
            color: 'white',
            padding: '40px 50px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            width: '240px'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <h2 style={{ fontSize: '24px', margin: 0, textAlign: 'center' }}>Admin / Warden Log In</h2>
        </div>
      </div>
    </div>
  );
};

export default Landing;
