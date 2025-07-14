"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  FileText,
  Award,
  Briefcase,
  Users,
  MapPin,
  Share2,
  X,
  Facebook,
  Copy,
  Check,
} from "lucide-react"
import { getTeamMemberById } from "../api/teamMembers"
import { getImageUrl } from "../utils/imageUtils"
import SocialShare from '../components/SocialShare';

const TeamMemberProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        setLoading(true)
        const response = await getTeamMemberById(id)
        setMemberData(response.data)
      } catch (error) {
        setError("Failed to fetch team member data")
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMember()
  }, [id])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !memberData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Users className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Anëtari nuk u gjet</h2>
          <p className="text-gray-600 mb-6">{error || "Nuk mund të gjejmë anëtarin e kërkuar."}</p>
          <button
            onClick={() => navigate("/bord")}
            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all"
          >
            Kthehu tek Ekipi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/bord")}
            className="flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kthehu tek Ekipi</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
    
          <div className="h-48 bg-gradient-to-r from-secondary to-secondary/80 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-8 py-8 -mt-20 relative">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <div className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
                    {memberData.imagePath ? (
                      <img
                        src={getImageUrl(memberData.imagePath)}
                        alt={memberData.fullName}
                        className="w-full h-full object-cover object-center"
                        onLoad={() => setImageLoaded(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-blue-600">
                        <span className="text-5xl font-bold text-white">
                          {memberData.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              </div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-6">{memberData.fullName}</h1>
                  <p className="text-gray-600 leading-relaxed mb-8">{memberData.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {memberData.email && (
                      <motion.a
                        href={`mailto:${memberData.email}`}
                        whileHover={{ y: -2 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </motion.a>
                    )}
                    {memberData.phoneNumber && (
                      <motion.a
                        href={`tel:${memberData.phoneNumber}`}
                        whileHover={{ y: -2 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Telefono</span>
                      </motion.a>
                    )}
                    {memberData.linkedinUrl && (
                      <motion.a
                        href={memberData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077B5] text-white rounded-xl hover:bg-[#0077B5]/90 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </motion.a>
                    )}
                    {memberData.cvPath && (
                      <motion.a
                        href={memberData.cvPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Shiko CV</span>
                      </motion.a>
                    )}
                    <motion.button
                      onClick={() => setShowShareModal(true)}
                      whileHover={{ y: -2 }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Ndaj Profilin</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: Award,
              title: "Ekspertiza",
              description: "Ekspertizë në fushën e arsimit dhe zhvillimit akademik",
            },
            {
              icon: Briefcase,
              title: "Përvoja",
              description: "Vite eksperiencë në menaxhim dhe udhëheqje",
            },
            {
              icon: Users,
              title: "Bashkëpunimi",
              description: "Angazhim aktiv në projekte dhe iniciativa arsimore",
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Ndaj Profilin</h3>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <motion.a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
                    >
                      <Facebook className="w-6 h-6 text-[#1877F2]" />
                      <span className="text-xs font-medium text-gray-700">Facebook</span>
                    </motion.a>

                    <motion.a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`${memberData.fullName} - ${memberData.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                    >
                      <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                      <span className="text-xs font-medium text-gray-700">Twitter</span>
                    </motion.a>

                    <motion.a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`${memberData.fullName} - ${memberData.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-colors"
                    >
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                      <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                    </motion.a>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={window.location.href}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className={`p-2 rounded-lg ${
                          copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {memberData.imagePath && (
                        <img
                          src={getImageUrl(memberData.imagePath)}
                          alt={memberData.fullName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {memberData.fullName}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {memberData.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TeamMemberProfile
