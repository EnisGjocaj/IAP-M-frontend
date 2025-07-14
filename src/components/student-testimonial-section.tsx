"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaQuoteLeft, FaStar, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa"

const testimonials = [
  {
    id: 1,
    name: "Ariana Krasniqi",
    position: "Senior Financial Analyst",
    company: "PwC Kosovo",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    testimonial:
      "IAP-M completely transformed my career. The practical approach and expert guidance gave me the confidence to excel in the financial sector. I went from entry-level to senior analyst in just 18 months!",
    course: "Professional Accounting",
    video: true,
  },
  {
    id: 2,
    name: "Driton Berisha",
    position: "Lead Developer",
    company: "Tech Innovations",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    testimonial:
      "The programming bootcamp at IAP-M was intense but incredibly rewarding. The instructors were industry experts who provided real-world insights that you can't get from books or online tutorials.",
    course: "Full Stack Development",
    video: true,
  },
  {
    id: 3,
    name: "Ema Gashi",
    position: "Creative Director",
    company: "Design Studio Pro",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    testimonial:
      "IAP-M's design program opened doors I never thought possible. The portfolio I built during the course landed me my dream job. The mentorship and feedback were invaluable.",
    course: "Graphic Design Mastery",
    video: false,
  },
]

const StudentTestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="bg-gradient-to-br from-secondary to-blue-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255,215,0,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <motion.div
          className="inline-flex items-center rounded-full px-6 py-3 mb-6 bg-primary/20 text-primary ring-1 ring-primary/30 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <FaQuoteLeft className="mr-3" size={18} />
          <span className="text-lg font-bold">Student Testimonials</span>
        </motion.div>

        <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Students Say</h2>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Real stories from real students who transformed their careers with IAP-M
        </p>
      </div>

      {/* Testimonial Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Student Image */}
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <img
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {currentTestimonial.video && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="text-white ml-1" size={16} />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Testimonial Text */}
              <div className="flex-1 text-center lg:text-left">
                {/* Rating */}
                <motion.div
                  className="flex items-center justify-center lg:justify-start gap-1 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <FaStar className="text-primary" size={20} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FaQuoteLeft className="text-primary/50 mb-4 mx-auto lg:mx-0" size={32} />
                  <p className="text-xl lg:text-2xl leading-relaxed text-blue-100 italic">
                    "{currentTestimonial.testimonial}"
                  </p>
                </motion.div>

                {/* Student Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h4 className="text-2xl font-bold text-white mb-1">{currentTestimonial.name}</h4>
                  <p className="text-primary font-semibold mb-1">{currentTestimonial.position}</p>
                  <p className="text-blue-200 mb-2">{currentTestimonial.company}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    Graduate of {currentTestimonial.course}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary scale-125" : "bg-white/30"
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentTestimonialCarousel
