/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    
    
    showLocation: function(location) {
        console.log('showLocation', location);
        this.lookupReference('cb-paper').setLocation(location);
    }
});
