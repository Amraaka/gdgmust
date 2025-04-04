import NextImage, { ImageProps } from 'next/image';
import CustomImage from './CustomImage';

// This component decides whether to use the client-side CustomImage or server-side NextImage
export default function ImageWrapper(props: ImageProps) {
  // For static images that won't fail, use direct NextImage
  const knownImagePaths = [
    '/images/eventspage/'
  ];

  // Check if it's a known image path that shouldn't need error handling
  const isKnownPath = typeof props.src === 'string' &&
    knownImagePaths.some(path => props.src?.toString().startsWith(path));
  
  if (isKnownPath) {
    return <NextImage {...props} />;
  }
  
  // For potentially problematic images, use CustomImage with error handling
  return <CustomImage {...props} />;
}