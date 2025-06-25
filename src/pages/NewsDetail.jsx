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

        // Format the description properly
        const formattedDescription = newsData.content
          .split('\n')
          .filter(line => line.trim())
          .slice(0, 3)
          .join(' ');

        // Ensure image URL is absolute
        const fullImageUrl = newsData.imageUrl.startsWith('http') 
          ? newsData.imageUrl 
          : `https://iap-m.com${newsData.imageUrl}`;

        // Update meta tags
        document.querySelector('meta[property="og:type"]').setAttribute('content', 'article');
        document.querySelector('meta[property="og:title"]').setAttribute('content', newsData.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', formattedDescription);
        document.querySelector('meta[property="og:image"]').setAttribute('content', fullImageUrl);
        document.querySelector('meta[property="og:url"]').setAttribute('content', `https://iap-m.com/news/${id}`);

      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();

    // Cleanup function
    return () => {
      // Reset meta tags to defaults with new domain
      document.querySelector('meta[property="og:title"]').setAttribute('content', 'IAP-M News');
      document.querySelector('meta[property="og:description"]').setAttribute('content', 'Latest news from IAP-M');
      document.querySelector('meta[property="og:image"]').setAttribute('content', `https://iap-m.com/iapm-banner.jpg`);
      document.querySelector('meta[property="og:url"]').setAttribute('content', 'https://iap-m.com');
    };
  }, [id]);

  if (!news) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600'></div>
      </div>
    );
  }

  const formattedDescription = news.content
    .split('\n')
    .filter(line => line.trim()) // Remove empty lines
    .slice(0, 3)  // Take first 3 paragraphs
    .join('\n\n'); // Join with double newline for better formatting

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-gray-50 min-h-screen relative'
    >
      {/* Hero Section with Image */}
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
        
        {/* Navigation and Share Buttons */}
        <div className='absolute top-0 left-0 right-0 p-6 flex justify-between items-center'>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => window.history.back()}
            className='flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all'
          >
            <FaArrowLeft size={16} />
            <span className='text-sm font-medium'>Kthehu</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowShareModal(!showShareModal)}
            className='text-white bg-black/20 hover:bg-black/40 p-3 rounded-full backdrop-blur-sm transition-all'
          >
            <FaShare size={18} />
          </motion.button>
        </div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 right-6 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-white/90"
            >
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={formattedDescription}
                imageUrl={news.imageUrl.startsWith('http') ? news.imageUrl : `https://iap-m.com${news.imageUrl}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title and Meta Info */}
        <div className='absolute bottom-0 left-0 right-0 p-8 lg:p-12'>
          <div className='container mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className='text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'>
                {news.title}
              </h1>
              <div className='flex flex-wrap items-center text-white/90 space-x-6 text-sm'>
                <div className='flex items-center bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm'>
                  <FaCalendarAlt className='mr-2 text-blue-400' size={14} />
                  <span>{new Date(news.createdAt).toLocaleDateString('sq-AL', {
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='container mx-auto px-4 py-12'
      >
        <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 lg:p-12 relative -mt-20'>
          {/* Desktop Share Section - Now at the top of content */}
          <div className="hidden lg:block mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Share This Article</h3>
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={formattedDescription}
                imageUrl={news.imageUrl.startsWith('http') ? news.imageUrl : `https://iap-m.com${news.imageUrl}`}
              />
            </div>
          </div>

          {/* Article Content */}
          <div className='prose prose-lg max-w-none'>
            {news.content.split('\n').map((paragraph, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className='text-gray-700 mb-6 leading-relaxed'
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Mobile Share Section */}
          <div className="mt-12 lg:hidden">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Share This Article</h3>
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={formattedDescription}
                imageUrl={news.imageUrl.startsWith('http') ? news.imageUrl : `https://iap-m.com${news.imageUrl}`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};
