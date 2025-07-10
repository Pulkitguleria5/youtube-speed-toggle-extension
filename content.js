// Default speeds (will be overridden by stored settings)
let customSpeed = 1.5;
let fastSpeed = 2.0;

// Store current speed in localStorage for persistence
let currentSpeed = customSpeed;

// Load saved speed and configurable speeds on page load
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
});

// Function to load settings from storage
function loadSettings() {
  // Load current speed from localStorage
  const savedSpeed = localStorage.getItem('youtubeSpeedToggle');
  if (savedSpeed) {
    currentSpeed = parseFloat(savedSpeed);
  }
  
  // Load configurable speeds from Chrome storage
  chrome.storage.local.get(['customSpeed', 'fastSpeed'], function(result) {
    if (result.customSpeed) {
      customSpeed = result.customSpeed;
    }
    if (result.fastSpeed) {
      fastSpeed = result.fastSpeed;
    }
  });
}

// Function to find the best video element
function findVideoElement() {
  // Try multiple selectors for better compatibility
  const selectors = [
    'video',
    '.html5-video-player video',
    '#movie_player video',
    'video[src]'
  ];
  
  for (const selector of selectors) {
    const video = document.querySelector(selector);
    if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      return video;
    }
  }
  return null;
}

// Function to show speed overlay
function showSpeedOverlay(speed) {
  // Remove existing overlay first
  const existingOverlay = document.querySelector('.speed-toggle-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = 'speed-toggle-overlay';
  overlay.textContent = `${speed}x`;
  
  Object.assign(overlay.style, {
    position: "fixed",
    top: "80px", // Below YouTube header
    right: "20px",
    padding: "8px 12px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    zIndex: 9999,
    borderRadius: "4px",
    fontFamily: "Arial, sans-serif",
    transition: "opacity 0.3s ease",
    opacity: "0"
  });
  
  document.body.appendChild(overlay);
  
  // Fade in
  setTimeout(() => overlay.style.opacity = "1", 10);
  
  // Fade out and remove
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }, 1500);
}

// Main toggle function
function toggleSpeed() {
  const video = findVideoElement();
  
  if (!video) {
    console.log('No video found on page');
    return;
  }
  
  // Toggle between speeds
  currentSpeed = currentSpeed === fastSpeed ? customSpeed : fastSpeed;
  
  // Apply speed
  video.playbackRate = currentSpeed;
  
  // Save to localStorage and chrome storage
  localStorage.setItem('youtubeSpeedToggle', currentSpeed.toString());
  chrome.storage.local.set({youtubeSpeedToggle: currentSpeed});
  
  // Show overlay
  showSpeedOverlay(currentSpeed);
  
  console.log(`Speed toggled to: ${currentSpeed}x`);
  
  return currentSpeed;
}

// Keyboard event listener
document.addEventListener("keydown", function (event) {
  // Use 'S' key instead of 'Z' to avoid conflicts with YouTube shortcuts
  // Also check if we're not in an input field
  if ((event.key === 's' || event.key === 'S') && 
      !event.target.matches('input, textarea, [contenteditable]')) {
    event.preventDefault();
    toggleSpeed();
  }
});

// Also listen for YouTube's custom keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Alternative: Use Ctrl+Shift+S for more unique shortcut
  if (event.ctrlKey && event.shiftKey && event.key === 'S') {
    event.preventDefault();
    toggleSpeed();
  }
});

// Handle dynamic content loading (YouTube is a SPA)
let observer;
function setupObserver() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        // Check if video element was added
        const video = findVideoElement();
        if (video) {
          // Apply saved speed to new video
          const savedSpeed = localStorage.getItem('youtubeSpeedToggle');
          if (savedSpeed) {
            video.playbackRate = parseFloat(savedSpeed);
            currentSpeed = parseFloat(savedSpeed);
          }
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Setup observer when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupObserver);
} else {
  setupObserver();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleSpeed') {
    const newSpeed = toggleSpeed();
    sendResponse({speed: newSpeed});
  } else if (request.action === 'updateSpeeds') {
    // Update the configurable speeds
    customSpeed = request.customSpeed;
    fastSpeed = request.fastSpeed;
    
    // Update current speed if it matches one of the old speeds
    if (currentSpeed === 1.5 || currentSpeed === 2.0) {
      currentSpeed = customSpeed;
      // Apply to current video if exists
      const video = findVideoElement();
      if (video) {
        video.playbackRate = currentSpeed;
        localStorage.setItem('youtubeSpeedToggle', currentSpeed.toString());
        chrome.storage.local.set({youtubeSpeedToggle: currentSpeed});
      }
    }
    
    sendResponse({success: true});
  }
  return true;
});
