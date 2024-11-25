import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJobListing, getJobListingById, updateJobListing } from '../../api/jobListing.ts';
import { toast } from 'react-toastify';

const CreateJobListingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: 'IAPM',
    location: '',
    type: 'FULL_TIME',
    salary: '',
    description: '',
    requirements: [''],
  });

  useEffect(() => {
    const fetchJobListing = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getJobListingById(id);
          console.log('Job data received:', response.data); // Debug log
          
          if (response.data && response.data.data) {
            const jobData = response.data.data;
            
            // Ensure requirements is an array
            const requirements = Array.isArray(jobData.requirements) 
              ? jobData.requirements 
              : jobData.requirements ? [jobData.requirements] : [''];

            setFormData({
              title: jobData.title || '',
              company: jobData.company || 'IAPM',
              location: jobData.location || '',
              type: jobData.type || 'FULL_TIME',
              salary: jobData.salary || '',
              description: jobData.description || '',
              requirements: requirements.length > 0 ? requirements : [''],
            });
          } else {
            toast.error('Invalid job data received');
            navigate('/admin/jobs');
          }
        } catch (error) {
          console.error('Error fetching job listing:', error);
          toast.error('Failed to load job listing');
          navigate('/admin/jobs');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobListing();
  }, [id, navigate]);

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ''],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate requirements
      const filteredRequirements = formData.requirements.filter(req => req.trim() !== '');
      if (filteredRequirements.length === 0) {
        toast.error('At least one requirement is needed');
        return;
      }

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }
      if (!formData.location.trim()) {
        toast.error('Location is required');
        return;
      }
      if (!formData.salary.trim()) {
        toast.error('Salary is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Description is required');
        return;
      }

      // Prepare the data
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        type: formData.type,
        salary: formData.salary.trim(),
        description: formData.description.trim(),
        requirements: filteredRequirements,
        isActive: true
      };

      console.log('Submitting job data:', jobData);

      let response;
      if (id) {
        // For update
        response = await updateJobListing(Number(id), jobData);
        console.log('Update response:', response);
        
        if (response?.data?.success) {
          toast.success('Job listing updated successfully');
          // Force reload the dashboard
          await new Promise(resolve => setTimeout(resolve, 1000));
          navigate('/admin/jobs', { replace: true });
        } else {
          throw new Error(response?.data?.message || 'Failed to update job listing');
        }
      } else {
        // For create
        response = await createJobListing(jobData);
        console.log('Create response:', response);
        
        if (response?.data?.success) {
          toast.success('Job listing created successfully');
          navigate('/admin/jobs');
        } else {
          throw new Error(response?.data?.message || 'Failed to create job listing');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to save job listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Job Listing' : 'Create New Job Listing'}
          </h1>
          <p className="text-sm text-gray-500">
            {id ? 'Update the job listing details' : 'Add a new job opportunity to your listings'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Senior Software Developer"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Prishtinë, Kosovo"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="text"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter job description..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter requirement..."
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              >
                Add Requirement
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : id ? 'Update Job Listing' : 'Create Job Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateJobListingForm;
