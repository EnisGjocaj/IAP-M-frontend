import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SocialShare = ({ url, title, description, imageUrl }) => {
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
    if (platform === 'facebook') {
      const isLocal = window.location.hostname === "localhost";
      const baseUrl = isLocal ? "http://localhost:4000" : "https://iap-m.com";
      const shareUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      // Create a properly formatted share object
      const shareObject = {
        method: 'share',
        href: shareUrl,
        hashtag: '#IAPM',
        quote: `${title}\n\n${description}`,
        display: 'popup',
      };

      // Try FB SDK share if available
      if (window.FB && isFBSDKLoaded) {
        try {
          window.FB.ui(shareObject, function(response) {
            if (response && !response.error_message) {
              console.log('Shared successfully');
            } else {
              console.error('Error sharing:', response);
              // Fallback to URL sharing
              const fbUrl = `https://www.facebook.com/dialog/share?${new URLSearchParams({
                app_id: '1838811733657078',
                href: shareUrl,
                hashtag: '#IAPM',
                quote: `${title}\n\n${description}`,
                display: 'popup'
              }).toString()}`;

              window.open(fbUrl, 'facebook-share-dialog', 
                `width=550,height=450,left=${(window.screen.width - 550) / 2},top=${(window.screen.height - 450) / 2}`
              );
            }
          });
        } catch (error) {
          console.error('FB SDK error:', error);
          // Fallback to URL sharing
          const fbUrl = `https://www.facebook.com/dialog/share?${new URLSearchParams({
            app_id: '1838811733657078',
            href: shareUrl,
            hashtag: '#IAPM',
            quote: `${title}\n\n${description}`,
            display: 'popup'
          }).toString()}`;

          window.open(fbUrl, 'facebook-share-dialog', 
            `width=550,height=450,left=${(window.screen.width - 550) / 2},top=${(window.screen.height - 450) / 2}`
          );
        }
      } else {
        // Use URL sharing if FB SDK is not available
        const fbUrl = `https://www.facebook.com/dialog/share?${new URLSearchParams({
          app_id: '1838811733657078',
          href: shareUrl,
          hashtag: '#IAPM',
          quote: `${title}\n\n${description}`,
          display: 'popup'
        }).toString()}`;

        window.open(fbUrl, 'facebook-share-dialog', 
          `width=550,height=450,left=${(window.screen.width - 550) / 2},top=${(window.screen.height - 450) / 2}`
        );
      }
      return;
    }

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?${new URLSearchParams({
        url: url,
        text: title
      }).toString()}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`
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
      <span className="text-sm font-medium text-gray-600">Share this article</span>
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