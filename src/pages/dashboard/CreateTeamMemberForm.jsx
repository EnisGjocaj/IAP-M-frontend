import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createTeamMember , getTeamMemberById, updateTeamMember} from '../../api/teamMembers'; // Adjust import path
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useParams } from 'react-router-dom';

const CreateTeamMemberForm = () => {
    const [formValues, setFormValues] = useState({
      fullName: '',
      role: '',
      description: '',
      title: '',
      imgSrc: '', // For previewing the image
      email: '',
      phoneNumber: '',
      linkedinUrl: '',
      twitterUrl: '',
      facebookUrl: '',
    });
    const [cvFile, setCvFile] = useState(null);

    const [imageFile, setImageFile] = useState(null); // Store the selected image file
    const [loading, setLoading] = useState(true); // To manage loading state
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL
  
    useEffect(() => {
        if (id) { // Checks if we are in edit mode
          const fetchTeamMember = async () => {
            try {
              const response = await getTeamMemberById(id);
              console.log("responseee", response.data)
              const member = response.data;
              setFormValues({
                fullName: member.fullName || '',
                role: member.role || '',
                description: member.description || '',
                title: member.title || '',
                imgSrc: member.imgSrc || '', // Set existing image URL
                email: member.email || '',
                phoneNumber: member.phoneNumber || '',
              });
              setLoading(false);
            } catch (error) {
              console.error('Error fetching team member:', error);
              toast.error('Failed to fetch team member details. Please try again.');
            }
          };
      
          fetchTeamMember();
        } else {
          setLoading(false); // No ID, so no need to load existing data
        }
      }, [id]);
      
      const handleCvUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCvFile(file);
        } else {
            toast.error('Please upload a PDF file for CV');
        }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      setImageFile(file); // Set the selected image file
      setFormValues((prevValues) => ({
        ...prevValues,
        imgSrc: URL.createObjectURL(file), // Set the preview image URL
      }));
    };
  
    const handleRemoveImage = () => {
      setImageFile(null); // Clear the image file
      setFormValues((prevValues) => ({
        ...prevValues,
        imgSrc: '', // Clear the preview image URL
      }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append('email', formValues.email);
        formData.append('phoneNumber', formValues.phoneNumber);
        formData.append('fullName', formValues.fullName);
        formData.append('role', formValues.role);
        formData.append('description', formValues.description);
        formData.append('title', formValues.title);
      
        if (imageFile) {
          formData.append('image', imageFile); // Append the image file
        }

        if (cvFile) {
          formData.append('cv', cvFile);
        }

        if (formValues.linkedinUrl) formData.append('linkedinUrl', formValues.linkedinUrl);
        if (formValues.twitterUrl) formData.append('twitterUrl', formValues.twitterUrl);
        if (formValues.facebookUrl) formData.append('facebookUrl', formValues.facebookUrl);
      
        try {
          if (id) {
            // Update the existing team member
            await updateTeamMember(id, formData);
            toast.success('Team member updated successfully!', {
              position: "top-center",
              autoClose: 5000,
              closeButton: true,
              icon: '✅',
            });
          } else {
            // Create a new team member
            await createTeamMember(formData);
            toast.success('Team member created successfully!', {
              position: "top-center",
              autoClose: 5000,
              closeButton: true,
              icon: '✅',
            });
          }
          navigate('/admin/dashboard-team-members'); // Navigate to the team members dashboard after success
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('Failed to save team member. Please try again.', {
            position: "top-center",
            autoClose: 5000,
            closeButton: true,
          });
        }
      };
      
  
    if (loading) {
      return <div>Loading...</div>; // You can replace this with a proper loading spinner
    }
  
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-2xl font-bold text-white">
                        {id ? 'Edit Team Member' : 'Create Team Member'}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Basic Information Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formValues.fullName}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formValues.role}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select a role</option>
                                    <option value="EXECUTIVE_DIRECTOR">Director</option>
                                    <option value="MEETING_COORDINATOR">Coordinator</option>
                                    <option value="BOARD_MEMBER">Board Member</option>
                                    <option value="PRESIDENT">President</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formValues.title}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter title"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="team.member@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formValues.phoneNumber}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formValues.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter description"
                            />
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                <label className="relative cursor-pointer w-full">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        {formValues.imgSrc ? (
                                            <img
                                                src={formValues.imgSrc}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-full shadow-md"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700">
                                            {formValues.imgSrc ? 'Change Image' : 'Upload Image'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            PNG, JPG up to 10MB
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaLinkedin className="text-blue-600" />
                            </span>
                            Social Media Links
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLinkedin className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formValues.linkedinUrl}
                                        onChange={handleChange}
                                        placeholder="Your LinkedIn profile"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaTwitter className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="twitterUrl"
                                        value={formValues.twitterUrl}
                                        onChange={handleChange}
                                        placeholder="Your Twitter profile"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaFacebook className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="facebookUrl"
                                        value={formValues.facebookUrl}
                                        onChange={handleChange}
                                        placeholder="Your Facebook profile"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CV Upload */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <FaFilePdf className="text-red-600" />
                            </span>
                            <h3 className="text-lg font-semibold text-gray-800">CV Upload</h3>
                        </div>
                        <div className="mt-2">
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                <label className="relative cursor-pointer w-full">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FaFilePdf className={`w-8 h-8 ${cvFile ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span className="text-sm font-medium text-gray-700">
                                            {cvFile ? 'CV Selected' : 'Choose CV File'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {cvFile ? cvFile.name : 'PDF format only'}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleCvUpload}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                            {cvFile && (
                                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FaFilePdf className="text-green-500" />
                                        <span className="text-sm text-green-700 font-medium">{cvFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCvFile(null)}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
  
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        {id ? 'Update Team Member' : 'Create Team Member'}
                    </button>
                </form>
            </div>
        </div>
    );
  };

export default CreateTeamMemberForm;
