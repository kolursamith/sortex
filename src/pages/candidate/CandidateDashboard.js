import React, { useEffect, useState } from 'react';
import api from '../../api';

function CandidateDashboard() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, jobsRes] = await Promise.all([
          api.get('/candidate/companies'),
          api.get('/candidate/jobs'),
        ]);
        setCompanies(companiesRes.data?.companies || []);
        setJobs(jobsRes.data?.jobs || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const apply = async (jobId) => {
    if (!selectedFile) {
      setError('Please select a PDF resume before applying.');
      return;
    }
    setError('');
    setMessage('');
    setApplyingJobId(jobId);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobId', jobId);
      const res = await api.post('/candidate/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data?.message || 'Application submitted!');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to apply');
    } finally {
      setLoading(false);
      setApplyingJobId(null);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Candidate Dashboard</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>Upload Resume (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={onFileChange} />
      </section>

      {error && <div className="error-text">{error}</div>}
      {message && <div className="success-text">{message}</div>}

      <section style={{ marginBottom: 24 }}>
        <h2>Companies</h2>
        <ul>
          {companies.map(c => (
            <li key={c._id}>{c.companyName || c.email}</li>
          ))}
        </ul>
      </section>

      <h2>Available Jobs</h2>
      <div className="job-list">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>Company: {job.company?.companyName || job.company?.email}</p>
            <p>Employees Required: {job.employeesRequired}</p>
            <button onClick={() => apply(job._id)} disabled={loading && applyingJobId === job._id}>
              {loading && applyingJobId === job._id ? 'Applying...' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateDashboard;