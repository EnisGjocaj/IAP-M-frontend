import React from "react";
import { motion } from "framer-motion";
import heroImg from "../components/assets/images/hero.png";
import heroImgback from "../components/assets/images/hero-shape-purple.png";
import { FiSearch } from "react-icons/fi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaBookReader, FaGraduationCap, FaUsers } from "react-icons/fa";
import { About } from "./About";
import { Courses } from "./Courses";
import { Instructor } from "./Instructor";
import { Blog } from "./Blog";
import { useAuth } from "../contexts/authContext";

import banner from "../components/assets/images/iapm-banner.jpg";

import { NavLink } from "react-router-dom";

export const Home = () => {

  const { user } = useAuth(); // Get the user from context

  // Check if the user has a name or username "Ardit"
  const isArdit = user && (user.email === 'arditbobi@gmail.com');

  return (
    <>

      {isArdit && (
        <div className="text-center mb-4">
          <NavLink to="/admin" className="px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold text-center">
            Go to Admin page
          </NavLink>
        </div>
      )}
      <HomeContent />
      <About />
      <br />
      <br />
      <br />
      <Courses />
      <Instructor />
      <Blog />
    </>
  );
};
export const HomeContent = () => {
  return (
    <motion.section 
      className='bg-secondary py-16 md:py-20 sm:py-12 min-h-screen flex items-center justify-center'
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className='container mx-auto px-6'>
        {/* Adjust flex direction for responsiveness */}
        <div className='relative flex flex-col md:flex-row items-center justify-center'>
          {/* Left Section - Text and Search */}
          <motion.div 
            className='w-full md:w-1/2 text-slate-300 mb-10 md:mb-0 md:mr-8 z-10'
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-2xl sm:text-3xl md:text-4xl leading-tight text-white font-semibold'>
              Trajnimi dhe certifikimi <br /> i studentëve dhe individëve <br /> për sukses në karrierë.
            </h1>
            <span className='text-sm sm:text-base'>
              Ofrimi i programeve të shkëlqyera <br /> në menaxhim dhe biznes për studentët.
            </span>

            <div className='relative text-gray-600 focus-within:text-gray-400 mt-5'>
              <input 
                type='search' 
                className='py-3 px-4 text-sm bg-white rounded-md pl-10 focus:outline-none w-full' 
                placeholder='Search...' 
                autoComplete='off' 
              />
              <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                <button type='submit' className='p-1 focus:outline-none'>
                  <FiSearch />
                </button>
              </span>
            </div>
            <span className='text-sm sm:text-base block mt-2'>
              Garantojmë që do gjeni atë që kërkoni.
            </span>
          </motion.div>

          {/* Right Section - Images and Buttons */}
          <motion.div 
            className='w-full md:w-1/2 relative flex justify-center items-center z-10'
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <div className='images relative'>
              {/* Background Image */}
              <img 
                src={heroImgback} 
                alt='' 
                className='absolute top-20 left-10 w-72 md:w-64 sm:w-48 md:left-0' 
              />
              {/* Banner Image */}
              <div className='img h-96 md:h-64 sm:h-48'>
                <img 
                  src={banner} 
                  alt='' 
                  className='h-full w-full object-contain relative z-20'
                />
              </div>
            </div>
          </motion.div>

          {/* Animated Buttons */}
          <motion.div 
            className='content absolute inset-0 z-30'
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            {/* Random placement of buttons */}
            <button className='hidden bg-white shadow-md opacity-90 sm:absolute top-20 left-10 md:top-32 md:left-16 p-2 sm:p-1 sm:flex items-center rounded-md z-40'>
              <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-orange-400'>
                <BsFillLightningChargeFill size={20} />
              </div>
              <div className='text  flex flex-col items-start px-4 sm:px-2'>
                <span className='text-sm sm:text-xs text-black'>Urime</span>
                <span className='text-xs sm:text-[10px]'>Kërkesat tuaja do plotsohen</span>
              </div>
            </button>

            <button className='bg-white shadow-md opacity-90 absolute bottom-20 left-20 md:bottom-28 md:left-32 p-2 sm:p-1 flex items-center rounded-md z-40'>
              <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-blue-400'>
                <FaGraduationCap size={20} />
              </div>
              <div className='text flex flex-col items-start px-4 sm:px-2'>
                <span className='text-sm sm:text-xs text-black'>640</span>
                <span className='text-xs sm:text-[10px]'>Studentë të asistuar</span>
              </div>
            </button>

            <button className='bg-white shadow-md opacity-90 absolute top-1/2 right-10 md:right-24 p-2 sm:p-1 flex items-center rounded-md z-40'>
              <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-orange-400'>
                <FaUsers size={20} />
              </div>
              <div className='text flex flex-col items-start px-4 sm:px-2'>
                <span className='text-sm sm:text-xs text-black'>Trajnime të ndryshme</span>
                <span className='text-xs sm:text-[10px]'>E ardhmja është e jone</span>
              </div>
            </button>

            <button className='bg-white shadow-md opacity-90 absolute top-1/4 right-1/4 p-2 sm:p-1 flex items-center rounded-md z-40'>
              <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-indigo-400'>
                <FaBookReader size={20} />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
