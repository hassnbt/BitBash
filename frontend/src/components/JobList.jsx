import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Filter from './Filter';
import './JobList.css'; // We'll create this CSS file for the spinner
import JobForm from './JobForm';
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/jobs');
      const jobData = await response.json();

      const cleanedJobs = jobData.map(job => ({
        ...job,
        keywords: job.keywords
          ? job.keywords.split(',').map(k => k.trim()).filter(k => k).join(', ')
          : '',
        sector: job.sector
          ? job.sector.split(',').map(s => s.trim()).filter(s => s).join(', ')
          : '',
        experience: job.experience
          ? job.experience.split(',').map(e => e.trim()).filter(e => e).join(', ')
          : '',
        posted_date: new Date(job.posted_date)
      }));

      setJobs(cleanedJobs);
      setFilteredJobs(cleanedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and interval setup
  useEffect(() => {
    fetchJobs(); // initial fetch
    const interval = setInterval(fetchJobs, 2 * 60 * 1000); // every 2 minutes

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job =>
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
    );

    if (sortOrder === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    }

    setFilteredJobs(filtered);
  }, [searchLocation, sortOrder, jobs]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/jobs/${id}`, {
        method: 'DELETE',
      });
      setFilteredJobs(filteredJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div>
      <Filter
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        setSortOrder={setSortOrder}
      />
<button className="add-job-button" onClick={() => setShowForm(true)}>
  + Add New Job
</button>

{showForm && <JobForm onClose={() => setShowForm(false)} onJobAdded={fetchJobs} />}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onDelete={handleDelete} />
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
