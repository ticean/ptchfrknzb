/**
 * NzbMatrix.
 * Doing NzBizness.
 */
var NzbMatrix = Toolbox.Base.extend({
    key: '',
    username: '',
    baseUrl: 'https://api.nzbmatrix.com/v1.1/',
    categoryId: '22',
    maxResults: '10',

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

    getSearchRequest: function(needle) {
        if(needle == "") return false;
        var url = encodeURI(this.baseUrl + "search.php?username=" + this.username + "&apikey=" + this.key + "&catid=" +
                this.categoryId + "&maxhits=" + this.maxResults + "&search=" + needle);
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