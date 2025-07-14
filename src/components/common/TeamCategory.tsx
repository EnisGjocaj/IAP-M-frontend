

"use client"

import type React from "react"
import { motion } from "framer-motion"
import TeamMemberCard from "./TeamMemberCard"

interface TeamCategoryProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  members: any[]
  highlight?: boolean
  color?: string
}

const TeamCategory: React.FC<TeamCategoryProps> = ({
  title,
  subtitle,
  icon,
  members,
  highlight = false,
  color = "from-secondary to-blue-600",
}) => {
  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
     
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
        <motion.div
          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${color} text-white shadow-sm`}
          whileHover={{ scale: 1.05 }}
        >
          {icon}
        </motion.div>

        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
        </div>

        <div className="text-right">
          <div className={`text-base sm:text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {members.length}
          </div>
          <div className="text-xs text-gray-500">{members.length === 1 ? "Member" : "Members"}</div>
        </div>
      </div>

      
      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <TeamMemberCard {...member} color={color} compact />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default TeamCategory

