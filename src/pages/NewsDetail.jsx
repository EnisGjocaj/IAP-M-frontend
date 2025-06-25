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
        setNews(response.data.message);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, [id]);

  if (!news) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary'></div>
      </div>
    );
  }

  return (
    <article className='bg-gray-50 min-h-screen'>
      <div className='relative h-[400px] overflow-hidden'>
        <img
          src={news.imageUrl || '/placeholder-image.jpg'}
          alt={news.title}
          className='w-full h-full object-cover'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end'>
          <div className='container mx-auto px-4 pb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>{news.title}</h1>
            <div className='flex items-center text-white/80 space-x-4'>
              <div className='flex items-center'>
                <FaCalendarAlt className='mr-2' />
                <span>{new Date(news.createdAt).toLocaleDateString()}</span>
              </div>
              {news.author && (
                <div className='flex items-center'>
                  <FaUser className='mr-2' />
                  <span>{news.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-card p-8'>
          <div className='prose prose-lg max-w-none'>
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className='text-gray-700 mb-4'>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
