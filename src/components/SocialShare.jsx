import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SocialShare = ({ url, title, description, imageUrl, isProfile = false }) => {
  const [isFBSDKLoaded, setIsFBSDKLoaded] = useState(false);

  useEffect(() => {
    // Function to initialize Facebook SDK
    const initFacebookSDK = () => {
      if (window.FB) {
        window.FB.init({
          appId: '1838811733657078',
          xfbml: true,
          version: 'v18.0'
        });
        setIsFBSDKLoaded(true);
      }
    };

    // Load Facebook SDK if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = initFacebookSDK;
      document.body.appendChild(script);
    } else {
      initFacebookSDK();
    }

    window.fbAsyncInit = function() {
      initFacebookSDK();
    };
  }, []);

  const handleShare = (platform) => {
    // Ensure URL is absolute
    const isLocal = window.location.hostname === "localhost";
    const baseUrl = isLocal ? "http://localhost:4000" : "https://iap-m.com";
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    if (platform === 'facebook') {
      // Force a fresh scrape of the URL before sharing
      fetch(`https://graph.facebook.com/?id=${encodeURIComponent(fullUrl)}&scrape=true`, {
        method: 'POST'
      }).then(() => {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({
          u: fullUrl,
          quote: `${title}\n\n${description}`,
        }).toString()}`;

        window.open(
          fbShareUrl,
          'facebook-share-dialog',
          `width=626,height=436,left=${(window.screen.width - 626) / 2},top=${(window.screen.height - 436) / 2}`
        );
      });
      return;
    }

    // Other social media platforms
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?${new URLSearchParams({
        url: fullUrl,
        text: title,
      }).toString()}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${fullUrl}`)}`
    };

    window.open(
      shareUrls[platform],
      'share-dialog',
      `width=550,height=450,left=${(window.screen.width - 550) / 2},top=${(window.screen.height - 450) / 2}`
    );
  };

  const shareButtons = [
    { 
      platform: 'facebook', 
      icon: FaFacebook, 
      color: 'bg-[#1877f2] hover:bg-[#1864d4]',
      label: 'Share on Facebook'
    },
    { 
      platform: 'twitter', 
      icon: FaTwitter, 
      color: 'bg-[#1da1f2] hover:bg-[#1a8cd8]',
      label: 'Share on Twitter'
    },
    { 
      platform: 'linkedin', 
      icon: FaLinkedin, 
      color: 'bg-[#0077b5] hover:bg-[#006399]',
      label: 'Share on LinkedIn'
    },
    { 
      platform: 'whatsapp', 
      icon: FaWhatsapp, 
      color: 'bg-[#25d366] hover:bg-[#20bd5a]',
      label: 'Share on WhatsApp'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
    >
      <span className="text-sm font-medium text-gray-600">
        {isProfile ? 'Share this profile' : 'Share this article'}
      </span>
      <div className="flex gap-2">
        {shareButtons.map(({ platform, icon: Icon, color, label }) => (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare(platform)}
            className={`${color} p-2 rounded-full text-white shadow-lg transition-colors`}
            title={label}
            aria-label={label}
          >
            <Icon size={20} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialShare;