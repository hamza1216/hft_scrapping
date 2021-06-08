let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ state: 'off' });
  console.log('Default toggle button set to off');
});

// alarm listener
chrome.alarms.onAlarm.addListener(alarm => {
  // if watchdog is triggered, check whether refresh alarm is there
  if (alarm && alarm.name === 'refresh') {    
    console.log('alarm called every 1 min.');
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        if(tab.url === 'https://members.legacyresearch.com/my-subscriptions') {
          console.log('refresh page...');
          chrome.tabs.update(tab.id, {url: tab.url});
        }
      });      
    });
  } 
});

// chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//   if(sender.tab.url === 'https://members.legacyresearch.com/my-subscriptions') {

//   console.log(msg);

//   let formData = new FormData();
//   formData.append('title', msg.title);
//   formData.append('url', msg.url);
//   formData.append('date', msg.date);
//   console.log('[FeedItem] saved...');
//   fetch('https://rdp.hft4.life/hft/save_feed.php', {
//       method: 'post',
//       body: formData,
//   }).then(function(response) {      
//       return response.json();
//   }).then(function(data) {
//       console.log(data);
//   });

// }

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(sender.tab.url === 'https://members.legacyresearch.com/my-subscriptions') {

  //console.log(msg);
  var data = {data: msg};

  console.log('[FeedItem] saved...');
  fetch('http://localhost:4000/memberzone', {
      method: 'post',
      body: data,
  }).then(function(response) {      
      return response.json();
  }).then(function(data) {
      console.log(data);
  });

}

  // do something
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (tab.url.indexOf("https://members.legacyresearch.com/my-subscriptions") > -1 && 
      changeInfo.status === 'complete'){
      console.log('subscription page reloaded.');
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      });
  }
});