/**
 * Loads plugins of appropriate type.
 */
var PluginFactory = Toolbox.Base.extend({

    loadByType: function(type, settings){
        var instance;
        switch(type) {
            case "pitchfork":
                instance = new Pitchfork(settings);
                break;
            default:
                throw("Exception creating invalid plugin type " + type);
        }
        return instance;
    }
});
