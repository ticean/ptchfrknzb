/**
 * Scrapes the page for the appropriate search.
 */
var Pitchfork = Site.extend({

    siteKey: null,
    app: null,

    constructor: function(settings){
        if(settings){
            if(settings.app){
                this.app = settings.app;
            }
        }
    },

    /**
     * Scrapes the search terms from the site.
     */
    scrape: function(){
        return $(".artists").text().trim();
    },

    /**
     * Places the results on the site.
     * @param data The results array.
     */
    place: function(data){
        var rows = "";
        if(data.results){
            if(data.results.length>0) {
                for(i in data.results) {
                    rows += "<div class=\"results-list-row " + data.results[i].NZBID + "\">" +
                        "<div class='name'>" + data.results[i].NZBNAME + "</div>" +
                        "<div class=\"action " + data.results[i].NZBID + "\">" +
                            "<span class=bookmark><a id=\"" + data.results[i].NZBID + "\" href=#>Bookmark</a></span>" +
                            //"<span class=download><a href=\"https://" + record[i].LINK + "\" >Download</a></span>" +
                            "<span class=size>(" + formatBytes(data.results[i].SIZE) + ")</span>" +
                            "<span class=status></span>" +
                        "</div>" +
                    "</div>";
                }
            } else {
                rows = "No results found.";
            }
        }

        var flagImg = (data.results.length>0)? "images/flag_trans.png":"images/flag_nr.png";
        var flag = "<div id=ptchfrknzb-flag>" +
                    "<img class=ptchfrknzb-icon src=\"" + chrome.extension.getURL(flagImg) + "\"'/>" +
                "</div>";
        var panel = "<div id=ptchfrknzb-panel>" +
                    "<div class=header>" +
                        "<div id=info>Ptchfrknzb searched NzbMatrix:</div>" +
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
