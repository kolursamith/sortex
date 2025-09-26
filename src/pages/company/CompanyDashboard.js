import React, { useEffect, useState } from 'react';
import api from '../../api';

function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [employeesRequired, setEmployeesRequired] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/company/jobs');
      setJobs(res.data?.jobs || []);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/company/jobs', { title, employeesRequired: Number(employeesRequired) });
      setTitle('');
      setEmployeesRequired(1);
      setMessage('Job posted successfully');
      fetchJobs();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Company Dashboard</h1>
      
      <div className="form-container" style={{maxWidth: '600px', margin: '20px auto'}}>
        <form onSubmit={handleAddJob} className="auth-form">
          <h3>Post a New Job</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., UI/UX Designer"
            required
          />
          <input
            type="number"
            value={employeesRequired}
            onChange={(e) => setEmployeesRequired(e.target.value)}
            placeholder="Employees Required"
            min={1}
            required
          />
          {error && <div className="error-text">{error}</div>}
          {message && <div className="success-text">{message}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Add Job Listing'}</button>
        </form>
      </div>

      <h2>Your Job Postings</h2>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>Employees Required: {job.employeesRequired}</p>
            <p>Posted: {new Date(job.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyDashboard;