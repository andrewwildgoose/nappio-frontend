/**
 * Centralized image banner collections
 * Store reusable image arrays for banners throughout the application
 */

export const bannerImages = {
	/**
	 * Main banner - Product and lifestyle images
	 */
	main: [
		'/images/image-banner-1/anais-dropoff-1.webp',
		'/images/image-banner-1/wraps-blue-bg.webp',
		'/images/image-banner-1/nathan-crayons-focus.webp',
		'/images/image-banner-1/wraps-two-green-bg.webp',
		'/images/image-banner-1/nathan-bike-focus.webp',
		'/images/image-banner-1/wraps-orange-bg.webp',
		'/images/image-banner-1/nathan-wraps.webp',
		'/images/image-banner-1/wraps-three-pink-bg.webp'
	],

	// Add more banner collections as needed:
	// Example:
	// testimonials: [
	//   '/images/testimonials/customer-1.jpg',
	//   '/images/testimonials/customer-2.jpg',
	// ],
	//
	// products: [
	//   '/images/products/nappy-1.jpg',
	//   '/images/products/nappy-2.jpg',
	// ]
} as const;

/**
 * Type helper for banner image collections
 */
export type BannerImageKey = keyof typeof bannerImages;
