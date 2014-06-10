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
    
    init: function() {
        // initialize direct provider
        Ext.direct.Manager.addProvider(CB.init.API);
        
        // handle api errors
        Ext.direct.Manager.on({
            exception: function(e) {
                Ext.Msg.show({
                    title: 'Server Exception',
                    msg: e.message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
        
        // initialize config
        CB.Config.init(CB.init.Config);
        
        // load stores
        //this.getStore('Countries').loadRawData(CB.init.Countries);
        //this.getStore('GradeTypes').loadRawData(CB.init.Grades);
        //this.getStore('Locations').loadRawData(CB.init.Locations);
        //this.getStore('LocationTypes').loadRawData(CB.init.LocationTypes);
    },
    
    launch: function () {
    }
    
});
