import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';


interface Metrics {
  callsToday: number;
  activeUsers: number;
}

export default function Dashboard({ token }: { token: string }) {
  const [role, setRole] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user role
    fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRole(data.role))
      .catch(() => setError('Failed to fetch role'));

    // Fetch metrics
    fetch(`${BACKEND_URL}/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(() => setError('Failed to fetch metrics'));
  }, [token]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!role || !metrics) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard ({role})</h2>
      <div>
        <strong>Calls Today:</strong> {metrics.callsToday}
      </div>
      <div>
        <strong>Active Users:</strong> {metrics.activeUsers}
      </div>
      {role === 'admin' ? (
        <div>
          <h3>Admin Panel</h3>
          <Link to="/branding-form">Update/Create Branding</Link>
        </div>
      ) : (
        <div>
          <h3>User Panel</h3>
        </div>
      )}
    </div>
  );
}