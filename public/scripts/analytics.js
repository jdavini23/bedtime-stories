// Analytics script that loads after everything else
console.log('Analytics script loaded');

// Simple analytics implementation
(function () {
  // Initialize analytics object
  window.STORY_TIME = window.STORY_TIME || {};
  window.STORY_TIME.analytics = {
    pageViews: {},
    events: [],
  };

  // Track page view
  const trackPageView = () => {
    const path = window.location.pathname;
    window.STORY_TIME.analytics.pageViews[path] =
      (window.STORY_TIME.analytics.pageViews[path] || 0) + 1;
    console.log(`Page view tracked: ${path}`);
  };

  // Track custom event
  window.STORY_TIME.trackEvent = (category, action, label) => {
    const event = {
      category,
      action,
      label,
      timestamp: new Date().toISOString(),
    };
    window.STORY_TIME.analytics.events.push(event);
    console.log(`Event tracked: ${category} - ${action} - ${label}`);

    // In a real implementation, this would send data to an analytics service
    if (navigator.sendBeacon) {
      // Use sendBeacon for non-blocking analytics data transmission
      // navigator.sendBeacon('/api/analytics', JSON.stringify(event));
    }
  };

  // Track initial page view
  trackPageView();

  // Set up listeners for future navigation (for SPAs)
  if (typeof window.history.pushState === 'function') {
    const originalPushState = window.history.pushState;
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      trackPageView();
    };

    window.addEventListener('popstate', trackPageView);
  }

  // Track when users engage with the page
  const engagementEvents = ['click', 'scroll', 'keypress'];
  let hasEngaged = false;

  const trackEngagement = () => {
    if (!hasEngaged) {
      hasEngaged = true;
      window.STORY_TIME.trackEvent('Engagement', 'User Engaged', window.location.pathname);

      // Remove listeners after first engagement
      engagementEvents.forEach((event) => {
        document.removeEventListener(event, trackEngagement);
      });
    }
  };

  engagementEvents.forEach((event) => {
    document.addEventListener(event, trackEngagement);
  });

  console.log('Analytics initialized');
})();
