import api from './api';

export function saveToken(token) { localStorage.setItem('token', token); api.defaults.headers.common['Authorization'] = `Bearer ${token}`; }
export function clearToken() { localStorage.removeItem('token'); delete api.defaults.headers.common['Authorization']; }
export function getToken() { return localStorage.getItem('token'); }

const t = getToken();
if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
