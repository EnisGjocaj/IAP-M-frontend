// src/pages/News.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../api/news';
import NewsArticle from '../components/common/NewsArticle';
import bannerImg from '../components/assets/images/iapm-banner.jpg';

export const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    // Fetch all news articles from the API
    const fetchNews = async () => {
      try {
        const response = await getAllNews();
        console.log(response.data);
        // setNewsArticles(response.data);
        if (response.data && Array.isArray(response.data.message)) {
            setNewsArticles(response.data.message);
          } else {
            console.error('Unexpected response format:', response.data);
            setNewsArticles([]); // Fallback to empty array
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          setNewsArticles([]); // Fallback to empty array in case of error
        }
    };

    fetchNews();
  }, []);

  return (
    <section className='news py-4 sm:py-8 md:py-16 bg-gray-100'>
  <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
    {/* Hero Image Section */}
    <div className='mb-4 sm:mb-6 md:mb-8'>
      <img
        src={bannerImg} // Replace with your hero image path
        alt='Hero'
        className='w-full h-40 sm:h-56 md:h-64 object-cover rounded-lg shadow-md'
      />
    </div>

    {/* Headlines Section */}
    <div className='mb-6'>
      <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-800'>Headlines</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {Array.isArray(newsArticles) && newsArticles.length > 0 ? (
              newsArticles.slice(-3).map((article) => (
                <li
                  key={article.id}
                  className='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out border-l-4 border-blue-600'
                >
                  <Link
                    to={`/news/${article.id}`}
                    className='text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 ease-in-out'
                  >
                    {article.title}
                  </Link>
                  <p className='text-xs sm:text-sm text-gray-500 mt-1'>{article.date}</p>
                </li>
              ))
            ) : (
              <p>No news articles available</p>
            )}
      </ul>
    </div>

    {/* Main Content Section */}
    <div className=''>
      {/* Main Content Grid Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
        {Array.isArray(newsArticles) && newsArticles.length > 0 ? (
          newsArticles.map((article) => (
            <NewsArticle key={article.id} article={article} />
          ))
        ) : (
          <p>No news articles to display</p>
        )}
      </div>
    </div>
  </div>
</section>

  );
  
};
