const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const requestsRouter = require('./routes/requests');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/requests', requestsRouter);
app.use('/api/payments', paymentsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`GBarangay server running on http://localhost:${PORT}`);
});
