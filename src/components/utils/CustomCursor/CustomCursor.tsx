'use client';

import React, { useState, useEffect } from 'react';
import { color, motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Track cursor state based on what's being hovered
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over clickable elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button'
      ) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor when component mounts
    document.body.style.cursor = 'none';
    
    // Create a style element to hide cursor on all elements
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      
      // Restore default cursor when component unmounts
      document.body.style.cursor = 'auto';
      document.head.removeChild(styleElement);
    };
  }, []);

  // Different cursor states
  const variants = {
    default: {
        x: mousePosition.x - 12.5, // Center the cursor (half of width/height)
        y: mousePosition.y - 12.5,
        height: 20,
        width: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        border: '1.5px solid rgba(0, 0, 0, 0.1)',
        transition: {
          type: 'tween',  // Changed to tween for immediate response
          duration: 0.01, // Very short duration
          ease: 'linear'  // Linear movement with no easing
        }
      },
      hover: {
        x: mousePosition.x - 12.5, // Center the cursor (half of width/height)
        y: mousePosition.y - 12.5,
        height: 22, // Same size as default
        width: 22,  // Same size as default
        // Create a radial gradient with a small white dot in center and transparent outer area
        background: 'radial-gradient(circle, rgba(255,255,255,1) 20%, rgba(0,0,0,0) 0%)',
        outline: '1.5px solid rgba(0, 0, 0, 0.3)', // Black outline
        transition: {
          type: 'tween',
          duration: 0.05, 
          ease: 'linear'
        }
      }
  };

  return (
    <motion.div
      className="fixed pointer-events-none rounded-full mix-blend-difference z-[9999]"
      variants={variants}
      animate={cursorVariant}
      style={{
        backdropFilter: 'blur(2px)'
      }}
    />
  );
};

export default CustomCursor;