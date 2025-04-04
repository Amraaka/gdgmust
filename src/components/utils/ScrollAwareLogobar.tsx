'use client';

import { useState, useEffect } from 'react';
import Logobar from '../navbar/Logobar';

const ScrollAwareLogobar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      
      // Only hide when scrolling down and past a threshold (e.g., 50px)
      if (isScrollingDown && currentScrollPos > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  return (
    <div style={{ position: 'relative' }} className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
      visible ? 'transform-none' : '-translate-y-full'
    }`}>
      <div className="flex justify-center items-center w-full py-4">
        <Logobar />
      </div>
    </div>
  );
};

export default ScrollAwareLogobar;