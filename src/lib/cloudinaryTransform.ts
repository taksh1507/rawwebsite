/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

/**
 * IMAGE URL HANDLER
 * Handles direct folder URLs (no Cloudinary transformation)
 * All images are stored in a local folder with direct URL references
 */

export type ImageSize = 'thumb' | 'card' | 'detail' | 'original';

export interface ImageVariants {
  thumb: string;    // Direct URL for thumbnails
  card: string;     // Direct URL for cards
  detail: string;   // Direct URL for detail views
  original: string; // Original URL (direct)
}

/**
 * Returns the image URL as-is (no transformation needed)
 * @param imageUrl - Direct image URL from folder
 * @returns The URL unchanged
 */
export function transformCloudinaryUrl(
  imageUrl: string | null | undefined,
  size: ImageSize = 'card'
): string {
  if (!imageUrl) {
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }
  return imageUrl;
}

/**
 * Generates all image variants - all point to the same direct URL
 * @param imageUrl - Direct image URL
 * @returns Object with all size variants (all same URL)
 */
export function getImageVariants(imageUrl: string | null | undefined): ImageVariants {
  const url = transformCloudinaryUrl(imageUrl);
  return {
    thumb: url,
    card: url,
    detail: url,
    original: url,
  };
}

/**
 * Generates responsive srcSet for HTML img tags
 * @param imageUrl - Direct image URL
 * @returns srcSet string for responsive images
 */
export function getImageSrcSet(imageUrl: string | null | undefined): string {
  const url = transformCloudinaryUrl(imageUrl);
  return `${url} 120w, ${url} 300w, ${url} 600w`;
}

/**
 * Generates sizes attribute for responsive images
 * @returns sizes attribute value
 */
export function getImageSizes(): string {
  return '(max-width: 480px) 120px, (max-width: 768px) 300px, 600px';
}
