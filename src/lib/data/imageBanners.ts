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
		'/images/image-banner-1/wrap_stack_3_blue_square.webp',
		'/images/image-banner-1/nathan-crayons-focus.webp',
		'/images/image-banner-1/wrap_stack_4_green_square.webp',
		'/images/image-banner-1/nathan-bike-focus.webp',
		'/images/image-banner-1/wrap_stack_5_orange_square.webp',
		'/images/image-banner-1/nathan-wraps.webp',
		'/images/image-banner-1/wrap_stack_6_pink_square.webp'
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
