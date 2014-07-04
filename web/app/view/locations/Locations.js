/**
 * Locations view
 */
Ext.define('CB.view.locations.Locations', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.grid.Panel'
    ],
    
    xtype: 'cb-locations',
    
    controller: 'cb-locations',
    
    layout: {
        type: 'fit'
    },
    
    title: 'Locations',
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Locations',
            cls: 'title'
        }]
    },    
    
    items: [{
        xtype: 'grid',
        frame: true,
        bind: '{locations}',
        listeners: {
            itemdblclick: 'gridItemDblClick'
        },
        columns: [{
            text: 'Name',
            dataIndex: 'name',
            width: 200
        },{
            text: 'Description',
            dataIndex: 'description',
            flex: 1
        },{
            text: 'Routes',
            renderer: function(value, meta, location) {
                return location.routes().getCount();
            }
        },{
            text: 'Files',
            renderer: function(value, meta, location) {
                return location.files().getCount();
            }
        },{
            text: 'Country',
            renderer: function(value, meta, location) {
                return location.getCountry().get('name');
            }
        }]
    }]

});
