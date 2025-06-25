import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/users';
import { useAuth } from '../contexts/authContext';

import { toast } from 'react-toastify'; 

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData); 

      
      toast.success('You are registered.', {
        position: "top-center", 
        autoClose: 5000,
        closeButton: true,
        icon: '✅',
      });

      login(response.data.token, response.data.user); 
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error);

      
      toast.error('Failed to submit. Please try again.', {
        position: "top-center", 
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="First Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="surname"
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border rounded"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
