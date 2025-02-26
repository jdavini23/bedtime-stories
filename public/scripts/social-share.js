/**
 * Social Share Script
 * This script adds social sharing functionality to the website.
 * It is loaded lazily to improve initial page load performance.
 */

(function () {
  console.log('Social sharing script loaded');

  // Initialize social sharing functionality when the DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // This is a placeholder for actual social sharing functionality
    // In a real implementation, this would initialize sharing buttons
    // and handle sharing to various platforms

    // Example implementation:
    const shareButtons = document.querySelectorAll('[data-share]');

    if (shareButtons.length > 0) {
      shareButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
          e.preventDefault();

          const platform = this.getAttribute('data-share');
          const url = encodeURIComponent(window.location.href);
          const title = encodeURIComponent(document.title);

          let shareUrl = '';

          switch (platform) {
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
              break;
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
            case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
              break;
            case 'pinterest':
              const image = encodeURIComponent(
                document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
              );
              shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
              break;
          }

          if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
          }
        });
      });
    }
  });
})();
