"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGraduationCap, FaStar, FaLinkedin, FaTrophy, FaQuoteLeft, FaAward, FaCalendarAlt, FaDownload, FaUserGraduate } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getAllFeaturedStudents, getTopPerformingStudents, getStudentCV } from "../api/featuredStudents"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { getStudentTrainingReviews } from '../api/training';

interface TrainingReview {
  id: number;
  content: string;
  rating: number;
  training: {
    title: string;
    category: string;
    level: string;
  };
}

interface FeaturedStudent {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber?: string
  courseType: 'INFORMATION_SCIENCE' | 'AGROBUSINESS' | 'ACCOUNTING' | 'MARKETING'
  score: number
  imagePath?: string
  description: string
  achievements: string[]
  graduationDate: Date
  linkedinUrl?: string
  testimonial?: string
  isActive?: boolean
  cvPath?: string  // Only keep this
  studentProfileId?: number;
  trainingReviews?: TrainingReview[];
}

const FeaturedStudents = () => {
  const [students, setStudents] = useState<FeaturedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<FeaturedStudent | null>(null)

  const courseTypes = [
    { id: "all", label: "Të Gjithë" },
    { id: "INFORMATION_SCIENCE", label: "Teknologji Informacioni" },
    { id: "AGROBUSINESS", label: "Agrobiznes" },
    { id: "ACCOUNTING", label: "Kontabilitet" },
    { id: "MARKETING", label: "Marketing" }
  ]

  const fetchStudentReviews = async (student: FeaturedStudent) => {
    if (!student.studentProfileId) return student;
    
    try {
      const reviews = await getStudentTrainingReviews(student.studentProfileId);
      return {
        ...student,
        trainingReviews: reviews.message
      };
    } catch (error) {
      console.error(`Error fetching reviews for student ${student.id}:`, error);
      return student;
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await getAllFeaturedStudents()
        if (response.data) {
          // Fetch reviews for each student
          const studentsWithReviews = await Promise.all(
            response.data.map(fetchStudentReviews)
          );
          setStudents(studentsWithReviews);
        }
      } catch (error) {
        console.error("Error fetching featured students:", error)
        toast.error("Failed to load featured students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = activeFilter === "all" 
    ? students 
    : students.filter(student => student.courseType === activeFilter)

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Studentë të Shquar", value: students.length, icon: FaGraduationCap },
    { label: "Nota Mesatare", value: "92%", icon: FaStar },
    { label: "Arritje", value: "150+", icon: FaAward },
    { label: "Shkalla e Suksesit", value: "95%", icon: FaTrophy }
  ]

  const downloadCV = async (cvPath: string, studentName: string) => {
    try {
      if (!cvPath) {
        toast.error('No CV available for this student');
        return;
      }
      
      const response = await fetch(cvPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName.replace(' ', '_')}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };

  const handleCVDownload = async (studentId: string, studentName: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (student?.cvPath) {
        downloadCV(student.cvPath, `${student.name}_${student.surname}`);
      } else {
        toast.error("No CV available for this student");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-secondary/5">
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        className="relative h-[40vh] lg:h-[50vh] overflow-hidden bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0',
            }}
          />
          {/* Add an additional gradient for more visual interest */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)',
              backgroundSize: '100px 100px',
              opacity: 0.1
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
                <FaGraduationCap size={16} />
                <span className="text-sm font-medium">Histori Suksesi</span>
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Studentët Tanë{" "}
              <span className="text-blue-300">të Shquar</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/80 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Njihuni me studentët më të mirë që kanë arritur rezultate të shkëlqyera dhe kanë bërë arritje të jashtëzakonshme përmes programeve tona.
            </motion.p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <stat.icon className="text-secondary" size={24} />
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="text-sm text-gray-600">{stat.label}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {courseTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setActiveFilter(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === type.id
                      ? "bg-secondary text-white shadow-lg ring-2 ring-secondary/20"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" layout>
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={student.imagePath || "/default-student.jpg"}
                    alt={`${student.name} ${student.surname}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-xs bg-white/90 text-secondary px-3 py-1.5 rounded-full font-medium backdrop-blur-sm shadow-lg">
                      {student.courseType.replace(/_/g, " ")}
                    </span>
                  </div>

                  {student.score >= 90 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 bg-yellow-400/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg">
                        <FaTrophy size={12} />
                        <span className="text-xs font-medium">Top Student</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative p-6 z-10">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors duration-500">
                    {student.name} {student.surname}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 mb-4">
                    {student.cvPath ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadCV(student.cvPath!, `${student.name}_${student.surname}`);
                        }}
                        className="flex items-center gap-1.5 text-xs bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 rounded-full transition-colors duration-500"
                      >
                        <FaDownload size={12} />
                        <span>Shkarko CV</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">CV nuk është në dispozicion</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-500 mb-4">
                    <FaCalendarAlt size={12} />
                    <span>Diplomuar në {format(new Date(student.graduationDate), 'MMM yyyy')}</span>
                  </div>

                  {student.testimonial && (
                    <div className="relative mb-4">
                      <FaQuoteLeft className="absolute top-0 left-0 text-secondary/20 group-hover:text-white/20" size={24} />
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 pl-8 line-clamp-3">
                        {student.testimonial}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {student.achievements.slice(0, 2).map((achievement, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-50 text-blue-600 group-hover:bg-white/10 group-hover:text-white px-2 py-1 rounded-full transition-colors duration-500"
                        >
                          {achievement}
                        </span>
                      ))}
                      {student.achievements.length > 2 && (
                        <span className="text-xs text-gray-500 group-hover:text-white/60 transition-colors duration-500">
                          +{student.achievements.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {student.trainingReviews && student.trainingReviews.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 group-hover:text-white/90 mb-2">
                        Training Reviews
                      </h4>
                      <div className="space-y-2">
                        {student.trainingReviews.map((review) => (
                          <div 
                            key={review.id}
                            className="bg-gray-50 group-hover:bg-white/10 rounded-lg p-3 transition-colors duration-500"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="text-xs text-gray-600 group-hover:text-white/80 font-medium">
                                  {review.training.title}
                                </span>
                                <span className="text-xs text-gray-500 group-hover:text-white/60 ml-2">
                                  {review.training.level}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    size={12}
                                    className={`${
                                      i < review.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300 group-hover:text-white/20'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 group-hover:text-white/70 line-clamp-2">
                              {review.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-white/10 transition-colors duration-500">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-yellow-50 group-hover:bg-white/10 text-yellow-600 group-hover:text-yellow-300 px-2 py-1 rounded-full transition-colors duration-500">
                        <FaStar size={12} />
                        <span className="text-sm font-medium">{student.score}</span>
                      </div>
                    </div>
                    {student.linkedinUrl && (
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 group-hover:text-white transition-colors duration-500"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {students.length === 0 && !loading && (
          <motion.div 
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGraduationCap className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Nuk ka ende Studentë të Shquar</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Jemi në proces të prezantimit të studentëve tanë të shkëlqyer. Rikthehuni së shpejti për të njohur studentët tanë të talentuar.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FeaturedStudents