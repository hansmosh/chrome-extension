# First Chrome Extension

Got started with the Google [getting started](https://developer.chrome.com/extensions/getstarted). The guide uses a deprecated image search so I had to set up a [custom search engine](https://cse.google.com/cse/all) to get a *custom search id (cx)* and create a new [Google project](https://console.developers.google.com/apis/library) with Custom Search API enabled to get an *api key (key)* for my image query:

    `https://www.googleapis.com/customsearch/v1?key=API_KEY&cx=CUSTOM_SEARCH_ID&searchType=image&q=QUERY`
