# YouTube Speed Toggle Extension

A Chrome extension that allows you to quickly toggle between 1.5x and 2.0x playback speed on YouTube videos.

## Features

- **Keyboard Shortcut**: Press 'S' to toggle between speeds
- **Alternative Shortcut**: Press Ctrl+Shift+S for a more unique shortcut
- **Configurable Speeds**: Set your own custom speeds via the popup interface
- **Speed Persistence**: Your chosen speed is remembered across page refreshes
- **Visual Feedback**: Shows current speed as an overlay
- **Popup Interface**: Click the extension icon to see current speed and toggle manually
- **Smart Detection**: Works with YouTube's dynamic content loading

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing these files
5. The extension should now appear in your extensions list

## Usage

1. Navigate to any YouTube video page
2. Press 'S' to toggle between 1.5x and 2.0x speed
3. Or click the extension icon in your toolbar to use the popup interface
4. Your speed preference will be saved and applied to future videos

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main functionality script
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `README.md` - This file

## Customization

You can configure the speeds in two ways:

### Via Popup Interface (Recommended)
1. Click the extension icon in your toolbar
2. Enter your desired speeds in the input fields
3. Click "Save Settings"

### Via Code
You can also modify the default speeds by editing the `customSpeed` and `fastSpeed` variables in `content.js`:

```javascript
let customSpeed = 1.5;  // Change this to your preferred speed
let fastSpeed = 2.0;    // Change this to your preferred speed
```

**Note**: Speeds must be between 0.25x and 16x, and they must be different from each other.

## Notes

- The extension only works on YouTube pages
- Speed changes are applied immediately
- The extension respects YouTube's existing keyboard shortcuts
- Works with YouTube's single-page application navigation

## Troubleshooting

If the extension doesn't work:
1. Make sure you're on a YouTube video page
2. Check that the video is loaded and playing
3. Try refreshing the page
4. Check the browser console for any error messages 