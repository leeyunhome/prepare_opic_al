// Tiny localStorage wrapper with JSON serialization + a single namespace.
const NS = 'ava_opic_v1';

function read() {
  try {
    const raw = localStorage.getItem(NS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function write(obj) {
  try {
    localStorage.setItem(NS, JSON.stringify(obj));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

export function get(key, fallback = null) {
  const all = read();
  return key in all ? all[key] : fallback;
}
export function set(key, value) {
  const all = read();
  all[key] = value;
  write(all);
}
export function remove(key) {
  const all = read();
  delete all[key];
  write(all);
}
export function clearAll() {
  localStorage.removeItem(NS);
}
export function exportAll() {
  return read();
}
