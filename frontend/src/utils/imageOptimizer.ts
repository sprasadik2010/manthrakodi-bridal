// src/utils/imageOptimizer.ts

/**
 * Utility to get optimized, responsive image URLs for cards, thumbnails, and preview grids.
 * Uses Cloudflare-backed open-source image CDN (wsrv.nl) for on-the-fly resizing, compression,
 * and WebP conversion without needing backend changes or breaking existing database entries.
 *
 * @param url The original image URL (e.g. ImgBB / direct link)
 * @param width Target pixel width (e.g. 400 for cards, 96 for table thumbnails)
 * @param quality Compression quality from 1-100 (default 75 for optimal speed vs crispness)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  width: number = 400,
  quality: number = 75
): string {
  if (!url) {
    return 'https://via.placeholder.com/300x375?text=No+Image';
  }

  // If the image is a local blob, data URL, SVG, or relative asset, return as is
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('/') ||
    url.endsWith('.svg')
  ) {
    return url;
  }

  // Clean and encode URL
  const cleanUrl = url.trim();

  // If already going through an optimizer proxy, return as is
  if (cleanUrl.includes('wsrv.nl/?url=')) {
    return cleanUrl;
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=${quality}&output=webp`;
}
