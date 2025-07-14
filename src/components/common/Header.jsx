import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"
import { RiDashboardLine } from "react-icons/ri"
import { HiViewGrid } from "react-icons/hi"
import { useAuth } from "../../contexts/authContext"
import { LoginPopup } from "./LoginPopup"
import { LinkData } from "../assets/data/dummydata"

import Logo from "../assets/images/iapm-logo.jpg"
import { FaGraduationCap, FaStar, FaLinkedin, FaTrophy, FaFilter } from "react-icons/fa"

import { toast } from "react-toastify"


export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginOpen, setLoginOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isStudent = user?.isStudent 
  const [isOnBrightPage, setIsOnBrightPage] = useState(false)
  const brightPages = [
    '/bord', 
    '/blog', 
    '/news', 
    '/dashboard', 
    '/courses', 
    '/about', 
    '/instructor', 
    '/signup', 
    '/application',
    '/student-profile' 
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOnBrightPage(brightPages.some(path => location.pathname.startsWith(path)))
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsOpen(false)
  }

  const navItems = [
    ...LinkData.map(link => ({
      name: link.title,
      path: link.url
    })),
    {
      name: "BORD",
      path: "/bord",
      icon: <HiViewGrid className="w-4 h-4" />,
      showAlways: true
    },
    {
      name: "Featured Students",
      path: "/featured-students",
      icon: <FaGraduationCap className="w-4 h-4" />,
      showAlways: true
    },
    
    ...(isStudent ? [{
      name: "My Profile",
      path: `/student-profile/${user.id}`,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>,
      studentOnly: true
    }] : []),
    // Keep admin dashboard
    ...(isAdmin ? [{
      name: "Dashboard",
      path: "/dashboard",
      icon: <RiDashboardLine className="w-4 h-4" />,
      adminOnly: true
    }] : [])
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOnBrightPage
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center gap-2" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={Logo}
                alt="IAP-M Logo" 
                className="w-8 h-8 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${
                  isScrolled || isOnBrightPage ? "text-gray-800" : "text-white"
                }`}>
                  IAP<span>~M</span>
                </span>
                <span className={`text-[10px] ${
                  isScrolled || isOnBrightPage ? "text-gray-500" : "text-gray-200"
                }`}>
                  Institute
                </span>
              </div>
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1.5 mx-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    location.pathname === item.path
                      ? isScrolled || isOnBrightPage
                        ? "bg-secondary/10 text-secondary"
                        : "bg-white/10 text-white"
                      : isScrolled || isOnBrightPage
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

        
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className={`text-xs ${
                  isScrolled || isOnBrightPage ? "text-gray-600" : "text-white"
                }`}>
                  {user.name}
                  {isStudent && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px]">
                      Student
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    isScrolled || isOnBrightPage
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    isScrolled || isOnBrightPage
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </button>
                <Link to="/signup">
                  <button
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isScrolled || isOnBrightPage
                        ? "bg-secondary text-white hover:bg-secondary/90"
                        : "bg-white text-secondary hover:bg-white/90"
                    }`}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

         
          <button
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${
              isScrolled || isOnBrightPage
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto p-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      location.pathname === item.path
                        ? "bg-secondary/10 text-secondary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      {user.name}
                      {isStudent && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px]">
                          Student
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setLoginOpen(true)
                        setIsOpen(false)
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Login
                    </button>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg text-center hover:bg-secondary/90"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginPopup isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </motion.header>
  )
}