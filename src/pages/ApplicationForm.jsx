import React from 'react';
import { useForm } from 'react-hook-form';
import { createApplication } from '../api/application';

import {ReactTyped} from 'react-typed';
import { toast } from 'react-toastify';

const applicationTypes = [
  { value: 'INFORMATION_SCIENCE', label: 'Information Science' },
  { value: 'AGROBUSINESS', label: 'Agrobusiness' },
  { value: 'ACCOUNTING', label: 'Accounting' },
  { value: 'MARKETING', label: 'Marketing' },
];

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
    <section className='py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto bg-white p-5 sm:p-8 lg:p-10 rounded-lg shadow-lg'>
          <h2 className='text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center text-blue-700'>
            <ReactTyped
              strings={["Study Programming", "Study Agrobusiness", "Study Accounting", "Study Marketing"]}
              typeSpeed={100}
              backSpeed={50}
              loop
            />
          </h2>
          <p className='text-gray-500 text-sm sm:text-base text-center mb-6 sm:mb-8'>
            Fill in your details to apply for our training programs.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-4 sm:space-y-6'>
            <div>
              <label htmlFor='name' className='block text-gray-600 text-sm font-semibold mb-1.5 sm:mb-2'>
                First Name
              </label>
              <input
                id='name'
                type='text'
                {...register('name', { required: 'First name is required' })}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                  errors.name ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm sm:text-base`}
                placeholder="Enter your first name"
              />
              {errors.name && (
                <p className='text-red-500 text-xs sm:text-sm italic mt-1 sm:mt-2'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='surname' className='block text-gray-600 text-sm font-semibold mb-1.5 sm:mb-2'>
                Last Name
              </label>
              <input
                id='surname'
                type='text'
                {...register('surname', { required: 'Last name is required' })}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                  errors.surname ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm sm:text-base`}
                placeholder="Enter your last name"
              />
              {errors.surname && (
                <p className='text-red-500 text-xs sm:text-sm italic mt-1 sm:mt-2'>
                  {errors.surname.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='email' className='block text-gray-600 text-sm font-semibold mb-1.5 sm:mb-2'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm sm:text-base`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className='text-red-500 text-xs sm:text-sm italic mt-1 sm:mt-2'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='phoneNumber' className='block text-gray-600 text-sm font-semibold mb-1.5 sm:mb-2'>
                Phone Number
              </label>
              <input
                id='phoneNumber'
                type='tel'
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Invalid phone number format'
                  }
                })}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                  errors.phoneNumber ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm sm:text-base`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className='text-red-500 text-xs sm:text-sm italic mt-1 sm:mt-2'>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='type' className='block text-gray-600 text-sm font-semibold mb-1.5 sm:mb-2'>
                Training Type
              </label>
              <select
                id='type'
                {...register('type', { required: 'Training type is required' })}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                  errors.type ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm sm:text-base bg-white`}
              >
                <option value=''>Select a training type</option>
                {applicationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className='text-red-500 text-xs sm:text-sm italic mt-1 sm:mt-2'>
                  {errors.type.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition duration-300 ease-in-out text-sm sm:text-base
                mt-6 sm:mt-8 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplicationForm;
