// src/components/NewsArticle.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa'; // Import icons if needed

const NewsArticle = ({ article }) => {
  const imageUrl = `http://localhost:4000${article.imageUrl}`;
  
  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden max-w-full sm:max-w-md lg:max-w-lg mx-auto'>
      <img
        src={imageUrl}
        alt={article.title}
        className='w-full h-40 sm:h-48 lg:h-56 object-cover'
      />
      <div className='p-4'>
        <h3 className='text-base sm:text-lg lg:text-xl font-semibold mb-2'>{article.title}</h3>
        <p className='text-sm sm:text-base lg:text-lg text-gray-600 mb-4'>{article.excerpt}</p>
        <div className='flex items-center text-xs sm:text-sm lg:text-base text-gray-500 mb-4'>
          <FaCalendarAlt className='mr-1 sm:mr-2 lg:mr-3' />
          <span>{article.date}</span>
          <span className='mx-1 sm:mx-2 lg:mx-3'>|</span>
          <FaUser className='mr-1 sm:mr-2 lg:mr-3' />
          <span>{article.author}</span>
        </div>
        <Link
          to={`/news/${article.id}`}
          className='text-blue-600 hover:underline text-sm sm:text-base lg:text-lg'
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default NewsArticle;
