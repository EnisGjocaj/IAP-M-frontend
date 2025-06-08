// src/components/NewsArticle.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa'; // Import icons if needed

const NewsArticle = ({ article }) => {
  // Use the imageUrl directly from Supabase
  const imageUrl = article.imageUrl || '/placeholder-image.jpg'; // Add a fallback image
  
  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-full'>
      <img
        src={imageUrl}
        alt={article.title}
        className='w-full h-48 object-cover'
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = '/placeholder-image.jpg'; // Fallback image
        }}
      />
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{article.title}</h3>
        <p className='text-sm text-gray-600 mb-4'>
          {article.content.substring(0, 150)}... {/* Show a preview of the content */}
        </p>
        <div className='flex items-center text-sm text-gray-500 mb-4'>
          <FaCalendarAlt className='mr-2' />
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
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
