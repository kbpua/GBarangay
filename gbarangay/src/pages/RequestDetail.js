import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get, postJson } from '../api';

export default function RequestDetail(){
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchOne(){
      setLoading(true);
      try {
        const json = await get(`/requests/${id}`);
        if (mounted) {
          if (json && json.request) setRequest(json.request);
          else setError('Request not found');
        }
      } catch (err) {
        setError(err.message || String(err));
      }
      setLoading(false);
    }

    fetchOne();

    // poll for updates every 3 seconds
    const iv = setInterval(fetchOne, 3000);
    return () => { mounted = false; clearInterval(iv); };
  }, [id]);

  async function simulateWebhook() {
    if (!request) return;
    try {
      // find associated payment
      const payments = await get('/payments');
      const p = (payments.payments || []).find(x => x.requestId === request.id);
      if (!p) return alert('No payment found for this request. Create payment first.');
      const resp = await postJson('/payments/gcash/webhook', { providerReference: p.providerReference, status: 'paid' });
      if (resp && resp.ok) {
        alert('Payment marked paid (webhook simulated).');
      }
    } catch (err) {
      alert('Webhook error: ' + (err.message || String(err)));
    }
  }

  if (loading) return <div style={{padding:20}}>Loading…</div>;
  if (error) return <div style={{padding:20, color:'red'}}>Error: {error}</div>;

  if (!request) return <div style={{padding:20}}>No data</div>;

  return (
    <div style={{padding:20}}>
      <h1>Request Detail</h1>
      <div><strong>ID:</strong> {request.id}</div>
      <div><strong>Name:</strong> {request.fullName}</div>
      <div><strong>Type:</strong> {request.type}</div>
      <div><strong>Status:</strong> {request.status} / payment: {request.paymentStatus}</div>
      <div style={{marginTop:12}}>
        <h3>Files</h3>
        {request.files && request.files.length ? (
          <ul>
            {request.files.map(f => (
              <li key={f.filename}><a href={f.url} target="_blank" rel="noreferrer">{f.originalname || f.filename}</a></li>
            ))}
          </ul>
        ) : <div>No files uploaded</div>}
      </div>

      <div style={{marginTop:16}}>
        <h3>Actions</h3>
        <div>
          <button className="btn-outline small" onClick={simulateWebhook}>Simulate GCash webhook (mark paid)</button>
        </div>
      </div>
    </div>
  );
}
