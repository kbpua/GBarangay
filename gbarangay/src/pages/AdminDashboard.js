import React, { useEffect, useState } from 'react';
import { get, postJson } from '../api';
import OverflowMenu from '../components/OverflowMenu';

export default function AdminDashboard(){
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try{
      const js = await get('/requests');
      if (js && js.requests) setRequests(js.requests.slice().reverse());
    }catch(e){}
    setLoading(false);
  }

  async function updateStatus(id, status){
    try{
      await postJson(`/requests/${id}/status`, { status });
      load();
    }catch(e){ alert('Update failed'); }
  }

  return (
    <div style={{padding:20}}>
      <h1>Barangay Admin Dashboard</h1>
      <div className="form-card">
        <h3>Requests</h3>
        {loading ? <div>Loading…</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th style={{minWidth:120}}>Id</th><th style={{minWidth:120}}>Name</th><th style={{minWidth:120}}>Type</th><th style={{minWidth:80}}>Amount</th><th style={{minWidth:120}}>Status</th><th style={{minWidth:160}}>Actions</th></tr>
              </thead>
              <tbody>
                {requests.map(r=> (
                  <tr key={r.id}>
                    <td style={{maxWidth:200, overflowWrap:'anywhere'}}>{r.id}</td>
                    <td style={{whiteSpace:'normal'}}>{r.fullName}</td>
                    <td style={{whiteSpace:'normal'}}>{r.type}</td>
                    <td>₱{r.amount}</td>
                    <td>{r.status} / {r.paymentStatus}</td>
                    <td className="admin-actions">
                        {/* On narrow screens use overflow menu */}
                        <div className="admin-actions-inline">
                          <div className="desktop-actions">
                            <button className="btn-outline small" onClick={()=>updateStatus(r.id,'processing')}>Set Processing</button>
                            <button className="btn-outline small" onClick={()=>updateStatus(r.id,'ready')}>Set Ready</button>
                            <button className="btn-outline small" onClick={()=>updateStatus(r.id,'completed')}>Set Completed</button>
                            <a className="btn-outline small" href={`/requests/${r.id}`} style={{marginLeft:8, textDecoration:'none', display:'inline-block'}}>View</a>
                          </div>
                          <div className="mobile-actions">
                            <OverflowMenu actions={[
                              { label: 'Set Processing', onClick: ()=>updateStatus(r.id,'processing') },
                              { label: 'Set Ready', onClick: ()=>updateStatus(r.id,'ready') },
                              { label: 'Set Completed', onClick: ()=>updateStatus(r.id,'completed') },
                              { label: 'View', onClick: ()=>{ window.location.href = `/requests/${r.id}` } }
                            ]} />
                          </div>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
