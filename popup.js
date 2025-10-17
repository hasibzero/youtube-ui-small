const slider = document.getElementById('items-slider');
const label = document.getElementById('items-label');
const DEFAULT_ITEMS = 6;

// Load the saved value from storage and initialize the slider
chrome.storage.sync.get(['itemsPerRow'], (result) => {
    const itemsPerRow = result.itemsPerRow || DEFAULT_ITEMS;
    slider.value = itemsPerRow;
    label.textContent = itemsPerRow;
});

// Add an event listener for when the slider value changes
slider.addEventListener('input', (event) => {
    const itemsPerRow = event.target.value;
    label.textContent = itemsPerRow;
    // Save the new value to Chrome's sync storage
    chrome.storage.sync.set({ itemsPerRow: itemsPerRow });
});
