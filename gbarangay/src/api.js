const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

async function postForm(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
  });
  const text = await res.text();
  try { return JSON.parse(text); }
  catch (e) { return { ok: res.ok, status: res.status, text }; }
}

async function postJson(path, obj) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });
  const text = await res.text();
  try { return JSON.parse(text); }
  catch (e) { return { ok: res.ok, status: res.status, text }; }
}

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const text = await res.text();
  try { return JSON.parse(text); }
  catch (e) { return { ok: res.ok, status: res.status, text }; }
}

export { API_BASE, postForm, postJson, get };
