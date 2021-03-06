/**
 * Map view
 */
Ext.define('CB.view.map.Map', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.util.MixedCollection',
        'Ext.form.field.Text',
        'CB.view.location.TypePicker',
        'CB.view.map.SearchMenu'
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
    cls: 'cb-map',
    
    stateful: true,
    stateId: 'CB.view.map.Map',
    
    config: {
        map: null,
        mapTypeId: 'roadmap',
        zoom: 5,
        center: {
            lat: 46.088472,
            lng: 14.644775
        }
    },
    
    tbar: {
        ui: 'header',
        height: 46,
        layout: {
            overflowHandler: 'scroller'
        },
        items: [{
            xtype: 'tbtext',
            text: 'Search: ',
            cls: 'title',
            margin: '0 5 0 0',
            plugins: 'responsive',
            responsiveConfig: {
                'width < 540': {
                    hidden: true
                },
                'width >= 540': {
                    hidden: false
                }
            }
        },{
            xtype: 'textfield',
            name: 'search',
            width: 240,
            //margin: '0 -1 0 0',
            itemId: 'searchField',
            selectOnFocus: true,
            cls: 'search-field',
            afterSubTpl: '<span class="search icon-zoom"></span><span class="clear icon-cross"></span>',
            listeners: {
                specialkey: 'searchSpecialKey',
                focus: 'searchFocus',
                click: {
                    element: 'el',
                    fn: 'searchClick'
                },
                change: {
                    fn: 'search',
                    buffer: 500
                }
            },
            plugins: 'responsive',
            responsiveConfig: {
                'width < 540': {
                    width: 140
                },
                'width >= 540': {
                    width: 240
                }
            }
        },/*{
            xtype: 'button',
            handler: 'searchButtonClick',
            itemId: 'searchButton',
            glyph: 'xe63d@climbuddy',
            style: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
            }
        },*/{
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
    
    listeners: {
        afterrender: 'createMap',
        resize: 'resizeMap',
        scope: 'controller'
    },
    
    mapMenu: {
        xtype: 'menu',
        items: [{
            text: 'Map',
            baseCls: 'x-menu-title',
            hideOnClick: false
        },/*{
            text: 'Refresh',
            handler: 'refreshMap',
            glyph: 'xe61d@climbuddy'
        },'-',*/{
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
            text: '',
            baseCls: 'x-menu-title',
            hideOnClick: false
        },{
            text: 'Open location',
            handler: 'openLocation',
            glyph: 'xe605@climbuddy'
        },{
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
    },
    
    applyState: function(state) {
        if (state) {
            Ext.apply(this, state);
        }
    },

    getState: function() {
        var map = this.getMap(),
            state = {};
            
        if (map) {
            state.mapTypeId = map.getMapTypeId();
            state.zoom = map.getZoom();
            state.center = {
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng()
            };
        }
        
        return state;
    }
    
});
