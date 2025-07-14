import React from "react";
import { motion } from "framer-motion";
import heroImg from "../components/assets/images/hero.png";
import heroImgback from "../components/assets/images/hero-shape-purple.png";
import { FiSearch } from "react-icons/fi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaBookReader, FaGraduationCap, FaUsers, FaArrowRight, FaRegLightbulb, FaCertificate } from "react-icons/fa";
import { About } from "./About";
import { Courses } from "./Courses";
import { Instructor } from "./Instructor";
import { Blog } from "./Blog";
import { useAuth } from "../contexts/authContext";
import { AccountingCTA } from '../components/AccountingCTA';
import { NavLink } from "react-router-dom";

import banner from "../components/assets/images/iapm-banner.jpg";

export const Home = () => {

  const { user } = useAuth(); 


  return (
    <>

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
      className='min-h-[85vh] relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-blue-900'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      
      <div className="absolute inset-0">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-12 sm:pt-20 sm:pb-16'>
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12'>
          
          <motion.div 
            className='flex-1 text-center lg:text-left'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            
            <motion.div 
              className="inline-flex items-center rounded-full px-3 py-1 mb-6 bg-blue-500/10 text-blue-200 ring-1 ring-blue-200/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaCertificate className="mr-1.5" size={14} />
              <span className="text-xs font-medium">Trajnime të Certifikuara</span>
            </motion.div>

            
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4'>
              Trajnimi dhe certifikimi 
              <span className="block mt-1 text-blue-300">për sukses në karrierë</span>
            </h1>

            
            <p className='text-base text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0'>
              Ofrimi i programeve të shkëlqyera në menaxhim dhe biznes për studentët.
              <span className="block mt-1">Garantojmë që do gjeni atë që kërkoni.</span>
            </p>

            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <NavLink to="/application">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  Fillo Tani
                  <FaArrowRight className="ml-2" size={12} />
                </motion.button>
              </NavLink>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  document.querySelector('.about').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all border border-white/10"
              >
                Mëso më shumë
              </motion.button>
            </div>

            
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: FaUsers, count: "640+", label: "Studentë" },
                { icon: FaCertificate, count: "98%", label: "Shkalla e punësimit" },
                { icon: FaRegLightbulb, count: "24/7", label: "Mbështetje" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <stat.icon className="text-blue-400 mb-1" size={16} />
                  <span className="text-lg font-bold text-white">{stat.count}</span>
                  <span className="text-[10px] text-gray-300">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          
          <motion.div 
            className='flex-1 relative max-w-md lg:max-w-lg mx-auto'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-20"
              />
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={banner} 
                  alt="IAP-M Training" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
              </div>

              
              {[
                { icon: FaGraduationCap, text: "Trajnime Profesionale", color: "bg-blue-500/80" },
                { icon: FaBookReader, text: "Mëso nga Ekspertët", color: "bg-purple-500/80" },
                { icon: FaUsers, text: "Grupe të Vogla", color: "bg-green-500/80" },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className={`absolute backdrop-blur-[2px] ${
                    index === 0 ? 'top-2 -left-2' :
                    index === 1 ? 'bottom-6 -right-2' :
                    'top-1/2 -left-3'
                  } ${card.color} text-white p-1.5 rounded-md shadow-lg flex items-center gap-1.5 text-xs`}
                >
                  <card.icon size={12} />
                  <span className="font-medium text-[10px]">{card.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
