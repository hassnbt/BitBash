import React from 'react';
import moment from 'moment';  // Import moment for relative time

const JobCard = ({ job, onDelete }) => {
  const { id, title, company, location, sector, experience, keywords, image_link, link, posted_date } = job;
  
  // Format the posted date using moment
  const formattedDate = moment(posted_date, 'YYYY-MM-DD HH:mm:ss').fromNow();

  return (
    <div className="job-card">
     {image_link && (
  <img
    src={
      image_link.startsWith('http') 
        ? image_link 
        : `http://127.0.0.1:5000${image_link}`
    }
    alt="Job"
    className="job-image"
  />
)}

      <h3>{title}</h3>
      <p>{company}</p>
      <p>{location}</p>
      <p>{sector}</p>
      <p>{experience}</p>
      <p>{keywords}</p>
      <p>{formattedDate}</p>  {/* Show relative date */}

      <button onClick={() => window.open(link, '_blank')}>Open Job</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default JobCard;
