// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - Called when the URL of the current tab
 *   is found. The callback gets the URL of the current tab.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/custom-search/
  var searchUrl = 'https://www.googleapis.com/customsearch/v1' +
    '?key=AIzaSyAGa6MTDw8cU-qkfkctqVQCPQqoe92iJe8' +
    '&cx=011358914762160069545:ajo3-e_tcko' +
    '&searchType=image' +
    '&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';
  x.onload = function() {
    var response = x.response;
    if (!response || !response.items || !response.items ||
        response.items.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.items[0];
    var imageUrl = firstResult.image.thumbnailLink;
    var width = parseInt(firstResult.image.thumbnailWidth);
    var height = parseInt(firstResult.image.thumbnailHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Custom Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

/**
 * Display image in popup.
 *
 * @param {string} imageUrl - Url of image
 * @param {string} width - Width of image
 * @param {string} height - Height of image
 */
function displayImageUrl(imageUrl, width, height) {
  var imageResult = document.getElementById('image-result');
  imageResult.width = width;
  imageResult.height = height;
  imageResult.src = imageUrl;
  imageResult.hidden = false;
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Performing Google Image search for ' + url);
    getImageUrl(url, function(imageUrl, width, height) {
      renderStatus('Search term: ' + url + '\n' +
          'Google image search result: ' + imageUrl);
      displayImageUrl(imageUrl, width, height);
    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});
