/**
 * NzbMatrix.
 * Doing NzBizness.
 */
var NzbMatrix = Toolbox.Base.extend({
    key: '',
    username: '',
    baseUrl: 'https://api.nzbmatrix.com/v1.1/',

    constructor: function(options) {
        this.key = options.api_key;
        this.username = options.api_username;
    },

    getAddBookmarkRequest: function(id) {
        if(id == "") return false;
        var url = encodeURI(this.baseUrl + "bookmarks.php?username=" + this.username + "&apikey=" + this.key + "&action=add" +
                "&id=" + id);
        console.log("Ptchfrknzb: SearchAPI Request: " + url);
        return url;
    },

    getSearchRequest: function(params) {
        var catid, maxhits, url;
        if(_.isUndefined(params)) throw("Search params not provided.");
        if(!_.isString(params.needle)) return false;
        catid = _.isNumber(params.categoryId)? "&catid=" + params.categoryId : "";
        maxhits = _.isNumber(params.maxResults)? "&maxhits=" + params.maxResults : "";

        url = this.baseUrl + "search.php?username=" + this.username + "&apikey=" + this.key + "&search=" + params.needle;
        url += catid;
        url += maxhits
        url = encodeURI(url);

        console.log("Ptchfrknzb: SearchAPI Request: " + url);
        return url;
    },

    parseSearchData: function(data){
        if(data == '' || data === undefined) return false;
        var records = [];
        var data = jQuery.trim(data.substring(0, data.length-1));
        var results = data.split('|');
        for(var i in results) {
            var pairs = [];
            if(i<results.length-1) {
                var nvPairs = results[i].split(';');
                for(var k in nvPairs) {
                    if(k<nvPairs.length-2) {
                        var nv = nvPairs[k].split(':');
                        var key = jQuery.trim(nv[0]);
                        var val = jQuery.trim(nv[1]).replace(/\n/g, "");
                        if(key == "NZBID" || key == "NZBNAME" || key == "SIZE" || key == "LINK" || key == "IMAGE"){
                            pairs.push('"' + key + '": "' + val + '"');
                        }
                    }
                }
                records.push('{' + pairs.join(',') + '}');
            }
        }
        var json = '{"results": [' + records.join(',') + ']}';
        return json;
    },

    /**
     * Parse the response from a bookmark attempt.
     */
    parseBookmarkResponse: function(data){
        var status, error;

        data = data.trim().replace(/\n/g, "");
        error = true;
        switch(data) {
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
                error = false;
                break;
            case "RESULT:bookmark_added_already;":
                status = "Bookmark added already.";
                error = false;
                break;
            case "RESULT:bookmark_not_found;":
                status = "Bookmark not found.";
                break;
            case "RESULT:bookmark_removed;":
                status = "Somehow you removed a bookmark. WTF?"
                break;
            default:
                status = "API error... ;ofrk.";
        }
        return {error: error, status: status};
    },

    getSearchResult: function(data) {
        try {
            var json = this.parseSearchData(data);
            return jQuery.parseJSON(json);
        } catch(e) {
            console.log("Can't parse search results.", e);
            return false;
        }
    }
});