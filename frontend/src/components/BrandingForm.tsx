import React, { useState } from 'react';
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function BrandingForm({ token, onSuccess }: { token: string; onSuccess?: () => void }) {
  const [logoUrl, setLogoUrl] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${BACKEND_URL}/branding/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ logoUrl, name, color })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Branding created!');
        onSuccess && onSuccess();
      } else {
        setError(data.error || 'Failed to create branding');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Branding</h2>
      <input placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Color" value={color} onChange={e => setColor(e.target.value)} />
      <button type="submit">Create Branding</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
}
