import React, { useState } from 'react';
import { postForm } from '../api';

export default function Kiosk(){
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('Barangay Clearance');
  const [files, setFiles] = useState([]);
  const [created, setCreated] = useState(null);

  function onFilesChange(e){ setFiles(Array.from(e.target.files)); }

  async function submit(e){
    e.preventDefault();
    const fd = new FormData();
    fd.append('fullName', fullName);
    fd.append('contact', contact);
    fd.append('type', type);
    fd.append('amount', 0);
    files.forEach(f=>fd.append('files', f));
    const js = await postForm('/requests', fd);
    if (js && js.ok) setCreated(js.request);
  }

  return (
    <div className="kiosk-full">
      <div className="kiosk-panel">
        <h2>Assisted Digital Window (Staff)</h2>
        <p style={{marginTop:0}}>Staff can assist residents to create requests and upload documents.</p>
        {!created ? (
          <form onSubmit={submit}>
            <div className="form-row">
              <input placeholder="Resident full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
              <input placeholder="Contact number" value={contact} onChange={e=>setContact(e.target.value)} />
            </div>
            <div className="form-row">
              <select value={type} onChange={e=>setType(e.target.value)}>
                <option>Barangay Clearance</option>
                <option>Barangay ID</option>
                <option>Certificate of Residency</option>
                <option>Certificate of Indigency</option>
              </select>
              <input type="file" multiple onChange={onFilesChange} />
            </div>
            <div style={{marginTop:12}}>
              <button type="submit">Create Request</button>
            </div>
          </form>
        ) : (
          <div>
            <h3>Request created</h3>
            <div>ID: {created.id}</div>
            <div>Type: {created.type}</div>
          </div>
        )}
      </div>
    </div>
  );
}
