/* Main JS */

chrome.extension.sendRequest({'action': 'getSettings'}, function(settings) {

    var options = {key: settings.api_key, username: settings.api_username };

    var nzbMatrix = new NzbMatrix(options);
    var pitchfork = new Scraper();
    var url = nzbMatrix.getSearchRequest(pitchfork.scrape());

    // Send a request to fetch data from NzbMatrix API.
    if(url) {
        chrome.extension.sendRequest({'action': 'doSearchApiRequest', 'url': url}, function(rawResponse) {

            var obj = nzbMatrix.getSearchResult(rawResponse);
            if(obj) {

                // Build search result content.
                var record = obj.results;
                var rows = "";
                for(i in record) {
                    rows += "<div class=\"results-list-row " + record[i].NZBID + "\">" +
                        "<div class='name'>" + record[i].NZBNAME + "</div>" +
                        "<div class=\"action " + record[i].NZBID + "\">" +
                            "<span class=bookmark><a id=\"" + record[i].NZBID + "\" href=#>Bookmark</a></span>" +
                            //"<span class=download><a href=\"https://" + record[i].LINK + "\" >Download</a></span>" +
                            "<span class=size>(" + formatBytes(record[i].SIZE) + ")</span>" +
                            "<span class=status></span>" +
                        "</div>" +
                    "</div>";
                }

                //var flagUrl = (obj.results.length>0)? "images/flag_trans.png":"images/flag_nr.png";
                var flag = "<div id=ptchfrknzb-flag>" +
                            "<img class=ptchfrknzb-icon src=\"" + chrome.extension.getURL('images/flag_trans.png') + "\"'/>" +
                        "</div>";
                var panel = "<div id=ptchfrknzb-panel>" +
                            "<div class=header>" +
                                "<div id=info>Ptchfrknzb found results on NzbMatrix:</div>" +
                            "</div>" +
                            "<div id=results-list>" + rows + "</div>" +
                        "</div>";

                // Add flag indicating results found..
                $(".tombstone-cover-image").after(flag);
                var pos = $(".tombstone-cover-image").position();
                $("#ptchfrknzb-flag").css({"left": pos.left, "top": pos.top, "position": "absolute", "z-index":1000});

                // Add the results panel.
                $(".panel.content-container").before(panel);
                $(".tombstone-cover-image, #ptchfrknzb-flag").click(function () {
                    $("#ptchfrknzb-panel").slideToggle();
                    return false;
                });

                // Actions ----
                // Bookmark in NzbMatrix
                $("#ptchfrknzb-panel .bookmark a").click( function() {
                    var id = $(this).attr("id");
                    console.log("Ptchfrknzb: Bookmarking " + id);
                    chrome.extension.sendRequest({'action': 'doSearchApiRequest',
                        'url': nzbMatrix.getAddBookmarkRequest(id)}, function(rawResponse) {
                        var status = "";
                        var err = true;
                        rawResponse = rawResponse.trim().replace(/\n/g, "");
                        switch(rawResponse) {
                            case "error:invalid_login":
                                status = "There is a problem with the username you have provided.";
                                break;
                            case "error:invalid_api":
                                status = "There is a problem with the API Key you have provided."
                                break;
                            case "error:invalid_nzbid":
                                status = "There is a problem with the NZBid supplied.";
                                break;
                            case "error:vip_only":
                                status = "You need to be VIP or higher to access.";
                                break;
                            case "error:disabled_account":
                                status = "User Account Disabled.";
                                break;
                            case "error:no_nzb_found":
                                status = "No NZB found."
                                break;
                            case "RESULT:bookmark_added;":
                                status = "Bookmark Added!";
                                err = false;
                                break;
                            case "RESULT:bookmark_added_already;":
                                status = "Bookmark added already.";
                                err = false;
                                break;
                            case "RESULT:bookmark_not_found;":
                                status = "Bookmark not found.";
                                break;
                            case "RESULT:bookmark_removed;":
                                status = "Somehow you removed a bookmark. WTF?"
                                break;
                            default:
                                status = "Don't think that worked...";
                                err = true;
                        }
                        var statusEl = $("#ptchfrknzb-panel .results-list-row."+id+" .status");
                        var style = err? "error":"success";
                        statusEl.text(status).removeClass("error success").addClass(style);
                    });
                    return false;
                });

                // Download
                $("#ptchfrknzb-panel .download a").click( function() {
                    console.log("Ptchfrknzb: Queueing " + $(this).attr("href"));
                    return false;
                });
            }

        });
    }

});