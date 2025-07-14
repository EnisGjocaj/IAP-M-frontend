"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import TeamCategory from "../components/common/TeamCategory"
import { Briefcase, Users, Award, Crown, Filter } from "lucide-react"
import { getAllTeamMembers } from "../api/teamMembers"

interface TeamMember {
  id: string
  fullName: string
  role: string
  title: string
  description: string
  imagePath: string
  cvPath?: string
  linkedinUrl?: string
  twitterUrl?: string
  email?: string
  phoneNumber?: string
}

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)
        const response = await getAllTeamMembers()
        if (response.data) {
          setTeamMembers(response.data)
        }
      } catch (error) {
        console.error("Error fetching team members:", error)
        toast.error("Failed to load team members")
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  const directors = teamMembers.filter((member) => member.role === "EXECUTIVE_DIRECTOR")
  const coordinators = teamMembers.filter((member) => member.role === "MEETING_COORDINATOR")
  const boardMembers = teamMembers.filter((member) => member.role === "BOARD_MEMBER")
  const presidents = teamMembers.filter((member) => member.role === "PRESIDENT")

  const teamCategories = [
    {
      id: "presidents",
      title: "Executive Leadership",
      subtitle: "Strategic vision and institutional governance",
      icon: <Crown className="w-5 h-5" />,
      members: presidents,
      highlight: true,
      color: "from-primary to-yellow-500",
    },
    {
      id: "directors",
      title: "Board of Directors",
      subtitle: "Operational excellence and strategic oversight",
      icon: <Briefcase className="w-5 h-5" />,
      members: directors,
      highlight: true,
      color: "from-secondary to-blue-700",
    },
    {
      id: "coordinators",
      title: "Program Leadership",
      subtitle: "Academic coordination and program management",
      icon: <Award className="w-5 h-5" />,
      members: coordinators,
      color: "from-slate-600 to-slate-700",
    },
    {
      id: "boardMembers",
      title: "Advisory Board",
      subtitle: "Strategic guidance and institutional support",
      icon: <Users className="w-5 h-5" />,
      members: boardMembers,
      color: "from-gray-600 to-gray-700",
    },
  ]

  const filters = [
    { id: "all", label: "All" },
    { id: "presidents", label: "Leadership" },
    { id: "directors", label: "Directors" },
    { id: "coordinators", label: "Coordinators" },
    { id: "boardMembers", label: "Advisory" },
  ]

  const filteredCategories =
    activeFilter === "all"
      ? teamCategories.filter((cat) => cat.members.length > 0)
      : teamCategories.filter((cat) => cat.id === activeFilter && cat.members.length > 0)

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-secondary/5 to-transparent py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center relative mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative inline-flex mb-3 sm:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-secondary/10 rounded-xl">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              <span className="text-secondary">Ekipi</span> Drejtues
            </h1>
            <motion.p 
              className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Njihuni me profesionistët e dalluar që drejtojnë misionin tonë për ekselencë në arsim
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: "Anëtarë", value: teamMembers.length },
              { label: "Drejtues Ekzekutiv", value: presidents.length },
              { label: "Bordi Drejtues", value: directors.length },
              { label: "Koordinatorë", value: coordinators.length },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -1 }}
              >
                <motion.div
                  className="text-xl font-bold text-secondary mb-0.5"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-start sm:justify-center mb-6 sm:mb-10 overflow-x-auto pb-2 sm:pb-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-100 min-w-max">
            <div className="hidden sm:flex items-center gap-1 px-2 text-gray-500">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtro:</span>
            </div>
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? "bg-secondary text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TeamCategory {...category} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {teamMembers.length === 0 && (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members</h3>
            <p className="text-gray-600">Team information will be available soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TeamSection

