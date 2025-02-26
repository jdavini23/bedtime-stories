import dynamic from 'next/dynamic';

/**
 * Re-export Next.js dynamic import function with documentation
 *
 * This is a simple re-export of Next.js dynamic import function with better documentation
 * on how to use it for code splitting and lazy loading.
 *
 * Example usage:
 * ```tsx
 * // Instead of importing directly
 * // import HeavyComponent from '@/components/HeavyComponent';
 *
 * // Use dynamic import for code splitting
 * const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
 *   loading: () => <div>Loading...</div>,
 *   ssr: false, // Set to false for components not needed during SSR
 * });
 * ```
 *
 * Benefits:
 * - Reduces initial bundle size
 * - Loads components only when needed
 * - Improves initial page load performance
 */
export const dynamicImport = dynamic;

export default dynamic;
