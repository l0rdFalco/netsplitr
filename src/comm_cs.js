

window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  
  if (event.data.type && event.data.type === 'FROM_PAGE') {
      console.log('Content script received button message:', event.data.tag);
      
      // Send to background script
      chrome.runtime.sendMessage({
          type: 'FROM_PAGE',
          payload: event.data.tag
      }, (response) => {
          // Send response back to webpage
          window.postMessage({
              type: 'FROM_EXTENSION',
              payload: {
                  responseTo: event.data.tag,
                  data: response,
                  timestamp: Date.now()
              }
          }, '*');
      });
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("request type: ", request.type);
  if (request.type === 'FROM_EXTENSION') {
      window.postMessage({
          type: 'FROM_EXTENSION',
          payload: request.payload
      }, '*');
  }
});