import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  isAboveFold?: boolean;
  className?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  isAboveFold = false,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1200);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const getSizes = () => {
    if (props.fill) return '100vw'; 
    if (viewportWidth < 640) return '100vw';
    if (viewportWidth < 1024) return '50vw';
    return '33vw';
  };

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt || ''}
        priority={priority || isAboveFold}
        loading={isAboveFold ? "eager" : "lazy"}
        sizes={props.sizes || getSizes()}
        quality={props.quality || 80}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJpgZlKPAAAAABJRU5ErkJggg=="
        onLoadingComplete={() => setLoading(false)}
        className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />
    </div>
  );
}