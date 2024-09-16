import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../../api/application';
import { toast } from 'react-toastify';

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
        position: "top-center", // Updated position to string
        autoClose: 5000,
        closeButton: true,
        icon: '✅',
      });
      navigate('/admin/dashboard-applications');
    } catch (error) {
        toast.error('Failed to submit application. Please try again.', {
            position: "top-center", // Updated position to string
            autoClose: 5000,
            closeButton: true,
            });
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formValues.surname}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            name="type"
            value={formValues.type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="INFORMATION_SCIENCE">Information Science</option>
            <option value="AGROBUSINESS">Agrobusiness</option>
            <option value="ACCOUNTING">Accounting</option>
            <option value="MARKETING">Marketing</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          Create Application
        </button>
      </form>
    </div>
  );
};

export default CreateApplicationForm;
