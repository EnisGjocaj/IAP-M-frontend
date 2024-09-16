// // TeamSection.jsx
// import React from 'react';
import TeamMemberCard from '../components/common/TeamMemberCard';

// const teamMembers = [
//   {
//     name: "Bonnie Green",
//     position: "CEO & Web Developer",
//     description: "Bonnie drives the technical strategy of the flowbite platform and brand.",
//     avatarUrl: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
//     socialLinks: [
//       { href: "#", iconPath: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
//       // Add other social link paths here
//     ]
//   },
//   {
//     name: "Jese Leos",
//     position: "CTO",
//     description: "Jese drives the technical strategy of the flowbite platform and brand.",
//     avatarUrl: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
//     socialLinks: [
//       { href: "#", iconPath: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
//       // Add other social link paths here
//     ]
//   },
//   // Add other team members here
// ];
// const TeamSection = () => {
//     return (
//       <section className="bg-white dark:bg-gray-900">
//         <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
//           <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
//             <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Team</h2>
//             <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
//               Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind.
//             </p>
//           </div>
//           <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
//             {teamMembers.map((member, index) => (
//               <TeamMemberCard
//                 key={index}
//                 name={member.name}
//                 position={member.position}
//                 description={member.description}
//                 avatarUrl={member.avatarUrl}
//                 socialLinks={member.socialLinks}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   };

// export default TeamSection;

import React , { useState, useEffect} from 'react';

import { getAllTeamMembers } from '../api/teamMembers';

const TeamSection = () => {

    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
      const fetchTeamMembers = async () => {
        try {
          const response = await getAllTeamMembers();
          const members = response?.data || [];
          setTeamMembers(Array.isArray(members) ? members : []);
        } catch (error) {
          setError('Error fetching team members');
          console.error('Error fetching team members:', error);
        } finally {
          setLoading(false);
        }
      };
      
    
        fetchTeamMembers();
      }, []);
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>{error}</div>;
  
    // return (
    //   <section className="bg-white dark:bg-gray-900">
    //     <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
    //       <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
    //         <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
    //           BORDI YNE
    //         </h2>
    //         <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
    //           Pjestaret e Bordit te institutit IAP-M
    //         </p>
    //       </div>
    //       <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2 lg:grid-cols-3">
    //       {teamMembers.length > 0 ? (
    //       teamMembers.map((member) => (
    //         <TeamMemberCard
    //           key={member.id}
    //           id={member.id} 
    //           name={member.fullName}
    //           role={member.role}
    //           title={member.title}
    //           description={member.description}
    //           imgSrc={member.imagePath} // Update to match your model
    //           socialLinks={member.socialLinks || []} // Ensure socialLinks is always an array
    //         />
    //       ))
    //     ) : (
    //       <p>No team members available.</p>
    //     )}

    //       </div>
    //     </div>
    //   </section>
    // );

    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              BORDI YNE
            </h2>
            <p className="font-light text-gray-500 sm:text-lg md:text-xl lg:text-2xl dark:text-gray-400">
              Pjestaret e Bordit te institutit IAP-M
            </p>
          </div>
    
          {/* Update grid to be responsive */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  id={member.id} 
                  name={member.fullName}
                  role={member.role}
                  title={member.title}
                  description={member.description}
                  imgSrc={member.imagePath} 
                  socialLinks={member.socialLinks || []} 
                />
              ))
            ) : (
              <p className="text-center col-span-full">No team members available.</p>
            )}
          </div>
        </div>
      </section>
    );
  };
export default TeamSection;

