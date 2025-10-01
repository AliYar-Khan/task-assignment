import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


export default function SignupForm({ onSignup }: { onSignup: (token: string) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const tenantSubdomain = 'acme.yourapp.com';
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, tenantSubdomain }),
            });
            const data = await res.json();
            if (res.ok) {
                onSignup(data.token);
            } else {
                setError(data.error || 'Signup failed');
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
                <h2>Sign Up</h2>
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
}