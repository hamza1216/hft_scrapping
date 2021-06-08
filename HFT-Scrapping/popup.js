// Initialize button with saved value
let toggleButton = document.getElementById("toggleButton");

chrome.storage.sync.get("state", ({ state }) => {
  toggleButton.value = state;
  updateToggleButton();
});

const onClickToggle = async () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
    if(url === 'https://members.legacyresearch.com/my-subscriptions') {
      let value = toggleButton.value;
      if(value === 'on') {
        value = 'off';
        // remove  alarm to refresh every 1 min
        chrome.alarms.clear('refresh');        
      }
      else {
        value = 'on';
        // update the page first
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        // create  alarm to refresh every 1 min
        chrome.alarms.create('refresh', { periodInMinutes: 1 });        
      }       
      toggleButton.value = value; 
      chrome.storage.sync.set({'state': value}, () => {
        console.log('value is set to ' + value);
      });
      updateToggleButton();      
      // chrome.scripting.executeScript({
      //   target: { tabId: tabs[0].id },
      //   function: setPageBackgroundColor,
      // });  
    }
    else {
      updateToggleButton();
      alert('Please run in the subscription page.');
    }
  
  });
}

const updateToggleButton = () => {
  let value = toggleButton.value;
    if(value === 'on') {
      toggleButton.checked = true;
    }
    else {
      toggleButton.checked = false;
    }    
}
 
toggleButton.addEventListener("click", onClickToggle);

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
