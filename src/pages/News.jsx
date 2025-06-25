import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../api/news';
import NewsArticle from '../components/common/NewsArticle';
import bannerImg from '../components/assets/images/iapm-banner.jpg';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

export const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);

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
      }
    };
    fetchNews();
  }, []);

  const featuredArticles = newsArticles.slice(-3).reverse();
  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1);

  return (
    <section className='bg-gray-50'>
      <div className='relative h-[400px] overflow-hidden'>
        <img
          src={bannerImg}
          alt='News Banner'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent flex items-center'>
          <div className='container mx-auto px-4'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>Latest News</h1>
            <p className='text-xl text-white/90 max-w-2xl'>Stay updated with the latest news and developments from our organization</p>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 -mt-20 relative z-10'>
        {newsArticles.length > 0 && (
          <div className='mb-16'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl md:text-3xl font-bold text-white'>Featured Stories</h2>
              <Link 
                to="/news/all" 
                className='text-secondary hover:text-blue-700 flex items-center bg-white px-4 py-2 rounded-full shadow-lg transition-all hover:shadow-xl'
              >
                View All 
                <FaArrowRight className='ml-2' />
              </Link>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {mainFeatured && (
                <Link
                  to={`/news/${mainFeatured.id}`}
                  className='group relative h-[500px] overflow-hidden rounded-2xl shadow-xl'
                >
                  <img
                    src={mainFeatured.imageUrl || '/placeholder-image.jpg'}
                    alt={mainFeatured.title}
                    className='w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8'>
                    <div className='flex items-center text-white/80 mb-4'>
                      <FaCalendarAlt className='mr-2' />
                      <span>{new Date(mainFeatured.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className='text-2xl md:text-3xl font-bold text-white mb-3'>{mainFeatured.title}</h3>
                    <p className='text-white/90 line-clamp-2 mb-4'>{mainFeatured.content}</p>
                    <span className='inline-flex items-center text-secondary bg-white px-4 py-2 rounded-full transform transition-transform group-hover:translate-x-2'>
                      Read More <FaArrowRight className='ml-2' />
                    </span>
                  </div>
                </Link>
              )}

              <div className='grid grid-cols-1 gap-6'>
                {secondaryFeatured.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    className='group bg-white rounded-xl p-6 shadow-card hover:shadow-xl transition-all duration-300 flex gap-6'
                  >
                    <div className='w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg'>
                      <img
                        src={article.imageUrl || '/placeholder-image.jpg'}
                        alt={article.title}
                        className='w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center text-gray-500 text-sm mb-2'>
                        <FaCalendarAlt className='mr-2' />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className='text-xl font-semibold text-neutral-850 mb-2 group-hover:text-secondary transition-colors'>
                        {article.title}
                      </h3>
                      <p className='text-gray-600 line-clamp-2'>{article.content}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className='border-t border-gray-200 pt-16'>
          <h2 className='text-2xl md:text-3xl font-bold text-neutral-850 mb-8'>All News</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {newsArticles.map((article) => (
              <NewsArticle key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
