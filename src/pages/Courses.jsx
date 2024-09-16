import React from "react"
// import { courses } from "../components/assets/data/dummydata"
import { FaBook } from "react-icons/fa"
import { AiFillStar } from "react-icons/ai"
import { NavLink } from "react-router-dom"
import { HiOutlineArrowNarrowRight } from "react-icons/hi"
import { courses } from "../components/data"
export const Courses = () => {
  return (
    <section className='courses bg-[#F3F4F8] py-16'>
      <div className='container mx-auto px-4'>
        <div className='heading mb-16 text-center'>
          <h1 className='text-3xl font-semibold text-black'>
            Gjeje drejtimin <br />
            E duhur per ju.
          </h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {courses.map((item) => (
            <div className='box rounded-lg shadow-md bg-white' key={item.id}>
              <div className='images rounded-t-lg relative overflow-hidden h-40'>
                <img
                  src={item.cover}
                  alt={item.title}
                  className='rounded-t-lg object-cover w-full h-full transition-transform transform hover:scale-110'
                />
                <div className='categ flex gap-2 absolute top-2 left-2'>
                  <span className='text-[12px] bg-blue-700 p-1 px-2 text-white rounded shadow-md'>
                    Category
                  </span>
                  <span className='text-[12px] bg-pink-700 p-1 px-2 text-white rounded shadow-md'>
                    Sub-category
                  </span>
                </div>
              </div>
              <div className='text p-3'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <FaBook />
                    <span className='text-[14px] ml-2'>{item.lessons} lessons</span>
                  </div>
                  <div className='flex items-center'>
                    <AiFillStar className='text-orange-500' />
                    <span className='text-[14px] ml-2'>{item.rating} ({item.reviews})</span>
                  </div>
                </div>
                <h3 className='text-black my-4 font-medium h-10'>{item.title}</h3>
                <div className='user flex items-center'>
                  <img className='rounded-full w-8 h-8' src={item.profileImg} alt={item.instructor} />
                  <span className='text-[14px] ml-2'>{item.instructor}</span>
                </div>
              </div>
              <div className='flex items-center justify-between border-t border-gray-200 p-3'>
                <span className='text-sm text-primary'>{item.price}</span>
                <NavLink to='/' className='text-[14px] ml-2 flex items-center'>
                  Know Details <HiOutlineArrowNarrowRight />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};