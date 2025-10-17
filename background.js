const DEFAULT_ITEMS = 6;

// Function to apply the CSS to a specific tab
const applyCss = (tabId) => {
  // Get the saved value from storage
  chrome.storage.sync.get(['itemsPerRow'], (result) => {
    const itemsPerRow = result.itemsPerRow || DEFAULT_ITEMS;

    // The CSS to be injected. It's generated dynamically based on the stored value.
    const css = `
      ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
      }
      #video-title.ytd-rich-grid-media {
        font-size: 1.4rem !important;
        line-height: 2rem !important;
        max-height: 4rem !important;
      }
      #metadata-line.ytd-rich-grid-media {
        font-size: 1.2rem !important;
      }
    `;

    // Use the Scripting API to inject the CSS
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      css: css,
    });
  });
};

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab has finished loading and the URL is a YouTube page
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com")) {
    applyCss(tabId);
  }
});

// Listen for storage changes to apply new styles immediately
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.itemsPerRow) {
        // Find all active YouTube tabs and apply the new CSS
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
            tabs.forEach(tab => applyCss(tab.id));
        });
    }
});
