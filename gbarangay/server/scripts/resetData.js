const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '..', 'data', 'data.json');

function backup(orig) {
  try {
    const bak = orig + '.bak.' + Date.now();
    fs.copyFileSync(orig, bak);
    console.log('Backup created:', bak);
  } catch (err) {
    console.warn('No existing data file to backup or backup failed:', err.message);
  }
}

function reset(orig) {
  const fresh = {
    requests: [],
    payments: [],
    receipts: [],
    announcements: [],
    users: []
  };
  fs.writeFileSync(orig, JSON.stringify(fresh, null, 2), 'utf8');
  console.log('Reset complete — wrote empty arrays to', orig);
}

console.log('Resetting data store at', dataFile);
backup(dataFile);
reset(dataFile);
