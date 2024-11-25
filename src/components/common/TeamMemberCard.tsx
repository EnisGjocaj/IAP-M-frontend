import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaFilePdf, FaArrowRight } from 'react-icons/fa';

interface TeamMemberProps {
  id: string;
  name: string;
  role: string;
  title: string;
  description: string;
  imgSrc: string;
  cvUrl?: string;
  socialLinks: {
    platform: 'linkedin' | 'twitter' | 'facebook';
    url: string;
  }[];
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  id,
  name,
  role,
  title,
  description,
  imgSrc,
  cvUrl,
  socialLinks,
}) => {
  const navigate = useNavigate();
  const imageUrl = `https://iap-m-api.onrender.com${imgSrc}`;

  const handleReadMore = () => {
    navigate(`/bord/team/${id}`);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <FaLinkedin className="w-4 h-4" />;
      case 'twitter':
        return <FaTwitter className="w-4 h-4" />;
      case 'facebook':
        return <FaFacebook className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full group">
        {/* Image Container */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="relative flex flex-col justify-between w-full md:w-3/5 p-6">
          {/* Top Content */}
          <div>
            {/* Name and Role */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
              <p className="text-blue-600 font-medium">{role}</p>
            </div>

            {/* Title */}
            <p className="text-gray-600 text-sm mb-3">{title}</p>

            {/* Description with truncate */}
            <p className="text-gray-500 text-sm line-clamp-3 mb-4">{description}</p>

            {/* Social Links and CV */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {/* Social Media Icons */}
              <div className="flex gap-3">
                {socialLinks?.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>

              {/* CV Download Button */}
              {cvUrl && (
                <a
                  href={`https://iap-m-api.onrender.com${cvUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <FaFilePdf className="w-4 h-4" />
                  <span className="text-sm">CV</span>
                </a>
              )}
            </div>
          </div>

          {/* Read More Button */}
          <button
            onClick={handleReadMore}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group mt-4"
          >
            Read More
            <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;