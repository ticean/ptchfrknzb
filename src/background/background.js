
/**
* Performs an XMLHttpRequest to the NZBMatrix API search.
* @param url The entire search url.
* @param callback Function If the response from fetching url has a
*     HTTP status of 200, this function is called with a JSON decoded
*     response.  Otherwise, this function is called with null.
*/
function doSearchApiRequest(instanceKey, url, callback) {
    var xhr = new XMLHttpRequest();
    console.log("Ptchfrknzb: SearchAPI Request: " + url);
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = xhr.responseText;
                console.log("Ptchfrknzb: SearchAPI Raw Response: " + data);
                var response = {instanceKey: instanceKey, data: data};
                callback(response);
            } else {
                callback(null);
            }
        }
    }
    xhr.open('GET', url, true);
    xhr.send();
};

/**
 * Get locally stored data.
 * @param key The localStorage key.
 * @param callback Callback function.
 */
function getLocalStorage(key, callback) {
    var val = localStorage[key];
    callback(val);
}


/**
* Handles data sent via chrome.extension.sendRequest().
* @param request Object Data sent in the request.
* @param sender Object Origin of the request.
* @param callback Function The method to call when the request completes.
*/
function onRequest(request, sender, callback) {
    if (request.action == 'doSearchApiRequest') {
        doSearchApiRequest(request.instanceKey, request.url, callback);
    }
    if (request.action == 'getSettings') {
        var settings = localStorage;
        var response = {instanceKey: request.instanceKey, settings: settings};
        callback(response);
    }
};

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);



