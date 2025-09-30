import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import BrandingBar from './components/BrandingBar';
import BrandingForm from './components/BrandingForm';

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <Router>
      <BrandingBar />
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={setToken} />} />
        <Route path="/signup" element={<SignupForm onSignup={setToken} />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/branding-form"
          element={token ? <BrandingForm token={token} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;