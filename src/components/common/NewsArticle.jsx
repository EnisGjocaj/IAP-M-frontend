import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NewsArticle = ({ article }) => {
  const imageUrl = article.imageUrl || '/placeholder-image.jpg';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
    >
      <div className='relative aspect-w-16 aspect-h-9 overflow-hidden'>
        <img
          src={imageUrl}
          alt={article.title}
          className='w-full h-48 sm:h-56 object-cover transform transition-transform duration-300 group-hover:scale-105'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
       
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className='p-4 sm:p-6'>
        <div className='flex items-center text-xs sm:text-sm text-gray-500 mb-3'>
          <span className='flex items-center'>
            <FaCalendarAlt className='mr-2 text-secondary' />
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className='text-lg sm:text-xl font-bold text-neutral-850 mb-2 sm:mb-3 line-clamp-2 group-hover:text-secondary transition-colors duration-300'>
          {article.title}
        </h3>
        <p className='text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 sm:line-clamp-3'>
          {article.content}
        </p>
        <Link
          to={`/news/${article.id}`}
          className='inline-flex items-center text-secondary font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base'
        >
          Read More
          <svg 
            className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default NewsArticle;
