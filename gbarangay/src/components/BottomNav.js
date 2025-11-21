import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Icon({name, active}){
  const color = active ? '#0b67d0' : '#6b7280';
  switch(name){
    case 'home': return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'request': return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M21 8V6a2 2 0 0 0-2-2h-3l-2-2H10L8 4H5a2 2 0 0 0-2 2v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'admin': return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.2"/><path d="M6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

export default function BottomNav(){
  const loc = useLocation();
  return (
    <nav className="bottom-nav">
      <Link to="/" className="bottom-nav-item"> <Icon name="home" active={loc.pathname === '/'} /> <div>Home</div> </Link>
      <Link to="/requests/new" className="bottom-nav-item"> <Icon name="request" active={loc.pathname === '/requests/new'} /> <div>Request</div> </Link>
      <Link to="/admin" className="bottom-nav-item"> <Icon name="admin" active={loc.pathname === '/admin'} /> <div>Admin</div> </Link>
      
    </nav>
  );
}
