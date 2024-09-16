import React from "react"
import logImg from "../assets/images/logo-black.png"
import { BsApple, BsGooglePlay } from "react-icons/bs"
import { NavLink } from "react-router-dom"

export const Footer = () => {
  return (
    <>
      <section className='app w-full md:w-full m-auto rounded-lg shadow-lg text-white flex flex-col md:flex-row bg-primary mt-16 relative z-10'>
        <div className='left w-full md:w-1/2 p-6 md:p-10'>
          <h1 className='text-2xl md:text-4xl font-semibold leading-tight'>
            Fillo trajnimet dhe avansohu <br /> BASHKOHU ME NE SOT.
          </h1>
        </div>
        <div className='right w-full md:w-1/2 flex items-center justify-center px-6 md:px-10 py-4 md:py-6 bg-[#FF7C54] rounded-lg md:rounded-r-lg md:rounded-bl-[500px]'>
          <NavLink to='/application'>
            <div className='box flex gap-2 items-center px-4 py-2 border text-white border-gray-50 hover:bg-white hover:text-black shadow-md rounded-sm'>
              <label className='text-xs md:text-sm'>JOIN IAP-M</label>
            </div>
          </NavLink>
        </div>
      </section>
      <footer className='bg-[#F3F4F8] py-10'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4'>
          <div className='logo'>
            <h3 className="text-lg text-secondary font-bold mb-2">
              IAP<span className="text-black font-bold"> ~ M</span>
            </h3>
            <span className='text-sm'>
              Behuni pjese e institutit IAPM, nje institute qe ne menyre profesionale do ju avansoje ne karrieren tuaj.
            </span>
          </div>

          <div>
            <h4 className='text-black text-sm font-semibold mb-4'>Company</h4>
            <NavLink to='#' className='text-sm block mb-2'>
              Contact
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Portfolio
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Blog
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Our team
            </NavLink>
          </div>
          <div>
            <h4 className='text-black text-sm font-semibold mb-4'>Platform</h4>
            <NavLink to='#' className='text-sm block mb-2'>
              Shop
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Pricing
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Blog
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Landing
            </NavLink>
          </div>
          <div>
            <h4 className='text-black text-sm font-semibold mb-4'>Subscribe</h4>
            <NavLink to='#' className='text-sm block mb-2'>
              About us
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Contact
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Reviews
            </NavLink>
            <NavLink to='#' className='text-sm block mb-2'>
              Services
            </NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}
