import React from "react"
import aboutImg from "../components/assets/images/about.jpg"
import aboutImgBanner from "../components/assets/images/about-banner.jpg"
import imgs from "../components/assets/images/join1.png"
import logoImage from "../components/assets/images/iapm-logo.jpg";
import { FaBookDead, FaTractor, FaDatabase, FaVideo, FaCode, FaCalculator } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"

export const About = () => {
  return (
    <>
      <section className='about py-16'>
        <div className='container mx-auto px-4'>
          <div className='heading text-center py-12'>
            <h1 className='text-3xl font-semibold text-black'>Pse Trajnimet Tona Janë Të Jashtëzakonshme</h1>
            <span className='text-sm mt-2 block'>Nuk keni pse të mundoheni si studentë vetëm kur na keni neve.</span>
          </div>

          {/* Responsive grid: 1 column on small, 2 on medium, 3 on large, and 4 on extra-large */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
            <AboutCard color='bg-[#2D69F0]' icon={<FaCalculator size={50} />} title='Tipet e trajnimeve te IAPM' desc='Trajnime të kontabilitetit.' />
            <AboutCard color='bg-[#DD246E]' icon={<FaCode size={50} />} title='Tipet e trajnimeve te IAPM' desc='Trajnime të programimit.' />
            <AboutCard color='bg-[#8007E6]' icon={<FaVideo size={50} />} title='Tipet e trajnimeve te IAPM' desc='Trajnime të dizajnit grafik/Video Editor.' />
            <AboutCard color='bg-[#0CAE74]' icon={<FaTractor size={50} />} title='Tipet e trajnimeve te IAPM' desc='Trajnime të Agrobiznesit.' />
          </div>
        </div>
      </section>
      <AboutContent />
    </>
  );
};

export const AboutCard = (props) => {
  return (
    <div className={`box shadow-md p-5 py-8 rounded-md text-white ${props.color} cursor-pointer transition ease-in-out delay-150 hover:-translate-y-4 duration-300`}>
      <div className='icon'>{props.icon}</div>
      <div className='text mt-5'>
        <h4 className='text-lg font-semibold my-3'>{props.title}</h4>
        <p className='text-sm'>{props.desc}</p>
      </div>
    </div>
  );
};

export const AboutContent = () => {
  return (
    <section className='mb-16'>
      <div className='container flex flex-col md:flex-row md:space-x-8'>
        {/* Left Section - Image and Text */}
        <div className='left w-full md:w-1/3 relative mb-8 md:mb-0'>
          <img src={logoImage} alt='aboutImg' className='rounded-xl w-full' />
          {/* Uncomment if you want to use this image */}
          {/* <img src={aboutImgBanner} alt='aboutImg' className='rounded-xl absolute -bottom-14 -left-24 h-56 md:left-80' /> */}
          <div className='img-group mt-3 flex flex-col items-start space-y-2'>
            <img src={imgs} alt='' className='w-1/4' />
            <span className='text-[14px]'>
              Join over <label className='text-black text-sm'>4,000+</label> students
            </span>
          </div>
        </div>

        {/* Right Section - Text and Button */}
        <div className='right w-full md:w-2/3'>
          <div className='heading'>
            <h1 className='text-3xl font-semibold text-black'>Arrini sukses me IAP-M</h1>
            <span className='text-sm mt-2 block leading-6'>
              <strong>Qëllimet e Institutit për Aftësim Profesional dhe Menaxhim</strong>
              <ul className='my-3 list-disc ml-5'>
                <li className='my-2'>Ofrimi i programeve të shkëlqyera në menaxhim dhe biznes për studentët.</li>
                <li className='my-2'>Përgatitja e udhëheqësve të rinj për t'u bërë konkurrues në tregun e punës.</li>
                <li className='my-2'>Krijimi i një ambienti stimulues akademik dhe aktivitete jashtëklasore për zhvillimin profesional dhe personal të studentëve.</li>
                <li className='my-2'>Krijimi i partneriteteve strategjike për përshtatjen e programeve me nevojat e tregut.</li>
              </ul>
            </span>
            <ul className='my-5 list-disc ml-5'>
              <li className='text-sm flex items-center gap-3'>
                <AiOutlineCheck className='text-green-500' /> Trajnime të kontabilitetit.
              </li>
              <li className='text-sm flex items-center gap-3 my-2'>
                <AiOutlineCheck className='text-green-500' />
                Trajnime të programimit.
              </li>
              <li className='text-sm flex items-center gap-3'>
                <AiOutlineCheck className='text-green-500' />
                Trajnime të agrobiznesit.
              </li>
              <li className='text-sm flex items-center gap-3 my-2'>
                <AiOutlineCheck className='text-green-500' />
                Trajnime të dizajnit dhe video editimit.
              </li>
            </ul>
            <button className='px-5 py-2 border border-gray-300 rounded-md text-sm'>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};