import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postForm, postJson } from '../api';

export default function NewRequest() {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('Barangay Clearance');
  const [amount, setAmount] = useState('50');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  const navigate = useNavigate();

  function onFilesChange(e) {
    setFiles(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('fullName', fullName);
      fd.append('contact', contact);
      fd.append('type', type);
      fd.append('amount', amount);
      files.forEach(f => fd.append('files', f));

      const json = await postForm('/requests', fd);
      if (json && json.ok) {
        setCreated(json.request);
      } else {
        // Show useful error text when server returns HTML or text
        const msg = json && (json.error || json.text || (`HTTP ${json.status}`)) ? (json.error || json.text || `HTTP ${json.status}`) : 'Unknown error';
        setError(msg);
      }
    } catch (err) {
      setError(err.message || String(err));
    }
    setLoading(false);
  }

  async function startPayment() {
    if (!created) return;
    try {
      const p = await postJson('/payments/gcash/create', { requestId: created.id, amount: created.amount });
      if (p && p.ok) {
        navigate(`/requests/${created.id}`);
      } else {
        setError('Failed to create payment');
      }
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  const requirements = {
    'Barangay Clearance': ['Valid ID', 'Community Tax Certificate (if applicable)'],
    'Barangay ID': ['Photo', 'Proof of residence'],
    'Certificate of Residency': ['Valid ID', 'Proof of address'],
    'Certificate of Indigency': ['Valid ID', 'Supporting documents']
  };

  return (
    <div style={{padding:20}}>
      <h1>Request Document</h1>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
            <input placeholder="Contact (phone or email)" value={contact} onChange={e=>setContact(e.target.value)} required />
          </div>

          <div className="form-row">
            <select value={type} onChange={e=>setType(e.target.value)}>
              <option>Barangay Clearance</option>
              <option>Barangay ID</option>
              <option>Certificate of Residency</option>
              <option>Certificate of Indigency</option>
            </select>
            <input type="number" placeholder="Amount (PHP)" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:120}} />
          </div>

          <div>
            <div style={{fontWeight:700, marginBottom:6}}>Requirements</div>
            <ul>
              {(requirements[type]||[]).map((r,i)=> <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div style={{marginTop:8}}>
            <label style={{display:'block', marginBottom:6}}>Supporting files (photos, IDs, proofs)</label>
            <div className="file-input-wrapper">
              <label className="file-chooser-btn btn-outline" htmlFor="files-input">Choose Files</label>
              <input id="files-input" type="file" multiple onChange={onFilesChange} style={{display:'none'}} />
              <div className="file-names">
                {files.length === 0 ? <span className="file-placeholder">No file chosen</span> : files.map((f,idx)=>(<div className="file-item" key={idx}>{f.name}</div>))}
              </div>
            </div>
          </div>

          <div style={{marginTop:12}} className="form-actions">
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Submitting…' : 'Submit Request'}</button>
            {created && <button type="button" className="btn-outline" onClick={startPayment}>Start mock GCash payment</button>}
          </div>
        </form>
      </div>

      {error && <div style={{color:'red', marginTop:12}}>{error}</div>}

      {created && (
        <div style={{marginTop:20}} className="form-card">
          <h3>Request created</h3>
          <div>ID: {created.id}</div>
          <div>Type: {created.type}</div>
          <div>Amount: ₱{created.amount}</div>
          <div style={{marginTop:8}}>
            <button className="btn-outline small" onClick={() => navigate(`/requests/${created.id}`)}>View request</button>
          </div>
        </div>
      )}
    </div>
  );
}
