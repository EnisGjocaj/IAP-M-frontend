// const TeamMemberCard = ({ member }) => {
//     return (
//       <div className="bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-105">
//         <a href="#">
//           <img className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg" src={member.imgSrc} alt={`${member.name} Avatar`} />
//         </a>
//         <div className="p-5">
//           <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
//             <a href="#">{member.name}</a>
//           </h3>
//           <span className="text-gray-500 dark:text-gray-400">{member.role}</span>
//           <p className="mt-2 text-gray-500 dark:text-gray-400">{member.description}</p>
//           <div className="flex mt-4 space-x-5">
//             {member.links.map((link, index) => (
//               <a key={index} href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d={link.iconPath} />
//                 </svg>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

import { useNavigate } from 'react-router-dom';


const TeamMemberCard = ({ id, name, role, title, imgSrc, socialLinks = [] }) => {
  console.log(imgSrc);
  const imageUrl = `http://localhost:4000${imgSrc}`;

  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/bord/team/${id}`);
  };

  // return (
  //   <div className="flex items-center bg-gray-50 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700
  //                   cursor-pointer transform transition-transform duration-300 hover:scale-105"
  //   >
  //     <a href="#" className="flex-shrink-0 w-32">
  //       <img
  //         className="w-full h-auto object-cover rounded-l-lg"
  //         src={imageUrl}
  //         alt={`${name} Avatar`}
  //       />
  //     </a>

  //     <div className="p-5 flex-1">
  //       <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
  //         <a href="#">{name}</a>
  //       </h3>
  //       <span className="text-gray-500 dark:text-gray-400">{role}</span>
  //       <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
  //         {title}
  //       </p>
  //       <ul className="flex space-x-4 sm:mt-0">
  //         {socialLinks.map((link, index) => (
  //           <li key={index}>
  //             <a
  //               href={link.href}
  //               className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
  //             >
  //               <svg
  //                 className="w-5 h-5"
  //                 fill="currentColor"
  //                 viewBox="0 0 24 24"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path d={link.iconPath} />
  //               </svg>
  //             </a>
  //           </li>
  //         ))}
  //       </ul>

  //       <button
  //         onClick={handleReadMore}
  //         className="px-4 py-2 mt-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300"
  //       >
  //         Read More
  //       </button>

  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 overflow-hidden">
      {/* Flex layout: column by default, row on medium screens and above */}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <a href="#" className="w-full md:w-1/3">
          <img
            className="w-full h-48 md:h-full object-cover"
            src={imageUrl}
            alt={`${name} Avatar`}
          />
        </a>

        {/* Content Section */}
        <div className="p-4 md:p-5 flex-1">
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h3>
          <span className="block text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 md:mt-2">
            {role}
          </span>
          <p className="mt-2 md:mt-3 mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <ul className="flex justify-center md:justify-start space-x-4 mb-4">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={link.iconPath} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="text-center md:text-left">
            <button
              onClick={handleReadMore}
              className="px-4 py-2 mt-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;

