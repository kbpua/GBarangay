const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const store = require('../data/store');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e6)}-${file.originalname}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// Create a request (with optional file uploads)
router.post('/', upload.array('files', 8), (req, res) => {
  const { type, fullName, contact, amount } = req.body;
  const id = uuidv4();
  const files = (req.files || []).map(f => ({ filename: f.filename, originalname: f.originalname, mimetype: f.mimetype, url: `/uploads/${f.filename}` }));

  // Prototype ID verification: mark idVerified if any uploaded file is a PNG image
  const idVerified = files.some(f => f.mimetype === 'image/png' || (f.originalname && f.originalname.toLowerCase().endsWith('.png')));

  const request = {
    id,
    type: type || 'unknown',
    fullName: fullName || null,
    contact: contact || null,
    amount: amount ? Number(amount) : 0,
    files,
    idVerified: !!idVerified,
    status: 'submitted',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  store.db.requests.push(request);
  store.save(store.db);

  res.json({ ok: true, request });
});

// List requests
router.get('/', (req, res) => {
  res.json({ requests: store.db.requests });
});

// Get request by id
router.get('/:id', (req, res) => {
  const r = store.db.requests.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json({ request: r });
});

// Update request status (admin)
router.post('/:id/status', (req, res) => {
  const { status } = req.body;
  const r = store.db.requests.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  r.status = status || r.status;
  store.save(store.db);
  res.json({ ok: true, request: r });
});

module.exports = router;
