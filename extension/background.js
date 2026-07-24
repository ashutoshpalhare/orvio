// ApratimTab background service worker (MV3).
// Kept intentionally small — most logic runs in the new-tab page itself.

chrome.runtime.onInstalled.addListener(() => {
  console.log("ApratimTab installed");
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "chrome://newtab" });
});