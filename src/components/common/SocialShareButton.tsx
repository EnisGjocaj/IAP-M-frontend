import React from 'react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';

interface SocialShareButtonProps {
  platform: 'linkedin' | 'twitter' | 'facebook';
  url: string;
  name: string;
  role: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  url,
  name,
  role,
}) => {
  const getShareUrl = () => {
   
    const isLocal = window.location.hostname === "localhost";
    const baseUrl = isLocal ? "http://localhost:4000" : "https://iap-m.com";
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    const text = `Check out ${name}, ${role} at IAPM`;
    
    switch (platform) {
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(text)}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(text)}`;
      default:
        return url;
    }
  };

  const getIcon = () => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getShareUrl(), '_blank', 'width=600,height=400');
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-gray-600 hover:text-secondary transition-colors duration-200 rounded-full hover:bg-gray-100"
      aria-label={`Share on ${platform}`}
    >
      {getIcon()}
    </button>
  );
};

export default SocialShareButton;