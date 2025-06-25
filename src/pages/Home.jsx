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
import { AccountingCTA } from '../components/AccountingCTA';

import banner from "../components/assets/images/iapm-banner.jpg";

import { NavLink } from "react-router-dom";

export const Home = () => {

  const { user } = useAuth(); 

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
      <AccountingCTA />
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
      className='bg-secondary py-16 md:py-20 sm:py-12 min-h-screen flex items-center justify-center relative overflow-visible'
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className='container mx-auto px-6 relative'>
        <div className='flex flex-col md:flex-row items-center justify-center'>
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

          <motion.div 
            className='w-full md:w-1/2 relative flex justify-center items-center z-10'
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <div className='images relative'>
              <img 
                src={heroImgback} 
                alt='' 
                className='absolute top-20 left-10 w-72 md:w-64 sm:w-48 md:left-0' 
              />
              <div className='img h-96 md:h-64 sm:h-48'>
                <img 
                  src={banner} 
                  alt='' 
                  className='h-full w-full object-contain relative z-20'
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className='absolute inset-0 -left-4 -right-4 -top-4 -bottom-4 pointer-events-none'>
          <button className='pointer-events-auto hidden bg-white shadow-md hover:shadow-lg opacity-90 sm:absolute -top-6 -left-6 p-2 sm:flex items-center rounded-md transform hover:-translate-y-1 transition-all duration-200'>
            <div className='icon w-8 h-8 sm:w-7 sm:h-7 text-white rounded-full flex items-center justify-center bg-orange-400'>
              <BsFillLightningChargeFill size={14} />
            </div>
            <div className='text flex flex-col items-start px-2'>
              <span className='text-xs font-medium text-black'>Urime</span>
              <span className='text-[10px] text-gray-600'>Kërkesat tuaja</span>
            </div>
          </button>

          <button className='pointer-events-auto bg-white shadow-md hover:shadow-lg opacity-90 absolute -bottom-6 -left-4 p-2 flex items-center rounded-md transform hover:-translate-y-1 transition-all duration-200'>
            <div className='icon w-8 h-8 sm:w-7 sm:h-7 text-white rounded-full flex items-center justify-center bg-blue-400'>
              <FaGraduationCap size={14} />
            </div>
            <div className='text flex flex-col items-start px-2'>
              <span className='text-xs font-medium text-black'>640</span>
              <span className='text-[10px] text-gray-600'>Studentë</span>
            </div>
          </button>

          <button className='pointer-events-auto bg-white shadow-md hover:shadow-lg opacity-90 absolute top-1/2 -translate-y-1/2 -right-8 p-2 flex items-center rounded-md transform hover:-translate-x-1 transition-all duration-200'>
            <div className='icon w-8 h-8 sm:w-7 sm:h-7 text-white rounded-full flex items-center justify-center bg-orange-400'>
              <FaUsers size={14} />
            </div>
            <div className='text flex flex-col items-start px-2'>
              <span className='text-xs font-medium text-black'>Trajnime</span>
              <span className='text-[10px] text-gray-600'>E ardhmja</span>
            </div>
          </button>

          <button className='pointer-events-auto bg-white shadow-md hover:shadow-lg opacity-90 absolute -top-4 -right-6 p-2 flex items-center rounded-md transform hover:-translate-y-1 transition-all duration-200'>
            <div className='icon w-8 h-8 sm:w-7 sm:h-7 text-white rounded-full flex items-center justify-center bg-indigo-400'>
              <FaBookReader size={14} />
            </div>
            <div className='text flex flex-col items-start px-2'>
              <span className='text-xs font-medium text-black'>Mëso</span>
              <span className='text-[10px] text-gray-600'>Edukimi</span>
            </div>
          </button>
        </div>
      </div>
    </motion.section>
  );
};
