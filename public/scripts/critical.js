// Critical script that needs to load before page interaction
console.log('Critical script loaded');

// Theme detection and initial setup
(function () {
  // Initialize critical functionality
  window.STORY_TIME = window.STORY_TIME || {};
  window.STORY_TIME.initialized = true;

  // We'll handle dark mode in theme.js to avoid hydration mismatches
  // DO NOT add dark class here as it causes hydration mismatch
})();
