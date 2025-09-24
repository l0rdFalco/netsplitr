import Mellowtel from "mellowtel";

let mellowtel;

(async () => {
  mellowtel = new Mellowtel("b408b488");
  await mellowtel.initBackground();
})();

chrome.runtime.onInstalled.addListener(async function (details) {
  const settingsLink = await mellowtel.generateSettingsLink();

  chrome.storage.local.set({ sl: settingsLink });

  if (details.reason === "install") {
    await mellowtel.generateAndOpenOptInLink();
  } else if (details.reason === "update") {
  }
});


// Handle messages from content script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.type === 'FROM_PAGE') {
    console.log('Background received from page:', request.payload);

    //get opt in status and send respective message
    const hasOptedIn = await mellowtel.getOptInStatus();

    console.log("has opted in: ", hasOptedIn);

    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'FROM_EXTENSION',
      payload: { response: 'comanche!', received: request.tag, optInStatus: hasOptedIn }
    });
  }
});
