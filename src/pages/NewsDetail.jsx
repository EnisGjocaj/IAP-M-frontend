import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsById } from '../api/news';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SocialShare from '../components/SocialShare';

export const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsById(id);
        const newsData = response.data.message;
        setNews(newsData);

        updateMetaTags(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();

    return () => {
      document.querySelector('meta[property="og:title"]').setAttribute('content', 'IAP-M News');
      document.querySelector('meta[property="og:description"]').setAttribute('content', 'Latest news from IAP-M');
      document.querySelector('meta[property="og:image"]').setAttribute('content', `https://iap-m.com/iapm-banner.jpg`);
      document.querySelector('meta[property="og:url"]').setAttribute('content', 'https://iap-m.com');
    };
  }, [id]);

  const updateMetaTags = (newsData) => {
    
    const description = newsData.content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .join(' ');

   
    const fullImageUrl = newsData.imageUrl.startsWith('http') 
      ? newsData.imageUrl 
      : `https://iap-m.com${newsData.imageUrl}`;


    document.querySelector('meta[property="og:title"]').setAttribute('content', newsData.title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', fullImageUrl);
    document.querySelector('meta[property="og:url"]').setAttribute('content', `https://iap-m.com/news/${id}`);
    
    // Also update Twitter meta tags
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', newsData.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', fullImageUrl);
  };

  if (!news) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const formattedDescription = news.content
    .split('\n')
    .filter(line => line.trim()) 
    .slice(0, 3)  
    .join('\n\n');

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-gray-50 min-h-screen relative'
    >
      <div className='relative h-[60vh] lg:h-[70vh] overflow-hidden'>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
          src={news.imageUrl || '/placeholder-image.jpg'}
          alt={news.title}
          className='w-full h-full object-cover'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent'></div>
        
        <div className='absolute top-0 left-0 right-0 p-6'>
          <motion.button
            onClick={() => window.history.back()}
            className='flex items-center gap-2 text-white bg-black/20 hover:bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all'
          >
            <FaArrowLeft size={16} />
            <span className='text-sm font-medium'>Kthehu</span>
          </motion.button>
        </div>

        <div className='absolute bottom-0 left-0 right-0 p-8 lg:p-12'>
          <div className='container mx-auto max-w-4xl'>
            <div className='space-y-6'>
              <h1 className='text-3xl lg:text-5xl font-bold text-white leading-tight'>
                {news.title}
              </h1>
              <div className='flex flex-wrap items-center gap-4 text-white/90'>
                <div className='flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm'>
                  <FaCalendarAlt className='text-secondary' size={14} />
                  <span className='text-sm'>{new Date(news.createdAt).toLocaleDateString('sq-AL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                {news.author && (
                  <div className='flex items-center bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm'>
                    <FaUser className='mr-2 text-blue-400' size={14} />
                    <span>{news.author}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative -mt-20 border border-gray-100 hover:shadow-2xl transition-all duration-300'>
          <div className="hidden lg:block mb-8">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share This Article</h3>
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={news.content}
                imageUrl={news.imageUrl}
              />
            </div>
          </div>

          <div className='prose prose-lg max-w-none'>
            {news.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className='text-gray-700 leading-relaxed mb-8 hover:text-gray-900 transition-colors duration-200'>
                  {paragraph}
                </p>
              )
            ))}
          </div>

          <div className="mt-12 lg:hidden">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share This Article</h3>
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={news.content}
                imageUrl={news.imageUrl}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 bg-white rounded-xl shadow-lg p-6 z-50"
          >
            <SocialShare
              url={`https://iap-m.com/news/${id}`}
              title={news.title}
              description={news.content}
              imageUrl={news.imageUrl}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
