// src/components/NewsArticle.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa'; // Import icons if needed

const NewsArticle = ({ article }) => {
  const imageUrl = `https://iap-m-api.onrender.com${article.imageUrl}`;
  
  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-full'>
    <img
      src={imageUrl}
      alt={article.title}
      className='w-full h-48 object-cover'
    />
    <div className='p-4'>
      <h3 className='text-lg font-semibold mb-2'>{article.title}</h3>
      <p className='text-sm text-gray-600 mb-4'>{article.excerpt}</p>
      <div className='flex items-center text-sm text-gray-500 mb-4'>
        <FaCalendarAlt className='mr-2' />
        <span>{article.date}</span>
        <span className='mx-2'>|</span>
        <FaUser className='mr-2' />
        <span>{article.author}</span>
      </div>
      <Link
        to={`/news/${article.id}`}
        className='text-blue-600 hover:underline'
      >
        Read More
      </Link>
    </div>
  </div>
  );
};

export default NewsArticle;
