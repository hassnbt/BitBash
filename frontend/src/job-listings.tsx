"use client"

import type React from "react"
import { useState, useRef } from "react"
import "./job-listings.css"

// Mock data for job listings
const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    postedDate: "2023-05-01",
    description:
      "We're looking for a skilled Frontend Developer to join our team. Experience with React and TypeScript required.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    postedDate: "2023-05-03",
    description:
      "Join our backend team to build scalable APIs and services. Experience with Node.js and databases required.",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "CreativeMinds",
    location: "New York, NY",
    type: "Contract",
    salary: "$90,000 - $110,000",
    postedDate: "2023-05-05",
    description:
      "Help us create beautiful and intuitive user experiences. Figma and user research experience required.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$70,000 - $90,000",
    postedDate: "2023-05-07",
    description: "Manage our cloud infrastructure and CI/CD pipelines. AWS and Docker experience required.",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCo",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140,000 - $170,000",
    postedDate: "2023-05-10",
    description: "Lead product development from conception to launch. Experience with agile methodologies required.",
  },
]

export default function JobListings() {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
  })
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((job) => (locationFilter ? job.location.includes(locationFilter) : true))
    .filter((job) => (typeFilter ? job.type === typeFilter : true))
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      } else if (sortBy === "salary-high") {
        return Number.parseInt(b.salary.replace(/\D/g, "")) - Number.parseInt(a.salary.replace(/\D/g, ""))
      } else if (sortBy === "salary-low") {
        return Number.parseInt(a.salary.replace(/\D/g, "")) - Number.parseInt(b.salary.replace(/\D/g, ""))
      }
      return 0
    })

  // Add new job
  const handleAddJob = () => {
    const currentDate = new Date().toISOString().split("T")[0]
    const newJobWithId = {
      ...newJob,
      id: jobs.length + 1,
      postedDate: currentDate,
    }
    setJobs([...jobs, newJobWithId])
    setNewJob({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
    })
    setIsAddModalOpen(false)
  }

  // Delete job
  const handleDeleteJob = () => {
    if (jobToDelete !== null) {
      setJobs(jobs.filter((job) => job.id !== jobToDelete))
      setJobToDelete(null)
      setIsDeleteAlertOpen(false)
    }
  }

  // Handle input change for new job form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewJob({ ...newJob, [name]: value })
  }

  // Open delete confirmation
  const openDeleteConfirmation = (id: number) => {
    setJobToDelete(id)
    setIsDeleteAlertOpen(true)
  }

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsAddModalOpen(false)
    }
    if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
      setIsDeleteAlertOpen(false)
    }
  }

  return (
    <div className="job-listings-container">
      {/* Search and filters */}
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div className="filter-options">
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="filter-select">
            <option value="">All locations</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="Chicago">Chicago</option>
            <option value="Austin">Austin</option>
          </select>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
            <option value="">All types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="salary-high">Highest salary</option>
            <option value="salary-low">Lowest salary</option>
          </select>
        </div>
      </div>

      {/* Add job button */}
      <div className="add-job-container">
        <button className="add-job-button" onClick={() => setIsAddModalOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Job
        </button>
      </div>

      {/* Job listings */}
      <div className="job-cards-container">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs-found">
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-content">
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>

                  <div className="job-details">
                    <div className="job-detail">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <span>{job.type}</span>
                    </div>
                    <div className="job-detail">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                    <div className="job-detail">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="job-description">{job.description}</p>
                </div>

                <button className="delete-button" onClick={() => openDeleteConfirmation(job.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="delete-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Add New Job Listing</h2>
              <button className="close-button" onClick={() => setIsAddModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={newJob.title} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input type="text" id="company" name="company" value={newJob.company} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={newJob.location} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select id="type" name="type" value={newJob.type} onChange={handleInputChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. $80,000 - $100,000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleAddJob}>
                Add Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {isDeleteAlertOpen && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="alert-dialog" ref={alertRef}>
            <div className="alert-header">
              <h2>Delete Job Listing</h2>
            </div>
            <div className="alert-body">
              <p>Are you sure you want to delete this job listing? This action cannot be undone.</p>
            </div>
            <div className="alert-footer">
              <button className="cancel-button" onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </button>
              <button className="delete-confirm-button" onClick={handleDeleteJob}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
