/**
 * The main extension application.
 */
var Application = Toolbox.Base.extend({
    // Magic to get restore context in callbacks.
    instanceKey: "",
    
    settings: {},
    nzbMatrix: {},
    pitchfork: {},
    currentSearch: "",

    constructor: function(instanceKey){
        this.instanceKey = instanceKey;
    },

    init: function(settings){
        try {
            this.settings = settings;
            this.settings.app = this;
            this.nzbMatrix = new NzbMatrix(this.settings);
            this.pitchfork = new SiteFactory().getSite('pitchfork', this.settings);
        }catch(e){
            console.error("Ptchfrknzb: error initializing app.", e);
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
        var url = this.nzbMatrix.getSearchRequest(this.pitchfork.scrape());
        if(url){
            chrome.extension.sendRequest({'action': 'doSearchApiRequest', 'url': url, 'instanceKey': this.instanceKey},
                    this.handleSearchResults);
        }
    },

    handleSearchResults: function(response) {
        var instance = window[response.instanceKey];
        var results = instance.nzbMatrix.getSearchResult(response.data);
        if(results){
            instance.pitchfork.place(results);
        }
    }

});