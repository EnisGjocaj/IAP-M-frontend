"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTrophy, FaMedal, FaAward, FaStar, FaChartLine, FaGraduationCap, FaCrown, FaFire } from "react-icons/fa"

const leaderboardData = [
  {
    id: 1,
    name: "Ariana Krasniqi",
    course: "Professional Accounting",
    score: 98.5,
    achievements: 12,
    projects: 8,
    rank: 1,
    image: "/placeholder.svg?height=60&width=60",
    badge: "Top Performer",
    streak: 45,
  },
  {
    id: 2,
    name: "Driton Berisha",
    course: "Full Stack Development",
    score: 97.2,
    achievements: 11,
    projects: 15,
    rank: 2,
    image: "/placeholder.svg?height=60&width=60",
    badge: "Code Master",
    streak: 38,
  },
  {
    id: 3,
    name: "Ema Gashi",
    course: "Graphic Design",
    score: 96.8,
    achievements: 10,
    projects: 12,
    rank: 3,
    image: "/placeholder.svg?height=60&width=60",
    badge: "Design Expert",
    streak: 42,
  },
  {
    id: 4,
    name: "Faton Hoxha",
    course: "Agribusiness",
    score: 95.5,
    achievements: 9,
    projects: 6,
    rank: 4,
    image: "/placeholder.svg?height=60&width=60",
    badge: "Innovation Leader",
    streak: 35,
  },
  {
    id: 5,
    name: "Gresa Mustafa",
    course: "Digital Marketing",
    score: 94.7,
    achievements: 8,
    projects: 10,
    rank: 5,
    image: "/placeholder.svg?height=60&width=60",
    badge: "Marketing Pro",
    streak: 28,
  },
]

const StudentLeaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const periods = [
    { id: "weekly", label: "This Week" },
    { id: "monthly", label: "This Month" },
    { id: "yearly", label: "This Year" },
    { id: "alltime", label: "All Time" },
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-500" size={24} />
      case 2:
        return <FaMedal className="text-gray-400" size={20} />
      case 3:
        return <FaAward className="text-amber-600" size={20} />
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {rank}
          </div>
        )
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600"
      case 2:
        return "from-gray-300 to-gray-500"
      case 3:
        return "from-amber-400 to-amber-600"
      default:
        return "from-gray-200 to-gray-300"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-yellow-500 rounded-xl flex items-center justify-center">
            <FaTrophy className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Leaderboard</h2>
            <p className="text-gray-600">Top performing students this period</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedPeriod === period.id ? "bg-white text-secondary shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        <AnimatePresence>
          {leaderboardData.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                student.rank <= 3
                  ? `bg-gradient-to-r ${getRankColor(student.rank)} bg-opacity-10 border-current`
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex-shrink-0">{getRankIcon(student.rank)}</div>

                {/* Student Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <img
                      src={student.image || "/placeholder.svg"}
                      alt={student.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    {student.rank === 1 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <FaCrown className="text-white" size={12} />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : student.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : student.rank === 3
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {student.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{student.course}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{student.score}%</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <FaFire className="text-orange-500" size={14} />
                      <span className="text-lg font-bold text-gray-900">{student.streak}</span>
                    </div>
                    <div className="text-xs text-gray-500">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{student.achievements}</div>
                    <div className="text-xs text-gray-500">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{student.projects}</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{student.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getRankColor(student.rank)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${student.score}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievement Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <FaGraduationCap className="text-blue-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-blue-600">1,200+</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <FaChartLine className="text-green-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-green-600">95.2%</div>
            <div className="text-sm text-gray-600">Avg. Score</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <FaAward className="text-purple-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-purple-600">2,450</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <FaStar className="text-orange-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-orange-600">4.9/5</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLeaderboard
