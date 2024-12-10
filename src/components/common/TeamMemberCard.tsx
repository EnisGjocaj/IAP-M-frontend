import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Twitter, FileText, Mail, Phone, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

interface TeamMemberProps {
  id: string;
  fullName: string;
  role: string;
  title: string;
  description: string;
  imagePath: string;
  cvPath?: string;
  email?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  id,
  fullName,
  role,
  title,
  description,
  imagePath,
  cvPath,
  email,
  phoneNumber,
  linkedinUrl,
  twitterUrl,
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/bord/team/${id}`);
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full group">
        {/* Image Container */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={getImageUrl(imagePath)}
            alt={fullName}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-profile.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-between w-full md:w-3/5 p-6">
          <div>
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h3>
              <p className="text-blue-600 font-medium">{title}</p>
            </div>

            <p className="text-gray-500 text-sm line-clamp-3 mb-4">{description}</p>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              {email && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">
                    {email}
                  </a>
                </div>
              )}
              {phoneNumber && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${phoneNumber}`} className="hover:text-blue-600 transition-colors">
                    {phoneNumber}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {cvPath && (
                <a
                  href={cvPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <FileText className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={handleReadMore}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mt-6 group"
          >
            Read More
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;