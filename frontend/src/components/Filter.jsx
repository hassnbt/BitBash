import React from 'react';

const Filter = ({ searchLocation, setSearchLocation, setSortOrder }) => {
  
  return (
    <div className="filter">
      <input
        type="text"
        placeholder="Search Location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
      <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
};

export default Filter;
