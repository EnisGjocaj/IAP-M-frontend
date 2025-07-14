import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../api/news';
import NewsArticle from '../components/common/NewsArticle';
import bannerImg from '../components/assets/images/iapm-banner.jpg';
import { FaCalendarAlt, FaArrowRight, FaClock, FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();
        if (response.data && Array.isArray(response.data.message)) {
          setNewsArticles(response.data.message);
        } else {
          setNewsArticles([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featuredArticles = newsArticles.slice(-3).reverse();
  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-gray-50 min-h-screen'
    >
      {/* Responsive Hero Section */}
      <div className='relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden'>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          src={bannerImg}
          alt='News Banner'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent'>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='container mx-auto px-4 h-full flex flex-col justify-center'
          >
            <h1 className='text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6'>
              Latest <span className="text-secondary">News</span>
            </h1>
            <p className='text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed'>
              Stay updated with the latest developments, announcements, and success stories from our community.
            </p>
          </motion.div>
        </div>
      </div>

      <div className='container mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-32 relative z-10 pb-12 sm:pb-24'>
        {newsArticles.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='mb-12 sm:mb-20'
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12'>
              <h2 className='text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0'>
                <FaBookmark className="text-secondary" />
                Featured Stories
              </h2>
              <Link 
                to="/news/all" 
                className='group inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white hover:text-secondary transition-all duration-300'
              >
                View All 
                <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'>
              {mainFeatured && (
                <Link
                  to={`/news/${mainFeatured.id}`}
                  className='group relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform transition-all duration-500 hover:shadow-secondary/20'
                >
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    src={mainFeatured.imageUrl || '/placeholder-image.jpg'}
                    alt={mainFeatured.title}
                    className='w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-10'>
                    <div className='space-y-3 sm:space-y-4'>
                      <div className='flex items-center gap-3 sm:gap-4 text-white/80 text-sm sm:text-base'>
                        <span className='flex items-center gap-2'>
                          <FaCalendarAlt className='text-secondary' />
                          {new Date(mainFeatured.createdAt).toLocaleDateString()}
                        </span>
                        <span className='flex items-center gap-2'>
                          <FaClock className='text-secondary' />
                          5 min read
                        </span>
                      </div>
                      <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-secondary transition-colors duration-300'>
                        {mainFeatured.title}
                      </h3>
                      <p className='text-white/90 line-clamp-2 text-base sm:text-lg'>
                        {mainFeatured.content}
                      </p>
                      <span className='inline-flex items-center gap-2 text-secondary bg-white/10 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-sm sm:text-base'>
                        Read More 
                        <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className='space-y-4 sm:space-y-8'>
                {secondaryFeatured.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    className='group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 flex gap-4 sm:gap-8 transform hover:-translate-y-1'
                  >
                    <div className='w-24 h-24 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl'>
                      <img
                        src={article.imageUrl || '/placeholder-image.jpg'}
                        alt={article.title}
                        className='w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110'
                      />
                    </div>
                    <div className='flex-1 space-y-2 sm:space-y-4'>
                      <div className='flex items-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm'>
                        <span className='flex items-center gap-2'>
                          <FaCalendarAlt className='text-secondary' />
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <span className='flex items-center gap-2'>
                          <FaClock className='text-secondary' />
                          3 min read
                        </span>
                      </div>
                      <h3 className='text-base sm:text-xl font-bold text-gray-900 group-hover:text-secondary transition-colors duration-300'>
                        {article.title}
                      </h3>
                      <p className='text-sm sm:text-base text-gray-600 line-clamp-2'>
                        {article.content}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className='border-t border-gray-200 pt-8 sm:pt-16'
        >
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 flex items-center gap-2 sm:gap-3'>
            <FaBookmark className="text-secondary" />
            All News
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8'>
            {newsArticles.map((article) => (
              <NewsArticle key={article.id} article={article} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
