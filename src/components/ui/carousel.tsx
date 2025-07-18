import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  images: Array<{ url: string }>;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // Add this prop
  arrowClassName?: string;
  dotsClassName?: string;
  onSlideChange?: (index: number) => void;
}

export const Carousel = React.forwardRef<
  { goToSlide: (index: number) => void },
  CarouselProps
>(({
  images,
  autoPlay = true,
  interval = 5000,
  className,
  showArrows = true,
  showDots = true,
  objectFit = 'cover',
  onSlideChange,
  arrowClassName = '',
  dotsClassName = '',
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoPlay && !isHovered && images.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, interval, images.length, isHovered]);

  // Update the goToSlide implementation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  // Expose the method via ref
  React.useImperativeHandle(ref, () => ({
    goToSlide
  }));

  const handleArrowClick = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation(); // Prevent click from bubbling to container
    if (direction === 'next') {
      goToSlide((currentIndex + 1) % images.length);
    } else {
      goToSlide((currentIndex - 1 + images.length) % images.length);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="w-full h-full flex items-center justify-center bg-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={images[currentIndex].url}
            alt={`Slide ${currentIndex + 1}`}
            className={cn(
              "max-w-full max-h-full",
              objectFit === 'contain' ? 'object-contain' : 'object-cover'
            )}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </AnimatePresence>

      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={(e) => handleArrowClick(e, 'prev')}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200",
              arrowClassName
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => handleArrowClick(e, 'next')}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200",
              arrowClassName
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className={cn("absolute bottom-4 left-0 right-0 flex justify-center gap-2", dotsClassName)}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                idx === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}); 