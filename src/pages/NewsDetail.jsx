import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsById } from '../api/news';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SocialShare from '../components/SocialShare';
import { Carousel } from '../components/ui/carousel';
import { X } from 'lucide-react';
import { Maximize2 } from 'lucide-react'; 

export const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false); 
  const carouselRef = useRef(null);

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

  // Modified helper function to get main image
  const getMainImageDisplay = () => {
    const mainImage = news.images?.find(img => img.isMain)?.url || news.imageUrl;
    
    return (
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7 }}
        src={mainImage || '/placeholder-image.jpg'}
        alt={news.title}
        className='w-full h-full object-cover'
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-image.jpg';
        }}
      />
    );
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    if (carouselRef.current) {
      carouselRef.current.goToSlide(index);
    }
  };

  const handleCarouselClick = (e) => {
    if (
      !e.target.closest('button') &&
      !e.target.closest('.carousel-dots')
    ) {
      toggleFullScreen();
    }
  };

  // Full screeen preview
  const toggleFullScreen = () => {
    setShowFullScreen(prev => !prev);
  };

  const getCurrentImageUrl = () => {
    return news.images?.[currentSlide]?.url || news.imageUrl;
  };

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-gray-50 min-h-screen relative'
    >
      
      <div className='relative h-[40vh] sm:h-[50vh] lg:h-[70vh] overflow-hidden group'>
        {getMainImageDisplay()}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent'></div>
        
        
        <div className='absolute top-0 left-0 right-0 p-4 sm:p-6'>
          <motion.button
            onClick={() => window.history.back()}
            className='flex items-center gap-2 text-white bg-black/20 hover:bg-black/30 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-sm transition-all'
          >
            <FaArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className='text-xs sm:text-sm font-medium'>Kthehu</span>
          </motion.button>
        </div>

        
        <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12'>
          <div className='container mx-auto max-w-4xl'>
            <div className='space-y-3 sm:space-y-6'>
              <h1 className='text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight'>
                {news.title}
              </h1>
              <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-white/90'>
                <div className='flex items-center gap-2 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm'>
                  <FaCalendarAlt className='text-secondary h-3 w-3 sm:h-4 sm:w-4' />
                  <span>{new Date(news.createdAt).toLocaleDateString('sq-AL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className='container mx-auto px-2 sm:px-4 py-6 sm:py-12'>
        <div className='w-full sm:max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl 
          p-3 sm:p-8 lg:p-12 
          relative 
          -mt-10 sm:-mt-20 
          border border-gray-100 
          hover:shadow-2xl 
          transition-all duration-300
          sm:mx-4 md:mx-auto'
        >
          
          <div className="mb-6 sm:mb-8 border-b pb-4 sm:pb-6">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Share This Article</h3>
              <SocialShare
                url={`https://iap-m.com/news/${id}`}
                title={news.title}
                description={news.content}
                imageUrl={news.images?.[0]?.url || news.imageUrl}
                activeImageUrl={getCurrentImageUrl()}
              />
            </div>
          </div>

          
          {news.images && news.images.length > 1 && (
            <div className="mb-8 sm:mb-12 -mx-3 sm:mx-0">
              <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Image Gallery</h3>
                <button
                  onClick={toggleFullScreen}
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 flex items-center gap-1.5 sm:gap-2 transition-colors"
                >
                  <span className="hidden sm:inline">View Fullscreen</span>
                  <span className="sm:hidden">Fullscreen</span>
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              
              <div className="relative rounded-none sm:rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                <div className="aspect-[4/3] sm:aspect-[16/9] relative group">
                  <Carousel 
                    ref={carouselRef}
                    images={news.images}
                    className="w-full h-full"
                    autoPlay={false}
                    showArrows={true}
                    showDots={true}
                    objectFit="contain"
                    onSlideChange={setCurrentSlide}
                    arrowClassName="z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 sm:scale-100"
                    dotsClassName="carousel-dots"
                  />

                  
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium">
                    <span className="text-primary">{currentSlide + 1}</span>
                    <span className="mx-1">/</span>
                    <span>{news.images.length}</span>
                  </div>
                </div>

             
                <div className="bg-gray-50/50 backdrop-blur-sm border-t border-gray-100 p-2 sm:p-4">
                  <div className="grid grid-flow-col auto-cols-max gap-2 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    {news.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`
                          relative rounded-lg overflow-hidden flex-shrink-0
                          transition-all duration-300 transform
                          ${currentSlide === index 
                            ? 'ring-2 ring-primary ring-offset-2 scale-95' 
                            : 'opacity-70 hover:opacity-100 hover:scale-95'
                          }
                        `}
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                          <img 
                            src={image.url} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {currentSlide === index && (
                            <div className="absolute inset-0 bg-primary/10 border-2 border-primary"/>
                          )}
                        </div>
                        
                        <div className={`
                          absolute bottom-1 right-1 
                          ${currentSlide === index 
                            ? 'bg-primary text-white' 
                            : 'bg-black/50 text-white/80'
                          }
                          w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs flex items-center justify-center
                        `}>
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        
          <div className='prose prose-sm sm:prose-base lg:prose-lg max-w-none 
            px-1 sm:px-0' 
          >
            {news.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className='text-gray-700 leading-relaxed mb-4 sm:mb-8 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base'>
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={toggleFullScreen}
          >
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex items-center gap-2 sm:gap-4">
              <span className="text-white/70 text-xs sm:text-sm">
                Image {currentSlide + 1} of {news.images.length}
              </span>
              <button
                onClick={toggleFullScreen}
                className="text-white/50 hover:text-white transition-colors bg-black/20 p-1.5 sm:p-2 rounded-full backdrop-blur-sm"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="w-full h-full max-w-7xl max-h-screen p-2 sm:p-4 lg:p-8" onClick={e => e.stopPropagation()}>
              <Carousel 
                ref={carouselRef}
                images={news.images}
                className="w-full h-full"
                autoPlay={false}
                showArrows={true}
                showDots={true}
                objectFit="contain"
                onSlideChange={setCurrentSlide}
                arrowClassName="z-10 !opacity-100 scale-100 sm:scale-150"
                dotsClassName="carousel-dots"
              />

              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl sm:max-w-3xl px-2 sm:px-4">
                <div className="grid grid-flow-col auto-cols-max gap-2 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar justify-center">
                  {news.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`
                        w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 
                        transition-all duration-300 relative
                        ${currentSlide === index 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' 
                          : 'opacity-50 hover:opacity-100 hover:scale-105'
                        }
                      `}
                    >
                      <img 
                        src={image.url} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentSlide === index && (
                        <div className="absolute inset-0 bg-white/20 border-2 border-white"/>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              imageUrl={news.images?.[0]?.url || news.imageUrl}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
