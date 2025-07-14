import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/users';
import { useAuth } from '../contexts/authContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    isStudent: false, 
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const registerResponse = await registerUser(formData);
      
      if (!registerResponse.data || !registerResponse.data.token) {
        throw new Error('Registration failed');
      }

      const loginResult = await login({
        email: formData.email,
        password: formData.password
      });

      if (loginResult.success) {
        toast.success('Account created successfully!', {
          position: "top-center",
          autoClose: 3000,
        });
        navigate('/');
      } else {
        throw new Error(loginResult.error || 'Failed to log in after registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.', {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-neutral-900 dark:to-secondary/10 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-neutral-850/80 backdrop-blur-sm w-full max-w-xl rounded-2xl shadow-shadow2 overflow-hidden"
      >
        <div className="px-8 py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />
          
          <div className="relative">
            <div className="text-center mb-10">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold "
              >
                Create your account
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-gray-600 dark:text-gray-400"
              >
                Join our community today
              </motion.p>
            </div>

            <motion.form 
              className="space-y-6 relative"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Emri"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input
                    name="surname"
                    type="text"
                    placeholder="Mbiemri"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isStudent"
                  id="isStudent"
                  checked={formData.isStudent}
                  onChange={(e) => setFormData({ ...formData, isStudent: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isStudent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Register as a Student
                </label>
              </div>

              <motion.button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-secondary font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
