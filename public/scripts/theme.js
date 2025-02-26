// Theme script that loads after page interaction begins
console.log('Theme script loaded');

// Enhanced theme functionality
(function () {
  // Initialize theme toggle functionality
  window.STORY_TIME = window.STORY_TIME || {};

  // Theme toggle function
  window.STORY_TIME.toggleTheme = function () {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Wait for hydration to complete before applying theme
  // This prevents the hydration mismatch error
  const applyTheme = () => {
    // Check for saved theme preference first
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // If no saved preference, check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  };

  // Apply theme after a small delay to ensure hydration is complete
  setTimeout(applyTheme, 0);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  console.log('Theme functionality initialized');
})();
