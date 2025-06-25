import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, updateUser, getUserById } from '../../api/manageUsers';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const CreateUserForm = () => {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const isEditMode = !!id;
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
        password: '', 
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
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaUserShield className="w-6 h-6" />
            {isEditMode ? 'Edit User Account' : 'Create User Account'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-blue-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
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
                    <FaUser className="text-gray-400" />
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
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaLock className="w-4 h-4 text-purple-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder={isEditMode ? 'Enter new password' : 'Enter password'}
                  {...(!isEditMode && { required: true })}
                />
              </div>
              {isEditMode && (
                <p className="mt-2 text-sm text-gray-500">
                  Only fill this if you want to change the current password
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            {isEditMode ? 'Update User Account' : 'Create User Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;