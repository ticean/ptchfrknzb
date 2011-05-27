/**
 * Scrapes the page for the appropriate search.
 */
var Plugin = Toolbox.Base.extend({
    app: null,
    pluginId: null,
    settings: {
        nzbMatrix: {
            categoryId: null,
            maxResults: null
        }
    },

    /**
     * Sets a reference to the application.
     * @param initData
     */
    constructor: function(initData){
        if(initData){
            if(initData.app){
                this.app = initData.app;
            }
        }
    },

    /**
     * Scrapes the site for the search term.
     */
    scrape: function(){return;},

    /**
     * Places the results on the site.
     * @param data The results array.
     */
    place: function(data){return;}
});
