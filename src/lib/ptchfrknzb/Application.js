/**
 * The main extension application.
 */
var Application = Toolbox.Base.extend({
    // Magic to get restore context in callbacks.
    instanceKey: "",
    
    settings: {},
    nzbMatrix: {},
    plugin: {},
    currentSearch: "",

    constructor: function(instanceKey){
        this.instanceKey = instanceKey;
    },

    init: function(settings){
        try {
            this.settings = settings;
            this.settings.app = this;
            this.nzbMatrix = new NzbMatrix(this.settings);
            this.plugin = new PluginFactory().loadByType('pitchfork', this.settings);
        }catch(e){
            console.error("Ptchfrknzb: error initializing app.", e);
            return;
        }
        this.doSearch();
    },

    // Dedicated init callback to allow for loading outside Chrome extension environment.
    initCallback: function(response) {
        var instanceKey = response.instanceKey;
        var settings = response.settings;
        var instance = window[instanceKey];
        instance.init(settings);
    },

    loadConfig: function(config){
        var self = this;
        if(config){
            if(config.key && config.username){
                this.init(config);
            }
        } else {
            chrome.extension.sendRequest({'action': 'getSettings', 'instanceKey': this.instanceKey}, this.initCallback);
        }
    },

    doSearch: function() {
        var params, url, needle;
        needle = this.plugin.scrape();
        params = {
            needle: needle,
            categoryId: this.plugin.settings.nzbMatrix.categoryId,
            maxResults: this.plugin.settings.nzbMatrix.maxResults
        };

        try {
            url = this.nzbMatrix.getSearchRequest(params);
            if(url){
                chrome.extension.sendRequest({'action': 'doSearchApiRequest', 'url': url, 'instanceKey': this.instanceKey, 'needle': needle},
                        this.handleSearchResults);
            }
        } catch(e) {
            console.error("Ptchfrknzb: Exception while searching: " + e);
        }
    },

    handleSearchResults: function(response) {
        var instance = window[response.instanceKey];
        var results = instance.nzbMatrix.getSearchResult(response.data);
        if(results){
            chrome.extension.sendRequest({'action': 'showPageAction', 'instanceKey': this.instanceKey}, function(){
                var foo = 'bar';
            });
            //instance.plugin.place(results);
        } else {
            //show no-results icon.
        }
    }

});