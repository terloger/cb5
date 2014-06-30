/**
 * Locations view controller
 */
Ext.define('CB.view.locations.LocationsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-locations',
    
    onItemDblClick: function(grid, record, item, index, e) {
        console.log('onItemDblClick');
        this.redirectTo('location/' + record.get('id'));
    }
    
});
