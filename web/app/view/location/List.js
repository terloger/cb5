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
            text: 'Search:',
            cls: 'title'
        },{
            xtype: 'textfield',
            name: 'search',
            width: 240,
            itemId: 'searchField',
            selectOnFocus: true,
            cls: 'search-field',
            afterSubTpl: '<span class="search icon-zoom"></span><span class="clear icon-cross"></span>',
            listeners: {
                specialkey: 'searchSpecialKey',
                change: {
                    fn: 'search',
                    buffer: 350
                }
            }
        },{
            xtype: 'button',
            text: 'Filter',
            cls: 'filter-button',
            itemId: 'filterButton',
            glyph: 'xe646@climbuddy',
            handler: 'typePicker',
            menu: []
        },'->',{
            xtype: 'cb-user-headerbutton'
        }]
    },    
    
    items: [{
        xtype: 'grid',
        frame: true,
        bind: '{locations}',
        listeners: {
            itemdblclick: 'gridItemDblClick'
        },
        emptyText: 'No locations',
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
