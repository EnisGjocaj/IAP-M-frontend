import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

const NewsArticle = ({ article }) => {
  const imageUrl = article.imageUrl || '/placeholder-image.jpg';
  
  return (
    <div className='group bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
      <div className='aspect-w-16 aspect-h-9 overflow-hidden'>
        <img
          src={imageUrl}
          alt={article.title}
          className='w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-105'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      <div className='p-6'>
        <h3 className='text-xl font-bold text-neutral-850 mb-3 line-clamp-2'>{article.title}</h3>
        <p className='text-gray-600 mb-4 line-clamp-3'>
          {article.content}
        </p>
        <div className='flex items-center justify-between'>
          <div className='flex items-center text-sm text-gray-500'>
            <FaCalendarAlt className='mr-2' />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <Link
            to={`/news/${article.id}`}
            className='inline-flex items-center text-secondary font-semibold hover:text-blue-700 transition-colors'
          >
            Read More
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
