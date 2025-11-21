import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import RequestDetail from './pages/RequestDetail';
import AdminDashboard from './pages/AdminDashboard';
import BottomNav from './components/BottomNav';

function App(){
  return (
    <BrowserRouter>
      <div className="phone-frame-wrap">
        <div className="phone-frame">
          <div className="phone-inner">
            <div className="phone-scroll">
              <NavBar />
              <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/requests/new" element={<NewRequest/>} />
                <Route path="/requests/:id" element={<RequestDetail/>} />
                <Route path="/admin" element={<AdminDashboard/>} />
              </Routes>
            </div>
            <BottomNav />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
