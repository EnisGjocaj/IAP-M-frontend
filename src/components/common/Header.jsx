import React, { useState } from "react"
import LogoImg from "../assets/images/iapm-logo.jpg"
import { LinkData } from "../assets/data/dummydata"
import { NavLink, useNavigate } from "react-router-dom"
import { BiShoppingBag } from "react-icons/bi"
import { HiOutlineMenuAlt1, HiViewGrid } from "react-icons/hi"
import { LoginPopup } from "./LoginPopup"
import { useAuth } from "../../contexts/authContext"



export const Header = () => {

  const { user, logout } = useAuth(); 

  const [open, setOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false); 

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <>
      <header className='bg-white py-3 text-black sticky top-0 left-0 w-full z-50 shadow-md'>
        <div className='container mx-auto px-4 flex items-center justify-between'>
          
          <div className='flex items-center gap-4'>
            <h3 className="text-lg text-secondary font-bold whitespace-nowrap">
              IAP<span className="text-black font-bold"> ~ M</span>
            </h3>
            <NavLink to="/bord" className='flex items-center text-sm gap-2'>
              <HiViewGrid size={20} />
              <span>BORD</span>
            </NavLink>
          </div>
  
          <nav className='hidden md:flex flex-grow justify-center'>
            <ul className='flex items-center gap-4'>
              {LinkData.map((link) => (
                <li key={link.id}>
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary text-sm" : "text-[15px]")}
                    to={link.url}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
  
          <button className='md:hidden flex items-center' onClick={() => setOpen(!open)}>
            <HiOutlineMenuAlt1 size={25} />
          </button>
  
          <div className='flex items-center gap-4'>
            <button className='hidden md:flex'>
              <BiShoppingBag size={25} />
            </button>
            {user ? (
              <button onClick={handleLogout} className="text-red-600">Logout</button>
            ) : (
              <>
                <button onClick={() => setLoginOpen(true)} className="hidden md:inline">Login</button>
                <NavLink to="/signup" className="hidden md:inline">Signup</NavLink>
              </>
            )}
          </div>
        </div>
  
        {open && (
          <nav className='md:hidden absolute top-14 left-0 w-full bg-white shadow-lg z-40'>
            <ul className='flex flex-col items-center'>
              {LinkData.map((link) => (
                <li key={link.id} className='py-2'>
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary text-sm" : "text-[15px]")}
                    to={link.url}
                    onClick={() => setOpen(false)}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
              <li className='py-2'>
                <NavLink
                  to="/bord"
                  className={({ isActive }) => (isActive ? "text-primary text-sm" : "text-[15px]")}
                  onClick={() => setOpen(false)}
                >
                  <div className='flex items-center gap-2'>
                    <HiViewGrid size={20} />
                    <span>BORD</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
      </header>
  
      <LoginPopup isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  
  );
};
