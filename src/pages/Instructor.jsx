import React from "react"
import { FaGraduationCap, FaUsers, FaBook } from "react-icons/fa"
import { GiEvilBook, GiWorld } from "react-icons/gi"

export const Instructor = () => {
  return (
    <>
      <section className='instructor mb-16'>
        <div className='container'>
          <div className='heading py-12 text-center w-2/3 m-auto md:w-full'>
            <h1 className='text-3xl font-semibold text-black'>IAP-M</h1>
            <span className='text-[14px] mt-2 block'>Qëllimi i Institutit IAPM eshte trajnimi dhe certifikimi i studentëve dhe individëve për sukses në karrierë.</span>
          </div>
          <div className='content grid grid-cols-1 sm:grid-cols-2 gap-5'>
  <div className='images rounded-lg relative overflow-hidden h-60 sm:h-72 w-full'>
    <img 
      src='https://bdevs.net/wp/educal/wp-content/uploads/2021/09/what-1.jpg' 
      alt='Image 1' 
      className='rounded-t-lg object-cover w-full h-full'
    />
    <div className='categ flex flex-col gap-4 absolute inset-0 m-3 p-4 sm:p-8 items-center justify-center text-center bg-black bg-opacity-50'>
      <h2 className='text-xl sm:text-3xl text-white font-semibold'>
        Mesoni ne menyre profesionale
      </h2>
      <button className='text-sm sm:text-base py-2 px-4 border border-gray-200 rounded-md text-white'>
        Start a class today
      </button>
    </div>
  </div>
  <div className='images rounded-lg relative overflow-hidden h-60 sm:h-72 w-full'>
    <img 
      src='https://bdevs.net/wp/educal/wp-content/uploads/2021/09/what-2.jpg' 
      alt='Image 2' 
      className='rounded-t-lg object-cover w-full h-full'
    />
    <div className='categ flex flex-col gap-4 absolute inset-0 m-3 p-4 sm:p-8 items-center justify-center text-center bg-black bg-opacity-50'>
      <h2 className='text-xl sm:text-3xl text-white font-semibold'>
        Behuni instruktore
      </h2>
      <button className='text-sm sm:text-base py-2 px-4 border border-gray-200 rounded-md text-white'>
        Join us today
      </button>
    </div>
  </div>
</div>

          <div className='content'>
            <div className='heading py-12 text-center w-2/3 m-auto md:w-full'>
              <h1 className='text-3xl font-semibold text-black'>Ne jemi krenare</h1>
              <span className='text-[14px] mt-2 block'>Instituti yne ka arritje te larta ne trajnimin dhe mbeshtetjen e studenteve.</span>
            </div>
            <div className='content grid grid-cols-4 gap-5 md:grid-cols-2'>
              <InstructorCard color='text-red-500' icon={<FaUsers size={40} />} title='63' desc='Studente ne trajnime' />
              <InstructorCard color='text-orange-500' icon={<FaBook size={40} />} title='20' desc='Trajnime totale' />
              <InstructorCard color='text-purple-500' icon={<FaGraduationCap size={40} />} title='11' desc='Pjestare te bordit' />
              <InstructorCard color='text-indigo-500' icon={<GiWorld size={40} />} title='4' desc='Trajnime te perfunduare' />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export const InstructorCard = (props) => {
  return (
    <div className={`box p-5 py-5 rounded-md`}>
      <div className={`${props.color}`}>{props.icon}</div>
      <div className='text mt-2'>
        <h4 className='text-lg font-semibold text-black'>{props.title}</h4>
        <p className='text-[15px]'>{props.desc}</p>
      </div>
    </div>
  )
}
