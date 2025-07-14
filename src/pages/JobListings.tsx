import React, { useState, useEffect, useMemo } from 'react';
import { getAllJobListings, JobListing, JobType, SortBy } from '../api/jobListing';
import { Search, Briefcase, MapPin, Clock, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const JobListings: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>('recent');

  const fetchJobListings = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllJobListings({
        page,
        limit: 3,
        search: searchTerm,
        type: selectedType === 'all' ? undefined : selectedType as JobType,
        location: selectedLocation || undefined,
        sortBy
      });

      if (response?.data) {
        setJobListings(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
      toast.error('Failed to fetch job listings');
      setJobListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
    fetchJobListings(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchJobListings(currentPage);
  }, [currentPage, selectedType, selectedLocation, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchJobListings(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          } rounded-md`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-lg opacity-90 mb-8">Discover the latest opportunities at IAPM</p>
          
          <div className="bg-white rounded-lg p-4 shadow-lg flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-500 bg-white"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <select
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as JobType | 'all');
                  setCurrentPage(1);
                  fetchJobListings(1);
                }}
              >
                <option value="all">All Types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              
              <select
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                  fetchJobListings(1);
                }}
              >
                <option value="">All Locations</option>
                <option value="Prishtinë">Prishtinë</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Available Positions {!loading && `(${jobListings.length})`}
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" />
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1 border border-gray-200 rounded-md text-gray-700 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="salaryHighToLow">Salary: High to Low</option>
              <option value="salaryLowToHigh">Salary: Low to High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : jobListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No job listings found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(job.posted).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.map((req, index) => (
                        <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 mb-2">{job.salary}</div>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                      {job.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => window.location.href = `/apply/${job.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobListings.length > 0 && renderPagination()}
      </div>
    </div>
  );
};

export default JobListings;