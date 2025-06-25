import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { createApplication } from '../api/application';
import { toast } from 'react-toastify';
import accountingImage from '../components/assets/images/iap-m.jpg';
import { FaTimes, FaCheckCircle, FaClock, FaGraduationCap, FaUsers } from 'react-icons/fa';

const AccountingModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const applicationData = {
        ...data,
        type: 'ACCOUNTING'
      };
      
      await createApplication(applicationData);
      toast.success('Application submitted successfully!', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        icon: '✅',
      });
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to submit application.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-[500px] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-600 rounded-t-2xl p-6 relative">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
              <div className="text-center">
                <FaGraduationCap className="mx-auto text-white mb-3" size={32} />
                <h2 className="text-xl font-bold text-white">
                  Apply for Accounting Training
                </h2>
                <p className="text-white/80 text-sm mt-1">Fill in your details to start your journey</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Name Fields Row */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    {...register('name', { required: 'Required' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter first name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    {...register('surname', { required: 'Required' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter last name"
                  />
                  {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname.message}</p>}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phoneNumber', {
                      required: 'Required',
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: 'Invalid format'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm"
              >
                Submit Application
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AccountingCTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-6 lg:py-12 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row relative">
           
            <div className="lg:w-2/5 relative overflow-hidden">
              <motion.div
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative h-[200px] sm:h-[250px] lg:min-h-[400px]" 
              >
                <img
                  src={accountingImage}
                  alt="Accounting Training"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </motion.div>

             
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-around gap-1 sm:gap-2">
                {[
                  { icon: FaUsers, text: "Grupe të Vogla" },
                  { icon: FaClock, text: "Intensiv" },
                  { icon: FaCheckCircle, text: "Praktik" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-lg flex items-center gap-1 sm:gap-2 flex-1"
                  >
                    <item.icon className="text-blue-600 hidden sm:block" size={16} />
                    <item.icon className="text-blue-600 sm:hidden" size={12} />
                    <p className="text-[10px] sm:text-xs font-semibold">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            
            <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-[10px] sm:text-xs font-semibold">
                    Vende të Kufizuara
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs font-semibold">
                    Aplikimi i Hapur
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  📣 THIRRJE PËR APLIKIM
                  <span className="block text-blue-600">
                    TRAJNIM NË KONTABILITETIN PRAKTIK
                  </span>
                </h2>

                <p className="text-gray-600 text-sm sm:text-base">
                  Instituti për Aftësim Profesional dhe Menaxhim (IAP-M) shpall vazhdimin e trajnimeve në Kontabilitetin Praktik, të dedikuara për të gjithë ata që dëshirojnë të fitojnë aftësi konkrete dhe të aplikueshme në tregun e punës.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 my-3 sm:my-4">
                  {[
                    'Libërmbajtje praktike',
                    'Përgatitjen e pasqyrave financiare',
                    'TVSH, Tatimi në Paga',
                    'Programe bashkëkohore'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                    >
                      <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                      <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>Apliko Tani</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>
                  
                  <div className="text-center px-3 sm:px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                    <FaClock className="text-blue-500 mx-auto mb-1" size={14} />
                    <p className="text-[10px] sm:text-xs font-medium text-blue-800">Grupe të Vogla</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <AccountingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};