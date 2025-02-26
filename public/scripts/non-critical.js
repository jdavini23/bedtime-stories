// Non-critical script that loads when browser is idle
console.log('Non-critical script loaded');

// Enhanced features that aren't needed for initial page load
(function () {
  // Initialize additional features
  window.STORY_TIME = window.STORY_TIME || {};

  // Add animation enhancements
  window.STORY_TIME.enhanceAnimations = function () {
    console.log('Animations enhanced');
    // Find elements with animation classes and enhance them
    document.querySelectorAll('.animate-fade-in').forEach((el) => {
      el.style.transition = 'opacity 0.5s ease-in-out';
    });
  };

  // Add social sharing functionality
  window.STORY_TIME.initSocialSharing = function () {
    console.log('Social sharing initialized');
    // Add event listeners to share buttons
    document.querySelectorAll('.share-button').forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const platform = this.getAttribute('data-platform');
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
          default:
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
      });
    });
  };

  // Initialize features after a delay
  setTimeout(() => {
    window.STORY_TIME.enhanceAnimations();
    window.STORY_TIME.initSocialSharing();
    console.log('All non-critical features initialized');
  }, 1000);
})();
