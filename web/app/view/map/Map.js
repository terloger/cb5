/**
 * Map view
 */
Ext.define('CB.view.map.Map', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.util.MixedCollection',
        'Ext.form.field.Text'
    ],
    
    xtype: 'cb-map',
    
    controller: 'cb-map',
    
    viewModel: {
        type: 'cb-map'
    },
    
    layout: {
        type: 'fit'
    },
    
    title: 'Map',
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Search: ',
            cls: 'title',
            margin: '0 5 0 0'
        },{
            xtype: 'textfield',
            name: 'search',
            margin: '0 -1 0 0'
        },{
            xtype: 'button',
            handler: 'search',
            glyph: 'xe63d@climbuddy',
            style: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
            }
        },{
            xtype: 'button',
            text: 'Filter',
            glyph: 'xe646@climbuddy',
            menu: [],
            listeners: {
                click: {
                    fn: 'showFilterMenu',
                    single: true
                }
            }
        }]
    },
    
    listeners: {
        afterrender: 'onAfterRender',
        resize: 'onResize',
        scope: 'controller'
    },
    
    mapMenu: {
        xtype: 'menu',
        items: [{
            text: 'Refresh',
            handler: 'refreshMap',
            glyph: 'xe61d@climbuddy'
        },'-',{
            text: 'Add location',
            handler: 'addLocation',
            glyph: 'xe618@climbuddy'
        }],
        getEvent: function() { return this.event; },
        setEvent: function(event) { this.event = event; }
    },
    
    markerMenu: {
        xtype: 'menu',
        items: [{
            text: 'Open location',
            handler: 'openLocation',
            glyph: 'xe605@climbuddy'
        },'-',{
            text: 'Move location',
            handler: 'moveLocation',
            glyph: 'xe63a@climbuddy'
        },'-',{
            text: 'Delete location',
            handler: 'deleteLocation',
            glyph: 'xe61e@climbuddy'
        }],
        getMarker: function() { return this.marker; },
        setMarker: function(marker) { this.marker = marker; },
        getLocation: function() { return this.location; },
        setLocation: function(location) { this.location = location; },
        getEvent: function() { return this.event; },
        setEvent: function(event) { this.event = event; }
    }
    
});
