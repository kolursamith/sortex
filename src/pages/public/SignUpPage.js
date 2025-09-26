import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Default role is candidate if not selected explicitly
      const payload = { email, password, role };
      if (role === 'company') payload.companyName = companyName;
      await api.post('/auth/signup', payload);
      // On success, go to login page
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create an Account</h2>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="candidate">I am a Job Seeker</option>
          <option value="company">I am a Company</option>
          <option value="hr">I am an HR Professional</option>
        </select>
        {role === 'company' && (
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <div className="error-text">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
}

export default SignUpPage;