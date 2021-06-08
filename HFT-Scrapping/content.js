
const sendFeedData = (title, url, date) => {        
    let message = {title, url, date};
    chrome.runtime.sendMessage(message);
}

const sendEntireFeedContent = (content) => {
    chrome.runtime.sendMessage(content);
}

var checkLoad = setInterval(() => {
    console.log('my subscription page loaded 1');
    document.body.style.backgroundColor = 'green';
    var latestResearchFeed = document.getElementById('latestResearchFeed');
    if(latestResearchFeed !== null) {
        // clear interval
        clearInterval(checkLoad);

        console.log('latest research feed loaded');
        var feeds = latestResearchFeed.querySelectorAll('div.contentArea > div');
        console.log('feed item count', feeds.length);
        feeds.forEach((divFeed, index) => {
            var feedContentContainer = divFeed.querySelector('div.pr-4');
            var hrefElement = feedContentContainer.querySelector('a');
            var feedDateContainer = divFeed.querySelector('div.d-none');

            var title = feedContentContainer.innerText;
            var url = hrefElement.href;
            var date = feedDateContainer.innerText;            

            if(index === 0) {
                var isUpdated = false;
                var lastFeedItem = localStorage.getItem('lastFeedItem');
                if(lastFeedItem === null) {
                    isUpdated = true;
                }
                else {
                    var lastFeedObject = JSON.parse(lastFeedItem);
                    console.log('[Saved Feed Item]', lastFeedObject.title, lastFeedObject.url, lastFeedObject.date);
                    console.log('[Current Feed Item]', title, url, date);
                    if(title !== lastFeedObject.title || url !== lastFeedObject.url || date !== lastFeedObject.date) {
                        isUpdated = true;
                    }
                }
                if(isUpdated) {
                    // save last object
                    var saveItem = { title, url, date};
                    localStorage.setItem('lastFeedItem', JSON.stringify(saveItem));
                    // send feed data
                    //sendFeedData(title, url, date);

                    // send entire content
                    sendEntireFeedContent(latestResearchFeed);
                }
                else{
                    //sendFeedData('test', 'http', '1123');
                    console.log('[FeedItem] not updated');
                }
            }
        })
    }
}, 1000);

