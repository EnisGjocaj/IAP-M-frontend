import React from "react"
import { FaGraduationCap, FaUsers, FaBook } from "react-icons/fa"
import { GiWorld } from "react-icons/gi"
import CountUp from 'react-countup'

export const Instructor = () => {
  return (
    <>
      <section className='instructor mb-16 relative overflow-hidden'>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-20" />
        
        <div className='container relative'>
          <div className='heading py-16 text-center max-w-2xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
              IAP-M
            </h1>
            <span className='text-lg text-gray-600 leading-relaxed block'>
              Qëllimi i Institutit IAPM eshte trajnimi dhe certifikimi i studentëve dhe individëve për sukses në karrierë.
            </span>
          </div>

          <div className='content relative z-10'>
            <div className='heading py-12 text-center max-w-2xl mx-auto'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                Ne jemi krenare
              </h2>
              <span className='text-lg text-gray-600 leading-relaxed block'>
                Instituti yne ka arritje te larta ne trajnimin dhe mbeshtetjen e studenteve.
              </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 py-12'>
              <CountUpCard
                end={63}
                color="text-red-500"
                icon={<FaUsers className="w-14 h-14" />}
                title="Studente ne trajnime"
                gradient="from-red-500/10 to-red-600/10"
              />
              <CountUpCard
                end={20}
                color="text-orange-500"
                icon={<FaBook className="w-14 h-14" />}
                title="Trajnime totale"
                gradient="from-orange-500/10 to-orange-600/10"
              />
              <CountUpCard
                end={11}
                color="text-purple-500"
                icon={<FaGraduationCap className="w-14 h-14" />}
                title="Pjestare te bordit"
                gradient="from-purple-500/10 to-purple-600/10"
              />
              <CountUpCard
                end={4}
                color="text-indigo-500"
                icon={<GiWorld className="w-14 h-14" />}
                title="Trajnime te perfunduare"
                gradient="from-indigo-500/10 to-indigo-600/10"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const CountUpCard = ({ end, color, icon, title, gradient }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 rounded-2xl bg-white shadow-xl 
        transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
        bg-gradient-to-br ${gradient} backdrop-blur-sm`}
    >
      <div className={`${color} mb-6 transform transition-transform duration-500 group-hover:scale-110`}>
        {icon}
      </div>
      <CountUp
        end={end}
        duration={2.5}
        enableScrollSpy
        scrollSpyOnce
        className={`text-5xl font-bold mb-3 ${color}`}
      />
      <p className="text-gray-700 text-center font-medium text-lg">{title}</p>
    </div>
  )
}

export default Instructor
