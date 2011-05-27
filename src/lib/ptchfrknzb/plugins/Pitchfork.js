/**
 * Scrapes the page for the appropriate search.
 */
var Pitchfork = Plugin.extend({

    pluginId: 'pitchfork',
    
    settings: {
        nzbMatrix: {
            categoryId: 22,
            maxResults: 20
        }
    },

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
        var app = this.app;
        $("#ptchfrknzb-panel .bookmark a").click( function() {
            var id = $(this).attr("id");
            chrome.extension.sendRequest({'action': 'doSearchApiRequest', 'url': app.nzbMatrix.getAddBookmarkRequest(id),
                instanceKey: app.instanceKey}, function(response) {
                    var data  = app.nzbMatrix.parseBookmarkResponse(response.data);
                    var style = data.error? "error":"success";
                    var el = $("#ptchfrknzb-panel .results-list-row."+id+" .status");
                    el.text(data.status).removeClass("error success").addClass(style);
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
