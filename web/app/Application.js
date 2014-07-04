/**
 * Climbuddy application
 */
Ext.define('CB.Application', {
    extend: 'Ext.app.Application',
    
    name: 'CB',
    
    defaultToken: 'home',
    
    glyphFontFamily: 'climbuddy',
    
    requires: [
        'Ext.state.CookieProvider',
        'Ext.direct.RemotingProvider',
        'Ext.MessageBox',
        'CB.Config'
    ],
    
    views: [
        'main.Main',
        'home.Home',
        'map.Map',
        'locations.Locations',
        'location.Location',
        'location.Add',
        'user.User',
        'user.Login',
        'user.Home'
    ],
    
    waitFor: [
        'Country.read',
        'Location.read',
        'LocationType.read',
        'GradeType.read'
    ],
    
    init: function() {
        // initialize state provider
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
            expires: new Date(new Date().getTime()+(1000*60*60*24*30))
        }));
        
        // initialize direct provider
        Ext.direct.Manager.addProvider(CB.init.API);
        
        // handle api errors
        Ext.direct.Manager.on({
            event: this.onDirectEvent,
            exception: this.onDirectException,
            scope: this
        });
    },
    
    launch: function() {
        Ext.getBody().mask('Loading application ...');
    },
    
    onDataReady: function() {
        // remove direct event handler
        Ext.direct.Manager.un({
            event: this.onDirectEvent,
            scope: this
        });
        
        Ext.getBody().unmask();
        
        /*
        var intro = Ext.get('cb-intro');
        if (intro) {
            intro.fadeOut({
                opacity: 0,
                easing: 'easeOut',
                duration: 200,
                remove: true
            });
        }
        */
        
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
