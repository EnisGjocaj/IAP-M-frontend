import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobListings, deleteJobListing, toggleJobListingStatus } from '../../api/jobListing.ts';
import { FaSearch, FaFilter, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DashboardJobListings = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showInactive, setShowInactive] = useState(true); // Start with showing all listings
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      console.log('Fetching job listings with params:', {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: selectedType !== 'all' ? selectedType : undefined,
        location: selectedLocation,
        sortBy,
        includeInactive: showInactive
      });

      const response = await getAllJobListings({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: selectedType !== 'all' ? selectedType : undefined,
        location: selectedLocation,
        sortBy,
        includeInactive: showInactive
      });
      
      console.log('API Response:', response);
      
      if (response?.data) {
        console.log('Number of job listings received:', response.data.length);
        console.log('Active vs Inactive breakdown:', {
          active: response.data.filter(job => job.isActive).length,
          inactive: response.data.filter(job => !job.isActive).length
        });
        setJobListings(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        console.log('No job listings data in response');
        setJobListings([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
      toast.error('Failed to fetch job listings');
      setJobListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobListings();
  }, [currentPage, searchTerm, selectedType, selectedLocation, sortBy, showInactive]);

  const handleToggleStatus = async (id) => {
    try {
      await toggleJobListingStatus(id);
      toast.success('Job listing status updated successfully');
      fetchJobListings(); // Refresh the list after toggle
    } catch (error) {
      console.error('Error toggling job listing status:', error);
      toast.error('Failed to update job listing status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await deleteJobListing(id);
        toast.success('Job listing deleted successfully');
        fetchJobListings(); // Refresh the list after delete
      } catch (error) {
        console.error('Error deleting job listing:', error);
        toast.error('Failed to delete job listing');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/job-listings/edit/${id}`);
  };

  const handleToggleInactive = (e) => {
    const newValue = e.target.checked;
    console.log('Toggle inactive changed to:', newValue);
    setShowInactive(newValue);
    setCurrentPage(1); // Reset to first page when toggling
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-sm text-gray-500">Manage your job opportunities</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/job-listings/create')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create New Job Listing
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search job listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          {/* Show Inactive Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={handleToggleInactive}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-900">Show Inactive Listings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Job Listings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobListings.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(job.id)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        job.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.isActive ? (
                        <>
                          <FaToggleOn className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(job.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardJobListings;
