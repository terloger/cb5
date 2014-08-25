/**
 * Location list
 */
Ext.define('CB.view.location.List', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Paging'
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
            cls: 'title',
            plugins: 'responsive',
            responsiveConfig: {
                'width < 500': {
                    hidden: true
                },
                'width >= 500': {
                    hidden: false
                }
            }
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
            },
            plugins: 'responsive',
            responsiveConfig: {
                'width < 500': {
                    width: 140
                },
                'width >= 500': {
                    width: 240
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
        emptyText: 'No locations',
        listeners: {
            itemdblclick: 'gridItemDblClick'
        },
        /*
        tbar: {
            xtype: 'pagingtoolbar',
            bind: {
                store: '{locations}'
            },
            dock: 'bottom',
            displayInfo: true
        },
        */
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
