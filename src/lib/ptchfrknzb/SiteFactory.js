/**
 * Scrapes the page for the appropriate search.
 */
var SiteFactory = Toolbox.Base.extend({

    getSite: function(type, settings){
        var instance;
        switch(type) {
            case "pitchfork":
                instance = new Pitchfork(settings);
                break;
            default:
                throw("An invalid Site type was provided: " + type);
        }
        return instance;
    }
});
