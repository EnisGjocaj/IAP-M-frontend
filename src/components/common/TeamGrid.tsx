import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaFilePdf, FaArrowRight } from 'react-icons/fa';
import config from '../../config';


interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  title: string;
  description: string;
  imagePath: string;
  cvPath?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface TeamGridProps {
  members: TeamMember[];
}

const TeamGrid: React.FC<TeamGridProps> = ({ members }) => {
  const navigate = useNavigate();

  const getFullUrl = (path: string) => {
    if (!path) return '';
    const trimmed = path.trim().replace(/^"+|"+$/g, ''); // remove spaces and quotes
    console.log('DEBUG imagePath:', path, '->', trimmed);
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Only prepend API_URL for local images
    return `${config.API_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
  };

  const handleReadMore = (id: string) => {
    navigate(`/bord/team/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {members.map((member) => (
        <div key={member.id} className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col h-full group">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
              {member.imagePath && (
                <img
                  src={getFullUrl(member.imagePath)}
                  alt={member.fullName}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="flex flex-col justify-between flex-grow p-4 sm:p-5 md:p-6">
              <div>
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{member.fullName}</h3>
                  <p className="text-blue-600 font-medium text-sm sm:text-base">{member.role}</p>
                </div>

                <p className="text-gray-600 text-sm mb-2 sm:mb-3">{member.title}</p>

                <p className="text-gray-500 text-sm line-clamp-3 mb-3 sm:mb-4">{member.description}</p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex gap-2 sm:gap-3">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.twitterUrl && (
                      <a
                        href={member.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                      >
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {member.cvPath && (
                    <a
                      href={getFullUrl(member.cvPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                    >
                      <FaFilePdf className="w-4 h-4" />
                      <span className="text-sm">View CV</span>
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleReadMore(member.id)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 mt-2 sm:mt-3"
              >
                <span className="text-sm font-medium">Read More</span>
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamGrid;