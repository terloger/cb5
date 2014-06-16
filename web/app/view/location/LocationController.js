/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    showLocation: function(location) {
        var view = this.getView(),
            paper = this.lookupReference('cb-paper');
        
        if (view.rendered) {
            paper.setLocation(location);
        } else {
            view.on({
                afterrender: function() {
                    paper.setLocation(location);
                }
            });
        }
    }
});
