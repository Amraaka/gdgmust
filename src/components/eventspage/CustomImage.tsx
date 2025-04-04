'use client';

import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';

export default function CustomImage(props: ImageProps) {
  const [error, setError] = useState(false);
  
  // Process the image source
  let imageSrc = props.src;
  if (typeof imageSrc === 'string' && imageSrc.startsWith('@/public')) {
    imageSrc = imageSrc.replace('@/public', '');
  }
  
  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200"
        style={{
          ...props.style,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
          <p className="text-gray-400 mt-2 text-sm">No image</p>
        </div>
      </div>
    );
  }
  
  return (
    <NextImage
      {...props}
      src={imageSrc}
      onError={() => setError(true)}
    />
  );
}