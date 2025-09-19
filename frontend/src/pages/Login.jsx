import React, { useState } from 'react';
import api from '../api';
import { saveToken } from '../auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async () => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveToken(data.token);
      onLogin(data.user);
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h3>Login</h3>
      {error && <div className="error">{error}</div>}
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}