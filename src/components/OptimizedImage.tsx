/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

/**
 * OPTIMIZED IMAGE COMPONENT
 * 
 * FEATURES:
 * - Lazy loading (images load only when visible)
 * - Responsive images (srcSet for different screen sizes)
 * - WebP format with fallback (f_auto handles this)
 * - Automatic quality optimization (q_auto)
 * - Placeholder while loading
 * - Error handling with fallback
 * - Performance-focused: Zero layout shift
 * 
 * USAGE:
 * <OptimizedImage
 *   imageVariants={data.images}
 *   alt="Team member"
 *   title="John Doe"
 *   size="card"
 * />
 */

import Image from 'next/image';
import { useState } from 'react';
import { ImageSize } from '@/lib/cloudinaryTransform';

interface ImageVariants {
  thumb: string;
  card: string;
  detail: string;
  original: string;
}

interface OptimizedImageProps {
  imageVariants: ImageVariants | null | undefined;
  alt: string;
  title?: string;
  size?: ImageSize;
  className?: string;
  priority?: boolean; // Use for above-the-fold images
}

export default function OptimizedImage({
  imageVariants,
  alt,
  title,
  size = 'card',
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get dimensions based on size
  const dimensions = {
    thumb: { width: 120, height: 120 },
    card: { width: 300, height: 300 },
    detail: { width: 600, height: 600 },
    original: { width: 800, height: 800 },
  };

  const { width, height } = dimensions[size];

  // Fallback for missing images
  if (!imageVariants || !imageVariants[size]) {
    return (
      <div
        className={`bg-gray-300 flex items-center justify-center ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <span className="text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  // Select appropriate size
  const src = imageVariants[size];

  // Validate URL is not a placeholder
  if (!src || src.includes('via.placeholder.com')) {
    return (
      <div
        className={`bg-yellow-100 flex items-center justify-center ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <span className="text-yellow-600 text-xs">Image pending</span>
      </div>
    );
  }

  // Responsive sizes for different breakpoints
  const sizes = '(max-width: 480px) 120px, (max-width: 768px) 300px, 600px';

  if (hasError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center flex-col ${className}`}
        style={{ width, height, position: 'relative' }}
      >
        <span style={{ fontSize: '3rem' }}>👤</span>
        <span className="text-gray-400 text-xs mt-1">No image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height, position: 'relative' }}>
      {/* Placeholder background while loading */}
      {isLoading && (
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: '#e5e7eb', 
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
          }} 
        />
      )}

      {/* Actual image with Next.js optimization */}
      <Image
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        quality={80}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

/**
 * ADVANCED: Picture element for browsers that don't support f_auto
 * Only use if you need to support older browsers
 */
export function OptimizedImagePicture({
  imageVariants,
  alt,
  className = '',
}: OptimizedImageProps) {
  if (!imageVariants) {
    return (
      <div className={`bg-gray-300 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  return (
    <picture>
      {/* Modern browsers: serve WebP with optimization */}
      <source srcSet={imageVariants.card} type="image/webp" />
      {/* Fallback for older browsers */}
      <img
        src={imageVariants.card}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </picture>
  );
}
