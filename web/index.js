function sendToExtension() {
    // Send message to extension
    window.postMessage({
      type: 'FROM_PAGE',
      tag: 'apache?'
    }, '*');
  }

  // Listen for extension messages
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'FROM_EXTENSION' && event.data.payload.response === "comanche!") {
      console.log('from extension received:', event.data.payload.optInStatus);
      //show a message that extension has been installed
    }

    else{
        console.log("nothing");
        //show a message that extension hasn't been installed
    }
  });

  document.addEventListener("click", function(e){
    //first refresh page to allow content script to be loaded

    sendToExtension()

  })