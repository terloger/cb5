Ext.define('CB.Config', {
    singleton: true,
    
    config: {},

    init: function(config) {
        this.config = config || {};
    },
    
    get: function(key) {
        return this.config[key];
    }

});
