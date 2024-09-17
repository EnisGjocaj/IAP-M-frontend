import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsById } from '../api/news';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

export const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsById(id);
        setNews(response.data.message); // Accessing the correct property
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <section className='news-detail py-16 bg-gray-100'>
      <div className='container mx-auto px-4'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <img
            src={`https://iap-m-api.onrender.com${news.imageUrl}`} // Update the image URL
            alt={news.title}
            className='w-full h-64 object-cover'
          />
          <div className='p-6'>
            <h1 className='text-3xl font-bold mb-4'>{news.title}</h1>
            <p className='text-gray-800 mb-4'>{news.content}</p>
            <div className='flex items-center text-sm text-gray-500'>
              <FaCalendarAlt className='mr-2' />
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
              <span className='mx-2'>|</span>
              <FaUser className='mr-2' />
              <span>{news.author}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
