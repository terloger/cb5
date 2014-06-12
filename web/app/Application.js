/**
 * Climbuddy application
 */
Ext.define('CB.Application', {
    extend: 'Ext.app.Application',
    
    name: 'CB',
    
    defaultToken: 'home',
    
    glyphFontFamily: 'climbuddy',
    
    requires: [
        'Ext.direct.RemotingProvider',
        'Ext.MessageBox',
        'CB.Config'
    ],
    
    views: [
        'main.Main',
        'home.Home',
        'map.Map',
        'location.Location',
        'locations.Locations',
        'user.User'
    ],
    
    waitFor: [
        'Location.read',
        'LocationType.read',
        'GradeType.read'
    ],
    
    init: function() {
        // initialize direct provider
        Ext.direct.Manager.addProvider(CB.init.API);
        
        // handle api errors
        Ext.direct.Manager.on({
            event: this.onDirectEvent,
            exception: this.onDirectException,
            scope: this
        });
        
        // initialize config
        CB.Config.init(CB.init.Config);
        
        // initialize user
        if (CB.init.User) {
            CB.User = Ext.create('CB.model.User', CB.init.User);
        }
    },
    
    launch: function() {
        Ext.getBody().mask('Loading ...');
    },
    
    onDataReady: function() {
        // remove direct event handler
        Ext.direct.Manager.un({
            event: this.onDirectEvent,
            scope: this
        });
        
        Ext.getBody().unmask();
        
        // fire application event
        this.fireEvent('dataready');
    },
    
    onDirectEvent: function(e, provider) {
        var event = e.action + '.' + e.method,
            index = this.waitFor.indexOf(event);

        if (index > -1) {
            this.waitFor.splice(index, 1);
            if (this.waitFor.length === 0) {
                this.onDataReady();
            }
        }
    },
    
    onDirectException: function(e) {
        Ext.Msg.show({
            title: 'Server Exception',
            msg: e.message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    
});
