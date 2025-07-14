import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const LoginPopup = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        onClose();
        toast.success('Logged in successfully!');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 z-[9999]" 
            style={{ 
              position: 'fixed',
              height: '100vh',
              width: '100vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
           
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <motion.div
              className="relative w-full max-w-md mx-4 z-[10000]"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
             
              <div className="bg-white dark:bg-neutral-850 rounded-2xl shadow-shadow2 overflow-hidden">
              
                <motion.button 
                  className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors group z-10"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-800 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                <div className="p-8">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold">
                      <span className="text-primary">Welcome</span>{' '}
                      <span className="text-secondary">Back</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please enter your details
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <motion.button
                        type="submit"
                        className="w-full py-3 px-4 bg-primary text-secondary font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </span>
                        ) : (
                          'Sign In'
                        )}
                      </motion.button>

                      <div className="text-center">
                        <Link
                          to="/signup"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                          onClick={onClose}
                        >
                          Don't have an account?{' '}
                          <span className="font-medium text-primary">Sign up</span>
                        </Link>
                      </div>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};