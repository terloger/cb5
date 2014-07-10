/**
 * Location list view controller
 */
Ext.define('CB.view.location.ListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-list',
    
    gridItemDblClick: function(grid, record, item, index, e) {
        console.log('gridItemDblClick');
        this.redirectTo('location/' + record.get('id'));
    }
    
});
