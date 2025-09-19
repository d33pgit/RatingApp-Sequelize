import React, { useState } from 'react';
import api from '../api';
import { saveToken } from '../auth';

export default function Register({ onRegister }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [address,setAddress] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);

  const submit = async () => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, address });
      saveToken(data.token);
      onRegister(data.user);
    } catch (e) {
      setError(e.response?.data?.errors?.join(', ') || e.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div className="card">
      <h3>Register</h3>
      {error && <div className="error">{error}</div>}
      <input placeholder="Name (20-60)" value={name} onChange={(e)=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={submit}>Register</button>
    </div>
  );
}