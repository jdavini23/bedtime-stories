/**
 * Performance Optimization Utilities and Best Practices
 *
 * This file contains tips and examples for optimizing the performance of your Next.js application.
 */

/**
 * Dynamic Import Example
 *
 * Use Next.js dynamic imports for code splitting and lazy loading components
 * that are not needed on initial page load.
 *
 * Example:
 * ```tsx
 * import dynamic from 'next/dynamic';
 *
 * // Instead of: import HeavyComponent from '@/components/HeavyComponent';
 * const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
 *   loading: () => <p>Loading...</p>,
 *   ssr: false, // Set to false if the component doesn't need to be rendered on the server
 * });
 * ```
 */

/**
 * Image Optimization
 *
 * Always use Next.js Image component for automatic image optimization.
 *
 * Example:
 * ```tsx
 * import Image from 'next/image';
 *
 * // Instead of <img src="/large-image.jpg" />
 * <Image
 *   src="/large-image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   placeholder="blur" // Optional blur-up
 *   priority={false} // Set to true for above-the-fold images
 * />
 * ```
 */

/**
 * Lazy Loading Below-the-fold Content
 *
 * Use the LazyLoad component to defer loading of below-the-fold content.
 *
 * Example:
 * ```tsx
 * import { LazyLoad } from '@/components/LazyLoad';
 *
 * <LazyLoad>
 *   <ExpensiveComponent />
 * </LazyLoad>
 * ```
 */

/**
 * Minimize Third-party Scripts
 *
 * Use Next.js Script component to optimize loading of third-party scripts.
 *
 * Example:
 * ```tsx
 * import Script from 'next/script';
 *
 * // Instead of <script src="https://example.com/script.js" />
 * <Script
 *   src="https://example.com/script.js"
 *   strategy="lazyOnload" // Options: beforeInteractive, afterInteractive, lazyOnload
 * />
 * ```
 */

/**
 * Implement Proper Caching
 *
 * Use SWR or React Query for data fetching with built-in caching.
 *
 * Example:
 * ```tsx
 * import useSWR from 'swr';
 *
 * function Profile() {
 *   const { data, error } = useSWR('/api/user', fetcher);
 *
 *   if (error) return <div>Failed to load</div>;
 *   if (!data) return <div>Loading...</div>;
 *
 *   return <div>Hello {data.name}!</div>;
 * }
 * ```
 */

/**
 * Bundle Size Analysis
 *
 * Regularly analyze your bundle size to identify large dependencies.
 *
 * Command:
 * ```
 * npm run analyze
 * ```
 */

/**
 * Performance Monitoring
 *
 * Regularly monitor performance metrics to identify areas for improvement.
 *
 * Command:
 * ```
 * npm run monitor
 * ```
 */
