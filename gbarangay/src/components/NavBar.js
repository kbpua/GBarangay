import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar(){
  return (
    <header className="topbar">
      <div className="logo">
        <img src="/images/gbarangay-logo.png" alt="GBarangay" className="topbar-logo" />
        <div className="topbar-brand">
          <div className="logo-text">GBarangay</div>
          <div className="topbar-tagline">Your Government in Your Pocket.</div>
        </div>
      </div>
      <div className="right">
        <Link to="/requests/new" style={{color:'white', marginRight:12, textDecoration:'none'}}>New</Link>
        <Link to="/admin" style={{color:'white', textDecoration:'none'}}>Admin</Link>
      </div>
    </header>
  );
}
