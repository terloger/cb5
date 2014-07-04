/**
 * Locations view controller
 */
Ext.define('CB.view.locations.LocationsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-locations',
    
    gridItemDblClick: function(grid, record, item, index, e) {
        console.log('gridItemDblClick');
        this.redirectTo('location/' + record.get('id'));
    }
    
});
