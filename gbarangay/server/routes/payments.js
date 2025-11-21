const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

// Create a mock GCash payment order (returns a mock payment URL and provider reference)
router.post('/gcash/create', (req, res) => {
  const { requestId, amount } = req.body;
  const request = store.db.requests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const providerReference = `GCASH-${uuidv4()}`;
  const payment = {
    id: uuidv4(),
    requestId,
    amount: Number(amount || request.amount || 0),
    provider: 'gcash-mock',
    providerReference,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  store.db.payments.push(payment);
  store.save(store.db);

  // In a real integration you'd return a provider payment URL or QR data.
  res.json({ ok: true, payment, payment_url: `https://mock-gcash/pay?ref=${providerReference}` });
});

// Webhook receiver (mock) to update payment status
router.post('/gcash/webhook', (req, res) => {
  const { providerReference, status } = req.body;
  const p = store.db.payments.find(x => x.providerReference === providerReference);
  if (!p) return res.status(404).json({ error: 'Payment not found' });
  p.status = status || p.status;

  // update related request
  const r = store.db.requests.find(x => x.id === p.requestId);
  if (r) {
    r.paymentStatus = p.status === 'paid' ? 'paid' : r.paymentStatus;
    if (p.status === 'paid') r.status = 'processing';
  }

  store.save(store.db);

  res.json({ ok: true, payment: p, request: r });
});

// List payments
router.get('/', (req, res) => {
  res.json({ payments: store.db.payments });
});

module.exports = router;
