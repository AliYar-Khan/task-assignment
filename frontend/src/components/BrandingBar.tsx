import { useEffect, useState } from 'react';

interface Branding {
  logoUrl?: string;
  name?: string;
  color?: string;
}

export default function BrandingBar() {
  const [branding, setBranding] = useState<Branding>({});

  useEffect(() => {
    fetch('http://localhost:3000/branding')
      .then(async res => {
        if (!res.ok) throw new Error('No branding');
        return res.json();
      })
      .then(data => {
        if (!data || !data.name) {
          setBranding({ name: 'Your App', color: '#333' });
        } else {
          setBranding(data);
        }
      })
      .catch(() => setBranding({ name: 'Your App', color: '#333' }));
  }, []);

  return (
    <div style={{ background: branding.color || '#333', color: '#fff', padding: '1rem', display: 'flex', position: 'fixed', width: '100%', top: 0, alignItems: 'center' }}>
      {branding.logoUrl ? (
        <img src={branding.logoUrl} alt="logo" style={{ height: 32, marginRight: 16 }} />
      ) : (
        <div style={{ width: 32, height: 32, marginRight: 16, background: '#fff2', borderRadius: 4 }} />
      )}
      <span style={{ fontWeight: 'bold', fontSize: 20 }}>{branding.name || 'Your App'}</span>
    </div>
  );
}
