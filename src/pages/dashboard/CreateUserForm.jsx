import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, updateUser, getUserById } from '../../api/manageUsers'; // Replace with correct API function import
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useParams } from 'react-router-dom';

const CreateUserForm = () => {
  const { id } = useParams(); // Get user ID from URL
  const [formValues, setFormValues] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const isEditMode = !!id; // Check if we're in edit mode
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [id, isEditMode]);

  const fetchUserData = async () => {
    try {
      const response = await getUserById(id);
      setFormValues({
        name: response.data.name,
        surname: response.data.surname,
        email: response.data.email,
        password: '', // Do not pre-fill the password
      });
    } catch (error) {
      toast.error('Failed to fetch user data.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

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
      if (isEditMode) {
        await updateUser(id, formValues);
        toast.success('User updated successfully.', {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      } else {
        await createUser(formValues);
        toast.success('User created successfully.', {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      }
      navigate('/admin/dashboard-users');
    } catch (error) {
      toast.error('Failed to submit. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Create User'}</h2>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;