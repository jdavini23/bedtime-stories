/**
 * Utility functions for managing cookies
 */

/**
 * Clear all cookies from the browser
 * This is useful for handling auth migrations and preventing conflicts
 */
export function clearAllCookies() {
  if (typeof document === 'undefined') return;
  
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    
    // Set expiration to the past to delete the cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

/**
 * Clear specific cookies by prefix
 * @param prefix The prefix of cookies to clear (e.g., '__clerk' for Clerk cookies)
 */
export function clearCookiesByPrefix(prefix: string) {
  if (typeof document === 'undefined') return;
  
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    
    if (name.startsWith(prefix)) {
      // Set expiration to the past to delete the cookie
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}
