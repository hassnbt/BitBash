import React, { useState } from 'react';
import './JobForm.css'; // Create this for styles

const JobForm = ({ onClose, onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    keywords: '',
    sector: '',
    experience: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/jobs', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        onJobAdded();
        onClose();
      } else {
        alert('Failed to add job');
      }
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  return (
    <div className="job-form-overlay">
      <div className="job-form">
        <h2>Add New Job</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input type="text" name="keywords" placeholder="Keywords (comma-separated)" onChange={handleChange} />
          <input type="text" name="sector" placeholder="Sector (comma-separated)" onChange={handleChange} />
          <input type="text" name="experience" placeholder="Experience (comma-separated)" onChange={handleChange} />
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
