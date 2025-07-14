"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Linkedin, Twitter, FileText, Mail, Phone, ExternalLink } from "lucide-react"
import { getImageUrl } from "../../utils/imageUtils"

interface TeamMemberProps {
  id: string
  fullName: string
  role: string
  title: string
  description: string
  imagePath: string
  cvPath?: string
  email?: string
  phoneNumber?: string
  linkedinUrl?: string
  twitterUrl?: string
  color?: string
  compact?: boolean
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  id,
  fullName,
  role,
  title,
  description,
  imagePath,
  cvPath,
  email,
  phoneNumber,
  linkedinUrl,
  twitterUrl,
  color = "from-secondary to-blue-600",
  compact = false,
}) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const socialLinks = [
    { icon: Linkedin, url: linkedinUrl, label: "LinkedIn" },
    { icon: Twitter, url: twitterUrl, label: "Twitter" },
    { icon: FileText, url: cvPath, label: "CV" },
  ].filter((link) => link.url)

  return (
    <motion.div
      className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full"
      whileHover={{ y: -4 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      onClick={() => navigate(`/bord/team/${id}`)}
    >
     
      <div className="relative h-72 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError && imagePath && (
          <motion.img
            src={getImageUrl(imagePath)}
            alt={fullName}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <div className={`px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r ${color} text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm`}>
            {role
              .replace(/_/g, " ")
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
              .replace("Executive Director", "Director")
              .replace("Meeting Coordinator", "Coordinator")
              .replace("Board Member", "Member")}
          </div>
        </div>
      </div>

     
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
        
        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight group-hover:text-secondary transition-colors">
          {fullName}
        </h3>

       
        <p className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {title}
        </p>

      
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {description}
        </p>

       
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-2 sm:mt-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {email && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `mailto:${email}`
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={12} className="sm:w-4 sm:h-4" />
              </motion.button>
            )}
            {phoneNumber && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `tel:${phoneNumber}`
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={12} className="sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>

          <motion.div
            className="text-xs sm:text-sm text-gray-400 group-hover:text-secondary transition-colors flex items-center gap-1 sm:gap-2"
            whileHover={{ x: 2 }}
          >
            View Profile
            <ExternalLink size={10} className="sm:w-3 sm:h-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default TeamMemberCard

