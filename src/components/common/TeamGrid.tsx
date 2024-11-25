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
    if (path.startsWith('http')) {
      return path;
    }
    return `${config.API_URL}${path}`;
  };

  const handleReadMore = (id: string) => {
    navigate(`/bord/team/${id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {members.map((member) => (
        <div key={member.id} className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row h-full group">
            {/* Image Container */}
            <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
              <img
                src={getFullUrl(member.imagePath)}
                alt={member.fullName}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-profile.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Container */}
            <div className="relative flex flex-col justify-between w-full md:w-3/5 p-6">
              {/* Top Content */}
              <div>
                {/* Name and Role */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.fullName}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>

                {/* Title */}
                <p className="text-gray-600 text-sm mb-3">{member.title}</p>

                {/* Description with truncate */}
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{member.description}</p>

                {/* Social Links and CV */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {/* Social Media Icons */}
                  <div className="flex gap-3">
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

                  {/* CV Download Button */}
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

              {/* Read More Button */}
              <button
                onClick={() => handleReadMore(member.id)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 mt-4"
              >
                <span className="text-sm font-medium">Read More</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamGrid;