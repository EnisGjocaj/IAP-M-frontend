import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../../api/application';
import { toast } from 'react-toastify';
import { FaUserGraduate, FaEnvelope, FaUserCircle, FaGraduationCap, FaPhone } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const CreateApplicationForm = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    surname: '',
    email: '',
    type: 'INFORMATION_SCIENCE',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createApplication(formValues);
      toast.success('Application submitted successfully! Expect to hear from us soon.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        icon: '✅',
      });
      navigate('/admin/dashboard-applications');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaUserGraduate className="w-6 h-6" />
            Create Application
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserCircle className="w-4 h-4 text-blue-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formValues.surname}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your surname"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaGraduationCap className="w-4 h-4 text-green-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Program Selection</h3>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Select Program</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <select
                  id="type"
                  name="type"
                  value={formValues.type}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="INFORMATION_SCIENCE">Information Science</option>
                  <option value="AGROBUSINESS">Agrobusiness</option>
                  <option value="ACCOUNTING">Accounting</option>
                  <option value="MARKETING">Marketing</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateApplicationForm;
