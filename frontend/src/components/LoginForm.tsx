import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';


export default function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Extract subdomain from window.location.hostname
  const getTenantSubdomain = () => {
    const host = window.location.hostname;
    const parts = host.split('.');
    // If using localhost or no subdomain, fallback to empty string
    if (host === 'localhost' || parts.length < 3) return '';
    return parts[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const tenantSubdomain = getTenantSubdomain();
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantSubdomain }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', minWidth: 500, minHeight: 300, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Login</h2>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="button" style={{ marginTop: 10 }} onClick={() => navigate('/signup')}>
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
}