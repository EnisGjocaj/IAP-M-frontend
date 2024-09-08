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

import banner from "../components/assets/images/iapm-banner.jpg";

export const Home = () => {
  return (
    <>
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
      className='bg-secondary py-10 h-[92vh] md:h-auto sm:h-auto'
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-center md:flex-col'>
          <motion.div 
            className='left w-1/2 md:w-full text-slate-300'
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-3xl sm:text-4xl leading-tight text-white font-semibold'>
              Trajnimi dhe certifikimi <br /> i studentëve dhe individëve <br /> për sukses në karrierë.
            </h1>
            <span className='text-[14px]'>
              Ofrimi i programeve të shkëlqyera <br /> në menaxhim dhe biznes për studentët.
            </span>

            <div className='relative text-gray-600 focus-within:text-gray-400 mt-5'>
              <input 
                type='search' 
                className='py-3 text-sm bg-white rounded-md pl-10 focus:outline-none w-full' 
                placeholder='Search...' 
                autoComplete='off' 
              />
              <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                <button type='submit' className='p-1 focus:outline-none focus:shadow-outline'>
                  <FiSearch />
                </button>
              </span>
            </div>
            <span className='text-[14px]'>
              Garantojme që do gjeni ate qe kerkoni.
            </span>
          </motion.div>

          <motion.div 
            className='right w-1/2 md:w-full relative flex justify-center items-center'
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <div className='images relative'>
              <img 
                src={heroImgback} 
                alt='' 
                className='absolute top-28 left-10 w-96 md:w-64 sm:w-40 md:left-10' 
              />
              <div className='img h-[95vh] w-full md:h-[60vh] sm:h-[40vh]'>
                <img 
                  src={banner} 
                  alt='' 
                  className='block sm:hidden h-full w-full object-contain z-20 relative ' 
                />
              </div>
            </div>
            <motion.div 
              className='content'
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
<button className='bg-white shadow-md absolute top-72 left-0 z-30 p-2 md:top-60 md:left-4 sm:top-56 sm:left-4 sm:p-1 flex items-center rounded-md'>
                <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-orange-400'>
                  <BsFillLightningChargeFill size={20} />
                </div>
                <div className='text flex flex-col items-start px-4 sm:px-2'>
                  <span className='text-sm sm:text-xs text-black'>Urime</span>
                  <span className='text-[12px] sm:text-[10px]'>Kerkesat tuaja do plotsohen</span>
                </div>
              </button>


              <button className='bg-white shadow-md absolute bottom-40 left-48 z-30 p-2 md:bottom-32 md:left-40 sm:bottom-24 sm:left-24 sm:p-1 flex items-center rounded-md pr-8'>
                <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-blue-400'>
                  <FaGraduationCap size={20} />
                </div>
                <div className='text flex flex-col items-start px-4 sm:px-2'>
                  <span className='text-sm sm:text-xs text-black'>640</span>
                  <span className='text-[12px] sm:text-[10px]'>Studente te asistuar</span>
                </div>
              </button>
              <button className='bg-white shadow-md absolute top-80 -right-32 md:top-72 md:right-10 sm:top-56 sm:right-4 z-30 p-2 sm:p-1 flex items-center rounded-md'>
                <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-orange-400'>
                  <FaUsers size={20} />
                </div>
                <div className='text flex flex-col items-start px-4 sm:px-2'>
                  <span className='text-sm sm:text-xs text-black'>Trajnime te ndryshme</span>
                  <span className='text-[12px] sm:text-[10px]'>E ardhmja eshte e jone</span>
                </div>
              </button>
              <button className='bg-white shadow-md absolute top-32 right-32 md:top-24 md:right-24 sm:top-16 sm:right-8 z-30 p-2 sm:p-1 flex items-center rounded-md'>
                <div className='icon w-10 h-10 sm:w-8 sm:h-8 text-white rounded-full flex items-center justify-center bg-indigo-400'>
                  <FaBookReader size={20} />
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

