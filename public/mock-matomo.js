/**
 * Mock Matomo Tracker for Local Development
 * 
 * This simulates the Matomo analytics library to allow testing tracking code
 * without needing the real Matomo server. All tracking calls are logged to the console.
 * 
 * USAGE:
 * ------
 * 1. In your wrangler.toml, set: MATOMO_DOMAIN = "mock"
 * 2. Run: npm run dev
 * 3. Open browser console to see tracking events
 * 
 * This file is safe to deploy to production - it will only load when 
 * MATOMO_DOMAIN is set to "mock" or "dev" (see app/root.tsx AnaliticsTag)
 */

(function () {
  'use strict';

  // Styles for console logging
  const styles = {
    header: 'background: #3152A0; color: white; padding: 2px 6px; border-radius: 3px;',
    heartbeat: 'background: #E91E63; color: white; padding: 2px 6px; border-radius: 3px;',
    track: 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;',
    config: 'background: #FF9800; color: white; padding: 2px 6px; border-radius: 3px;',
    info: 'color: #666;'
  };

  function log(style, label, ...args) {
    console.log(`%c${label}`, styles[style], ...args);
  }

  // Track page state for heartbeat
  let pageLoadTime = Date.now();
  let lastActivityTime = Date.now();
  let totalTimeOnPage = 0;
  let heartbeatInterval = null;
  let heartbeatDelay = 15; // Default 15 seconds
  let isPageVisible = true;

  // Update activity time on user interaction
  function updateActivityTime() {
    lastActivityTime = Date.now();
  }

  // Track visibility changes
  function handleVisibilityChange() {
    isPageVisible = !document.hidden;
    log('info', 'Matomo Mock', `Page visibility changed: ${isPageVisible ? 'visible' : 'hidden'}`);
  }

  // Heartbeat function - simulates what real Matomo does
  function sendHeartbeat() {
    if (!isPageVisible) {
      log('heartbeat', '💓 Heartbeat', 'Skipped (page not visible)');
      return;
    }

    const now = Date.now();
    const timeSinceLoad = Math.round((now - pageLoadTime) / 1000);
    const timeSinceActivity = Math.round((now - lastActivityTime) / 1000);

    totalTimeOnPage = timeSinceLoad;

    log('heartbeat', '💓 Heartbeat', {
      totalTimeOnPage: `${totalTimeOnPage}s`,
      timeSinceLastActivity: `${timeSinceActivity}s`,
      wouldSendPing: timeSinceActivity < 30, // Matomo only sends if user was active recently
      timestamp: new Date().toISOString()
    });

    // In real Matomo, this would send a request to matomo.php with:
    // - ping=1
    // - The accumulated time on page
  }

  // Mock Tracker object
  function MockTracker(trackerUrl, siteId) {
    this.trackerUrl = trackerUrl;
    this.siteId = siteId;
    this.customDimensions = {};
    this.cookiesEnabled = true;
    this.linkTrackingEnabled = false;

    log('header', 'Matomo Mock', 'Tracker created', { trackerUrl, siteId });
  }

  MockTracker.prototype = {
    // Heartbeat Timer - THE KEY FEATURE YOU'RE TESTING
    enableHeartBeatTimer: function (delaySeconds) {
      heartbeatDelay = delaySeconds || 15;

      log('config', 'Matomo Config', `HeartBeatTimer ENABLED with ${heartbeatDelay}s interval`);

      // Clear any existing interval
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }

      // Set up the heartbeat interval
      heartbeatInterval = setInterval(sendHeartbeat, heartbeatDelay * 1000);

      // Send first heartbeat after delay
      setTimeout(sendHeartbeat, heartbeatDelay * 1000);

      // Set up activity listeners
      ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, updateActivityTime, { passive: true });
      });

      // Track visibility
      document.addEventListener('visibilitychange', handleVisibilityChange);

      log('info', 'Matomo Mock', 'Activity listeners registered for heartbeat tracking');
    },

    disableCookies: function () {
      this.cookiesEnabled = false;
      log('config', 'Matomo Config', 'Cookies DISABLED');
    },

    trackPageView: function (customTitle) {
      log('track', 'Track PageView', {
        url: window.location.href,
        title: customTitle || document.title,
        referrer: document.referrer || '(none)',
        timestamp: new Date().toISOString()
      });
      pageLoadTime = Date.now();
    },

    enableLinkTracking: function (enable) {
      this.linkTrackingEnabled = enable !== false;
      log('config', 'Matomo Config', `Link tracking ${this.linkTrackingEnabled ? 'ENABLED' : 'DISABLED'}`);

      if (this.linkTrackingEnabled) {
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a');
          if (link && link.href) {
            const isExternal = link.hostname !== window.location.hostname;
            log('track', 'Track Link', {
              url: link.href,
              type: isExternal ? 'outlink' : 'internal',
              text: link.textContent?.trim().substring(0, 50)
            });
          }
        });
      }
    },

    setTrackerUrl: function (url) {
      this.trackerUrl = url;
      log('config', 'Matomo Config', `Tracker URL set: ${url}`);
    },

    setSiteId: function (id) {
      this.siteId = id;
      log('config', 'Matomo Config', `Site ID set: ${id}`);
    },

    setCustomDimension: function (dimensionId, value) {
      this.customDimensions[dimensionId] = value;
      log('config', 'Matomo Config', `Custom dimension ${dimensionId} = "${value}"`);
    },

    trackEvent: function (category, action, name, value) {
      log('track', 'Track Event', { category, action, name, value });
    },

    trackSiteSearch: function (keyword, category, resultsCount) {
      log('track', 'Track SiteSearch', { keyword, category, resultsCount });
    },

    trackGoal: function (goalId, revenue) {
      log('track', 'Track Goal', { goalId, revenue });
    },

    // Get methods for debugging
    getVisitorId: function () {
      return 'mock-visitor-' + Math.random().toString(36).substring(2, 10);
    },

    getAttributionInfo: function () {
      return null;
    },

    getCustomDimension: function (dimensionId) {
      return this.customDimensions[dimensionId];
    }
  };

  // Global Matomo object
  window.Matomo = {
    getTracker: function (trackerUrl, siteId) {
      log('header', 'Matomo Mock', 'getTracker() called');
      return new MockTracker(trackerUrl, siteId);
    },

    getAsyncTracker: function () {
      log('header', 'Matomo Mock', 'getAsyncTracker() called');
      return window.Matomo._asyncTracker || new MockTracker('', '');
    },

    _asyncTracker: null
  };

  // Also expose as Piwik for legacy support
  window.Piwik = window.Matomo;

  // Process the _paq queue (this is how the async tracking works)
  function processPaqQueue() {
    const _paq = window._paq || [];

    // Create a default tracker if we haven't yet
    if (!window.Matomo._asyncTracker) {
      window.Matomo._asyncTracker = new MockTracker('', '');
    }

    const tracker = window.Matomo._asyncTracker;

    // Process existing queue items
    const originalPush = _paq.push;

    function processCommand(command) {
      if (!Array.isArray(command)) return;

      const [methodName, ...args] = command;

      if (typeof methodName === 'string') {
        if (typeof tracker[methodName] === 'function') {
          tracker[methodName].apply(tracker, args);
        } else {
          log('info', 'Matomo Mock', `Unknown method: ${methodName}`, args);
        }
      } else if (typeof methodName === 'function') {
        methodName.call(tracker);
      }
    }

    // Process any existing items in the queue
    _paq.forEach(processCommand);

    // Override push to process new items immediately
    _paq.push = function (...commands) {
      commands.forEach(processCommand);
      return originalPush.apply(_paq, commands);
    };

    window._paq = _paq;
  }

  // Process queue when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processPaqQueue);
  } else {
    processPaqQueue();
  }

  // Log that mock is ready
  log('header', 'Matomo Mock', '✅ Mock Matomo loaded successfully!');
  log('info', 'Matomo Mock', 'Use Matomo.getTracker() or check console for tracking events');

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    log('header', 'Matomo Mock', 'Page unloading - final time on page:', `${totalTimeOnPage}s`);
  });

})();
