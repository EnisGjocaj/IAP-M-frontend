import React from 'react';
import { useForm } from 'react-hook-form';
import { createApplication } from '../api/application';
import { motion } from 'framer-motion';
import {ReactTyped} from 'react-typed';
import { toast } from 'react-toastify';

const applicationTypes = [
  { value: 'INFORMATION_SCIENCE', label: 'Information Science' },
  { value: 'AGROBUSINESS', label: 'Agrobusiness' },
  { value: 'ACCOUNTING', label: 'Accounting' },
  { value: 'MARKETING', label: 'Marketing' },
];

const formAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const ApplicationForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await createApplication(data);
      toast.success('Application submitted successfully! Expect to hear from us soon.', {
        position: "top-center", 
        autoClose: 5000,
        closeButton: true,
        icon: '✅',
      });
      reset(); 
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-neutral-900 dark:to-secondary/10 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-neutral-850/80 backdrop-blur-sm w-full max-w-2xl rounded-2xl shadow-shadow2 overflow-hidden"
      >
        <div className="px-8 py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />
          
          <div className="relative">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-primary/10 rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-secondary font-medium">Application Form</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-4"
              >
                <ReactTyped
                  strings={["Study Programming", "Study Agrobusiness", "Study Accounting", "Study Marketing"]}
                  typeSpeed={100}
                  backSpeed={50}
                  loop
                  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Start your journey to success with us
              </motion.p>
            </div>

            <motion.form 
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    {...register('name', { required: 'First name is required' })}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your first name"
                  />
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs italic mt-1"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input
                    {...register('surname', { required: 'Last name is required' })}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your last name"
                  />
                  {errors.surname && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs italic mt-1"
                    >
                      {errors.surname.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs italic mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+1 (234) 567-8900"
                />
                {errors.phoneNumber && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs italic mt-1"
                  >
                    {errors.phoneNumber.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Training Type</label>
                <div className="relative">
                  <select
                    {...register('type', { required: 'Training type is required' })}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select your training program</option>
                    {applicationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                {errors.type && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs italic mt-1"
                  >
                    {errors.type.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-secondary font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Submit Application
              </motion.button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationForm;