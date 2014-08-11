Ext.define('CB.view.location.Sidebar', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.layout.container.Card',
        'CB.view.location.Routes',
        'CB.view.location.Route',
        'CB.view.location.MiniMap'
    ],
    
    xtype: 'cb-location-sidebar',
    
    cls: 'cb-location-sidebar',
    
    stateful: true,
    stateId: 'CB.view.location.Sidebar',

    dock: 'right',
    height: 'auto',
    
    layout: {
        type: 'border'
    },
    
    title: {
        xtype: 'title',
        text: 'Routes',
        ariaRole: 'presentation',
        flex: 0
    },
    
    header: {
        xtype: 'header',
        items: [{
            xtype: 'toolbar',
            ui: 'blank',
            flex: 1,
            items: [{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Add route',
                glyph: 'xe618@climbuddy',
                handler: 'addRoute',
                hidden: true,
                bind: {
                    hidden: '{!user}'
                }
            },{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Remove selected routes',
                glyph: 'xe619@climbuddy',
                handler: 'removeRoute',
                hidden: true,
                bind: {
                    hidden: '{!user}'
                }
            }]
        }]
    },
    
    items: [{
        xtype: 'panel',
        region: 'center',
        layout: {
            type: 'card'
        },
        activeItem: 0,
        items: [{
            xtype: 'cb-location-routes'
        },{
            xtype: 'cb-location-route'
        }]
    },{
        xtype: 'cb-location-minimap',
        region: 'south',
        height: 240,
        minHeight: 160,
        maxHeight: 360,
        collapsible: true,
        split: {
            size: 5
        }
    }]

});
    