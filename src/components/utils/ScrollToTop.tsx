'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronUp } from 'react-icons/io5';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll position to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-[19px] right-6 z-50 flex items-center justify-center w-[42px] h-[42px] md:w-12 lg:w-12 md:h-12 lg:h-12 
                     bg-white rounded-full shadow-lg border border-black/60 select-none
                     transition-all hover:shadow-xl active:shadow-md"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.3, 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.5,
            transition: { duration: 0.2 }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
          draggable="false"
        >
          <IoChevronUp className="text-black text-xl" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}