import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Twitter, FileText, Mail, Phone, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils.ts';

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

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row h-full group">
        <div className="relative w-full aspect-[4/5] sm:w-2/5 sm:h-full min-h-[200px] overflow-hidden bg-gray-100">
          {imagePath && (
            <img
              src={getImageUrl(imagePath)}
              alt={fullName}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col justify-between flex-grow sm:w-3/5 p-4 sm:p-5">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{fullName}</h3>
              <p className="text-sm text-blue-600 font-medium mt-1">{title}</p>
            </div>

            <p className="text-sm text-gray-500 line-clamp-3">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center text-gray-600 hover:text-blue-600">
                  <Mail className="w-4 h-4 mr-1.5" />
                  <span className="truncate max-w-[180px]">{email}</span>
                </a>
              )}
              {phoneNumber && (
                <a href={`tel:${phoneNumber}`} className="flex items-center text-gray-600 hover:text-blue-600">
                  <Phone className="w-4 h-4 mr-1.5" />
                  <span>{phoneNumber}</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {cvPath && (
                <a
                  href={cvPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <FileText className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/bord/team/${id}`)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 
                     text-sm font-medium mt-4 group"
          >
            Read More
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;