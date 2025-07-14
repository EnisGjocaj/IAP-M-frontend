"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaBook, FaClock, FaUsers, FaStar, FaEye } from "react-icons/fa"

const courses = [
  {
    id: 1,
    title: "Kontabilitet Profesional",
    cover: "/accounting-banner.webp",
    category: "Kontabilitet",
    subCategory: "Profesional",
    lessons: 24,
    duration: "6 javë", 
    students: 156,
    rating: 4.8,
    reviews: 89,
    level: "Fillestar",
    description: "Mësoni bazat e kontabilitetit me praktika dhe shembuj nga bota reale.",
    previewIcon: "/iap-m-logo.jpg" 
  },
  {
    id: 2,
    title: "Zhvillim i Web Aplikacioneve",
    cover: "/web-banner.jpg",
    category: "Programim",
    subCategory: "Web Development",
    lessons: 24,
    duration: "6 javë",
    students: 203,
    rating: 4.9,
    reviews: 124,
    level: "Mesatar",
    description: "Ndërtoni aplikacione moderne duke përdorur teknologjitë më të fundit.",
    previewIcon: "/iap-m-logo.jpg"
  },
  {
    id: 3,
    title: "Marketing Dixhital",
    cover: "/marketing-banner.webp",
    category: "Marketing",
    subCategory: "Dixhital",
    lessons: 24,
    duration: "6 javë",
    students: 178,
    rating: 4.7,
    reviews: 95,
    level: "Fillestar",
    description: "Mësoni strategjitë moderne të marketingut dixhital dhe mediave sociale.",
    previewIcon: "/iap-m-logo.jpg"
  },
  {
    id: 4,
    title: "Menaxhim i Agrobiznesit Modern",
    cover: "/agrobusiness-banner.webp",
    category: "Agrobiznes",
    subCategory: "Menaxhim",
    lessons: 24,
    duration: "6 javë",
    students: 89,
    rating: 4.6,
    reviews: 67,
    level: "Avancuar",
    description: "Mësoni praktikat e qëndrueshme të bujqësisë dhe strategjitë moderne të biznesit bujqësor.",
    previewIcon: "/iap-m-logo.jpg"
  },
]

const categories = ["Të Gjitha", "Kontabilitet", "Programim", "Marketing", "Agrobiznes"]
const levels = ["Të Gjitha Nivelet", "Fillestar", "Mesatar", "Avancuar"]

export const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("Të Gjitha")
  const [selectedLevel, setSelectedLevel] = useState("Të Gjitha Nivelet")

  const filteredCourses = courses.filter((course) => {
    const categoryMatch = selectedCategory === "Të Gjitha" || course.category === selectedCategory
    const levelMatch = selectedLevel === "Të Gjitha Nivelet" || course.level === selectedLevel
    return categoryMatch && levelMatch
  })

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center rounded-full px-4 py-2 mb-6 bg-secondary/10 text-secondary ring-1 ring-secondary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaBook className="mr-2" size={16} />
            <span className="text-sm font-semibold">Kurset Tona</span>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Zgjidhni drejtimin{" "}
            <span className="bg-gradient-to-r from-secondary to-blue-600 bg-clip-text text-transparent">
              e duhur
            </span>{" "}
            për ju
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Zgjidhni nga një gamë e gjerë kursesh profesionale të dizajnuara për të avancuar karrierën tuaj
          </p>
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-secondary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <div className="text-sm text-gray-600">
                {filteredCourses.length} kurs{filteredCourses.length !== 1 ? "e" : ""}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" layout>
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute -bottom-10 right-4 group-hover:bottom-4 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={course.previewIcon} 
                        alt={`${course.category} icon`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs bg-secondary/90 text-white px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                      {course.category}
                    </span>
                    <span className="text-xs bg-primary/90 text-secondary px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                        <FaBook size={12} className="text-secondary" />
                        <span className="text-sm text-gray-600">{course.lessons} leksione</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                        <FaClock size={12} className="text-secondary" />
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <FaUsers size={14} />
                        <span className="text-sm">{course.students} studentë</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaStar size={14} className="text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.reviews})</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                    <FaEye size={14} />
                    Shiko Detajet
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

