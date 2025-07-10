document.addEventListener('DOMContentLoaded', function() {
  const speedDisplay = document.getElementById('currentSpeed');
  const toggleBtn = document.getElementById('toggleBtn');
  const speed1Input = document.getElementById('speed1');
  const speed2Input = document.getElementById('speed2');
  const saveBtn = document.getElementById('saveBtn');
  const errorMessage = document.getElementById('errorMessage');

  // Load saved settings
  function loadSettings() {
    chrome.storage.local.get(['youtubeSpeedToggle', 'customSpeed', 'fastSpeed'], function(result) {
      const currentSpeed = result.youtubeSpeedToggle || 1.5;
      const customSpeed = result.customSpeed || 1.5;
      const fastSpeed = result.fastSpeed || 2.0;
      
      speedDisplay.textContent = currentSpeed + 'x';
      speed1Input.value = customSpeed;
      speed2Input.value = fastSpeed;
    });
  }

  // Validate speed inputs
  function validateSpeeds() {
    const speed1 = parseFloat(speed1Input.value);
    const speed2 = parseFloat(speed2Input.value);
    
    if (isNaN(speed1) || isNaN(speed2)) {
      showError('Please enter valid numbers');
      return false;
    }
    
    if (speed1 < 0.25 || speed1 > 16 || speed2 < 0.25 || speed2 > 16) {
      showError('Speeds must be between 0.25x and 16x');
      return false;
    }
    
    if (speed1 === speed2) {
      showError('Speeds must be different');
      return false;
    }
    
    hideError();
    return true;
  }

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  // Hide error message
  function hideError() {
    errorMessage.style.display = 'none';
  }

  // Save settings
  function saveSettings() {
    if (!validateSpeeds()) {
      return;
    }
    
    const customSpeed = parseFloat(speed1Input.value);
    const fastSpeed = parseFloat(speed2Input.value);
    
    chrome.storage.local.set({
      customSpeed: customSpeed,
      fastSpeed: fastSpeed
    }, function() {
      // Send message to content script to update speeds
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSpeeds',
          customSpeed: customSpeed,
          fastSpeed: fastSpeed
        }, function(response) {
          if (response && response.success) {
            // Show success feedback
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#4CAF50';
            setTimeout(() => {
              saveBtn.textContent = 'Save Settings';
              saveBtn.style.background = '#4CAF50';
            }, 1000);
          }
        });
      });
    });
  }

  // Handle toggle button click
  toggleBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleSpeed'}, function(response) {
        if (response && response.speed) {
          speedDisplay.textContent = response.speed + 'x';
        }
      });
    });
  });

  // Handle save button click
  saveBtn.addEventListener('click', saveSettings);

  // Handle Enter key in input fields
  speed1Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveSettings();
    }
  });

  speed2Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveSettings();
    }
  });

  // Validate on input change
  speed1Input.addEventListener('input', validateSpeeds);
  speed2Input.addEventListener('input', validateSpeeds);

  // Load settings when popup opens
  loadSettings();
}); 