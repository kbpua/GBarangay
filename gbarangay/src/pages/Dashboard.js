import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';
import Chatbot from '../components/Chatbot';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  useEffect(()=>{
    let mounted = true;
    async function load(){
      try{
        const js = await get('/requests');
        if (mounted && js && js.requests) setRequests(js.requests.slice().reverse().slice(0,5));
      }catch(e){}
    }
    load();
    return ()=> mounted=false;
  },[]);

  const announcements = [
    { id:1, title:'Vaccination Drive', body:'Free vaccination at Barangay Hall this Saturday, 9AM - 1PM.' },
    { id:2, title:'Office Hours', body:'Extended office hours on Fridays for document pick-up.' }
  ];

  function statusClass(s){
    if(!s) return 'badge pending';
    if(s==='submitted') return 'badge pending';
    if(s==='processing') return 'badge processing';
    if(s==='ready') return 'badge ready';
    if(s==='completed') return 'badge completed';
    return 'badge';
  }

  // embed video id (replace with actual link if you want)
  const VIDEO_ID = 'k6idup0Jy9U';

  return (
    <div className="app-container">
        <div className="section">
          <h3>Information Video</h3>
          <div className="form-card" style={{padding:0}}>
            <div style={{position:'relative', paddingTop:'56.25%'}}>
              <iframe title="info-video" src={`https://www.youtube.com/embed/${VIDEO_ID}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', borderRadius:8}} />
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Announcements</h3>
          <div className="announcements">
            {announcements.map(a=> (
              <div key={a.id} style={{padding:'8px 6px'}}>
                <div style={{fontWeight:700}}>{a.title}</div>
                <div style={{fontSize:13, opacity:0.85}}>{a.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Recent Requests</h3>
          <div className="announcements requests-list" style={{maxHeight:220, overflowY:'auto'}}>
            {requests && requests.length ? requests.map(r=> (
              <div className="request-item" key={r.id}>
                <div style={{flex:1, textAlign:'left'}}>
                  <div style={{fontWeight:700}}>{r.type}</div>
                  <div style={{fontSize:13, opacity:0.8}}>{r.fullName || 'Anonymous'} • ₱{r.amount}</div>
                </div>
                <div style={{minWidth:120, textAlign:'right'}}>
                  <div className={statusClass(r.status)}>{r.status}</div>
                  <div style={{marginTop:6}}><Link to={`/requests/${r.id}`}>View</Link></div>
                </div>
              </div>
            )) : <div style={{padding:12}}>No recent requests</div>}
          </div>
        </div>
        {/* Place chatbot in dashboard so it is visible inside phone frame */}
        <Chatbot />
      </div>
  );
}
