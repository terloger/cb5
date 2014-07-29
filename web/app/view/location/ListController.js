/**
 * Location list view controller
 */
Ext.define('CB.view.location.ListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-list',
    
    gridItemDblClick: function(grid, record, item, index, e) {
        this.redirectTo('location/' + record.get('id'));
    }
    
});
