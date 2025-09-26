import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api';

function HRDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [keywords, setKeywords] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const backendBase = useMemo(() => {
    // api baseURL is http://localhost:5000/api => remove trailing /api
    const base = (api?.defaults?.baseURL || '').replace(/\/?api\/?$/, '');
    return base || 'http://localhost:5000';
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/hr/jobs');
      setJobs(res.data?.jobs || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const saveKeywords = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.put(`/hr/jobs/${selectedJobId}/keywords`, { keywords });
      setMessage('Keywords updated');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update keywords');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.get(`/hr/applications/${selectedJobId}`);
      setApplications(res.data?.applications || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const unshortlist = async (applicationId) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.put(`/hr/applications/${applicationId}/unshortlist`);
      setApplications(applications.filter(a => a._id !== applicationId));
      setMessage('Candidate un-shortlisted');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to un-shortlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>HR Dashboard</h1>

      <div className="form-container" style={{maxWidth: '800px', margin: '20px auto'}}>
        <h3>Review Jobs and Shortlisted Candidates</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
            <option value="">Select a job</option>
            {jobs.map(j => (
              <option key={j._id} value={j._id}>{j.title} — {j.company?.companyName || j.company?.email}</option>
            ))}
          </select>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Comma separated keywords (e.g., React, Node.js)"
            style={{ flex: 1 }}
          />
          <button onClick={saveKeywords} disabled={loading || !selectedJobId}>
            {loading ? 'Saving...' : 'Save Keywords'}
          </button>
          <button onClick={fetchApplications} disabled={loading || !selectedJobId}>
            {loading ? 'Fetching...' : 'Fetch Candidates'}
          </button>
        </div>
        {error && <div className="error-text">{error}</div>}
        {message && <div className="success-text">{message}</div>}
      </div>

      <table className="candidate-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td>{app.candidate?.email}</td>
              <td>
                {app.resumePath ? (
                  <a href={`${backendBase}/${app.resumePath}`} target="_blank" rel="noreferrer">View Resume</a>
                ) : '—'}
              </td>
              <td>{app.status}</td>
              <td>
                <button className="btn-delete" onClick={() => unshortlist(app._id)} disabled={loading}>Un-shortlist</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HRDashboard;