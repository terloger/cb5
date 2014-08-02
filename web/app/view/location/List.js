/**
 * Location list
 */
Ext.define('CB.view.location.List', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.grid.Panel'
    ],
    
    xtype: 'cb-location-list',
    
    controller: 'cb-location-list',
    
    layout: {
        type: 'fit'
    },
    
    title: 'Locations',
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        height: 46,
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
                return location.getFiles().getCount();
            }
        },{
            text: 'Country',
            renderer: function(value, meta, location) {
                return location.getCountry().get('name');
            }
        }]
    }]

});
