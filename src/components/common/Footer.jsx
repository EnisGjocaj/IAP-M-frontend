


"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FaGraduationCap,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa"

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerLinks = {
    "Quick Links": [
      { name: "About Us", path: "/about" },
      { name: "Courses", path: "/courses" },
      { name: "Instructors", path: "/instructors" },
      { name: "Contact", path: "/contact" },
    ],
    Programs: [
      { name: "Accounting", path: "/courses/accounting" },
      { name: "Programming", path: "/courses/programming" },
      { name: "Graphic Design", path: "/courses/design" },
      { name: "Agribusiness", path: "/courses/agribusiness" },
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "Student Portal", path: "/portal" },
      { name: "Career Services", path: "/careers" },
      { name: "Alumni Network", path: "/alumni" },
    ],
  }

  const socialLinks = [
    { icon: FaFacebookF, href: "#", color: "hover:text-blue-500" },
    { icon: FaTwitter, href: "#", color: "hover:text-blue-400" },
    { icon: FaInstagram, href: "#", color: "hover:text-pink-500" },
    { icon: FaLinkedinIn, href: "#", color: "hover:text-blue-600" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-secondary via-secondary to-blue-900 text-white overflow-hidden">
     
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,215,0,0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10">
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <FaGraduationCap size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IAP-M Institute</h3>
                  <p className="text-blue-200 text-sm">Excellence in Education</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Instituti për Aftësim Profesional dhe Menaxhim ofron trajnime të shkëlqyera për zhvillimin e karrierës
                dhe suksesit profesional.
              </p>

            
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                  <span className="text-gray-300">Peje, Kosovo</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaPhone className="text-primary flex-shrink-0" />
                  <span className="text-gray-300">+383 49 695 535</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaEnvelope className="text-primary flex-shrink-0" />
                  <span className="text-gray-300">info@iap-m.com</span>
                </div>
              </div>
            </motion.div>

           
            {Object.entries(footerLinks).map(([title, links], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-6 text-primary">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-primary transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

      
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="max-w-md">
              <h4 className="text-lg font-semibold mb-4 text-primary">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and course announcements.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-6 py-2 bg-primary text-secondary font-semibold rounded-r-lg hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
           
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-gray-400 text-sm text-center md:text-left"
              >
                &copy; {new Date().getFullYear()} IAP-M Institute. All rights reserved.
              </motion.p>

              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:bg-white/20`}
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </motion.div>

         
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-secondary hover:bg-primary/90 transition-all duration-300"
              >
                <FaArrowUp size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

