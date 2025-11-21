const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    // Ensure required collections exist even if file is present but empty/object
    data.requests = Array.isArray(data.requests) ? data.requests : [];
    data.payments = Array.isArray(data.payments) ? data.payments : [];
    data.receipts = Array.isArray(data.receipts) ? data.receipts : [];
    data.announcements = Array.isArray(data.announcements) ? data.announcements : [];
    data.users = Array.isArray(data.users) ? data.users : [];
    return data;
  } catch (e) {
    return { requests: [], payments: [], receipts: [], announcements: [], users: [] };
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const db = load();

module.exports = {
  db,
  save,
};
