import React, { useState } from 'react';
import { loginUser } from '../../api/users';
import { useAuth } from '../../contexts/authContext';
import { motion } from 'framer-motion';

export const LoginPopup = ({ isOpen, onClose }) => {
    const { login } = useAuth(); 
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [loading, setLoading] = useState(false);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await loginUser(formData);
        login(response.data.token, response.data.user);
        onClose(); 
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Invalid credentials');
      } finally {
        setLoading(false);
      }
    };
  
    const backdropVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  
    const popupVariants = {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
    };
  
    if (!isOpen) return null;
  
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.5 }}
        >
          <button className="absolute top-0 right-0 m-4" onClick={onClose}>X</button>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
  };