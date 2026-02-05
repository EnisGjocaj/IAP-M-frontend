"use client"
import { motion } from "framer-motion"
import { FaTractor, FaVideo, FaCode, FaCalculator } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"
import { NavLink } from "react-router-dom"

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
      <section className="about py-20 bg-gradient-to-br from-white via-blue-50/20 to-primary/3 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium bg-gradient-to-r from-primary/15 to-secondary/15 text-secondary rounded-full border border-secondary/15"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              About IAP-M
            </motion.span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent mb-4 leading-tight">
              Pse Trajnimet Tona Janë Të{" "}
              <span className="relative">
                Jashtëzakonshme
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Nuk keni pse të mundoheni si studentë vetëm kur na keni neve.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ServiceCard
                color="from-blue-500 to-blue-600"
                icon={<FaCalculator className="text-white" size={20} />}
                title="Kontabilitet"
                desc="Trajnime të kontabilitetit."
                delay={0.1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ServiceCard
                color="from-pink-500 to-pink-600"
                icon={<FaCode className="text-white" size={20} />}
                title="Programim"
                desc="Trajnime të programimit."
                delay={0.2}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ServiceCard
                color="from-purple-500 to-purple-600"
                icon={<FaVideo className="text-white" size={20} />}
                title="Dizajn & Video"
                desc="Trajnime të dizajnit grafik."
                delay={0.3}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ServiceCard
                color="from-green-500 to-green-600"
                icon={<FaTractor className="text-white" size={20} />}
                title="Agrobiznes"
                desc="Trajnime të Agrobiznesit."
                delay={0.4}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      <AboutContent />
    </>
  )
}

const ServiceCard = ({ color, icon, title, desc, delay }) => {
  return (
    <motion.div
      className="group relative rounded-xl p-5 bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-300 overflow-hidden"
      style={{ boxShadow: "0px 8px 25px 0px rgba(0, 4, 48, 0.06)" }}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 400 },
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <motion.div
        className={`relative w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-3 shadow-sm`}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 400 },
        }}
      >
        {icon}
      </motion.div>

      <h3 className="relative text-lg font-semibold text-gray-900 mb-2 group-hover:text-secondary transition-colors duration-300">
        {title}
      </h3>
      <p className="relative text-sm text-gray-600 leading-relaxed">{desc}</p>

      <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-gradient-to-br from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  )
}

export const AboutContent = () => {
  const goals = [
    "Ofrimi i programeve të shkëlqyera në menaxhim dhe biznes për studentët.",
    "Përgatitja e udhëheqësve të rinj për t'u bërë konkurrues në tregun e punës.",
    "Krijimi i një ambienti stimulues akademik dhe aktivitete jashtëklasore.",
    "Krijimi i partneriteteve strategjike për përshtatjen e programeve.",
  ]

  const trainings = [
    "Trajnime të kontabilitetit",
    "Trajnime të programimit",
    "Trajnime të agrobiznesit",
    "Trajnime të dizajnit",
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00308F 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative max-w-sm mx-auto">
              {/* Subtle decorative backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl -rotate-3 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 to-primary/5 rounded-2xl rotate-2 scale-95"></div>

              <motion.img
                src="iap-m-logo.jpg"
                alt="IAP-M Logo"
                className="relative rounded-2xl shadow-lg w-full border-2 border-white"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              />

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2K+</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Studentë</div>
                    <div className="text-xs text-gray-500">Të suksesshëm</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <motion.span
                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary rounded-full border border-secondary/15 mb-4"
                  whileHover={{ scale: 1.02 }}
                >
                  Rreth Nesh
                </motion.span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  Arrini sukses me{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    IAP-M
                  </span>
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Ne jemi të përkushtuar për të ndihmuar studentët të arrijnë potencialin e tyre të plotë përmes
                  trajnimeve profesionale cilësore.
                </p>
              </div>

              <motion.div
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-6 border border-gray-100"
                style={{ boxShadow: "0px 8px 25px 0px rgba(1, 11, 60, 0.04)" }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🎯</span>
                  </span>
                  Qëllimet e Institutit
                </h3>
                <div className="space-y-3">
                  {goals.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-50 hover:border-primary/10 transition-all duration-300"
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <AiOutlineCheck className="text-white" size={10} />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-md flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📚</span>
                  </span>
                  Trajnimet Tona
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trainings.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-100 hover:border-secondary/15 hover:shadow-sm transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <AiOutlineCheck className="text-white" size={10} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <NavLink to="/application">
                  <button className="group relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-secondary to-secondary/90 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                      Apply Now
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
