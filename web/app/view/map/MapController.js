/**
 * Map view controller
 */
Ext.define('CB.view.map.MapController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-map',
    
    config: {
        map: null,
        markers: null,
        weatherLayer: null,
        markerClusterer: null,
        mapType: 'roadmap',
        zoom: 5,
        center: {
            lat: 46.088472,
            lng: 14.644775
        },
        lastCenter: null
    },
    
    /**
     * Core
     */
    
    destroy: function () {
        Ext.destroyMembers(this, 'filterMenu');
        this.callParent();
    },
    
    onAfterRender: function() {
        // no google api available
        if (typeof google === 'undefined') {
            return;
        }
        
        // create map
        this.setMap(new google.maps.Map(this.getView().body.dom, {
            zoom: this.getZoom(),
            mapTypeId: this.getMapTypeId()
        }));
        
        // create markers collection
        this.setMarkers(Ext.create('Ext.util.MixedCollection'));
        
        // set map center
        var latLng = new google.maps.LatLng(this.getCenter().lat, this.getCenter().lng);
        this.getMap().setCenter(latLng, this.getZoom());
        this.setLastCenter(latLng);
        
        // attach map listeners
        google.maps.event.addListenerOnce(this.getMap(), 'tilesloaded',       Ext.bind(this.onMapReady, this));
        google.maps.event.addListener(this.getMap(),     'click',             Ext.bind(this.onMapClick, this));
        google.maps.event.addListener(this.getMap(),     'rightclick',        Ext.bind(this.onMapRightClick, this));
        google.maps.event.addListener(this.getMap(),     'dragend',           Ext.bind(this.onMapDragEnd, this));
        google.maps.event.addListener(this.getMap(),     'zoom_changed',      Ext.bind(this.onMapZoomChanged, this));
        google.maps.event.addListener(this.getMap(),     'maptypeid_changed', Ext.bind(this.onMapTypeIdChanged, this));
    },
    
    onResize: function(w, h) {
        if (typeof this.getMap() === 'object') {
            google.maps.event.trigger(this.getMap(), 'resize');
            
            if (this.getLastCenter()) {
                this.getMap().setCenter(this.getLastCenter(), this.getZoom());
            }
        }
    },
    
    /**
     * Map
     */
    
    onMapReady: function() {
        var me = this,
            store = me.getView().getViewModel().getParent().getStore('locations'),
            showMarkers = function() {
                store.each(function(location){
                    var hasFiles = location.files().getCount() > 0,
                        latLng = new google.maps.LatLng(location.get('lat'), location.get('lng')),
                        type = location.types().getAt(0),
                        icon = type ? type.get('type') : 'default',
                        drop = true;
                        
                    if (hasFiles) {
                        this.addMarker(latLng, location, icon, drop);
                    }
                }, this);
            };
        
        if (store.isLoaded()) {
            showMarkers.apply(this);
        } else {
            store.on({
                load: {
                    fn: showMarkers,
                    scope: this,
                    single: true
                }
            });
        }
    },
    
    onMapClick: function(e) {
        console.log('onMapClick');
    },
    
    onMapRightClick: function(e) {
        console.log('onMapRightClick');
    },
    
    onMapZoomChanged: function() {
        console.log('onMapZoomChanged');
    },
    
    onMapTypeIdChanged: function() {
        console.log('onMapTypeIdChanged');
    },
    
    onMapDragEnd: function() {
        this.setLastCenter(this.getMap().getCenter());
        console.log('onMapDragEnd');
    },
    
    getMapTypeId: function() {
        switch (this.getMapType()) {
            default:
            case 'roadmap':
                return google.maps.MapTypeId.ROADMAP;
            case 'hybrid':
                return google.maps.MapTypeId.HYBRID;
            case 'satellite':
                return google.maps.MapTypeId.SATELLITE;
            case 'terrain':
                return google.maps.MapTypeId.TERRAIN;
        }
    },
    
    /**
     * Marker
     */
    
    addMarker: function(latLng, location, icon, drop) {
        // create new marker
        var marker = new google.maps.Marker({
            position: latLng,
            lat: location.get('lat'),
            lng: location.get('lng'),
            title: location.get('name'),
            icon: 'resources/types/' + icon + '.png',
            shadow: 'resources/types/shadow.png'
        });
        
        // create marker location getter
        marker.getLocation = function() {
            return location;
        };

        // drop it to map?
        if (drop) {
            marker.setAnimation(google.maps.Animation.DROP);
        }

        // add reference to location record
        location.setMarker(marker);

        // add reference to collection
        this.getMarkers().add(location.get('id'), marker);

        // show on map
        marker.setMap(this.getMap());

        // add event listeners
        google.maps.event.addListener(marker, 'click',      Ext.bind(this.onMarkerClick, this, [marker], true));
        google.maps.event.addListener(marker, 'rightclick', Ext.bind(this.onMarkerRightClick, this, [marker], true));
        google.maps.event.addListener(marker, 'dragend',    Ext.bind(this.onMarkerDragEnd, this, [marker], true));

        // return instance
        return marker;
    },

    removeMarker: function(marker) {
        if (marker) {
            // remove from marker clusterer
            this.markerClusterer.removeMarker(marker);

            // remove events
            google.maps.event.clearListeners(marker, 'click');
            google.maps.event.clearListeners(marker, 'rightclick');
            google.maps.event.clearListeners(marker, 'dragend');

            // remove from map
            marker.setMap(null);

            // remove from collection
            this.getMarkers().remove(marker);
        }
    },
    
    onMarkerClick: function(e, marker) {
        var location = marker.getLocation();
        if (location) {
            this.fireEvent('markerclick', marker, location, e);
        }
    },
    
    onMarkerRightClick: function(e, marker) {
        var location = marker.getLocation();
        if (location) {
            this.fireEvent('markerrightclick', marker, location, e);
        }
    },
    
    onMarkerDragEnd: function(e, marker) {
        var location = marker.getLocation();
        if (location) {
            this.fireEvent('markerdragend', marker, location, e);
        }
    },
    
    /**
     * Toolbar
     */
    
    createFilterMenu: function(btn, e) {
        var menu = this.filterMenu;

        if (!menu) {
            menu = {
                items: [],
                listeners: {
                    click: this.onFilterMenuClick
                }
            };
            this.getStore('LocationTypes').each(function(type){
                menu.items.push({
                    xtype: 'menucheckitem',
                    text: type.get('name'),
                    type: type.get('type'),
                    checked: true
                });
            }, this);
            
            this.filterMenu = menu = Ext.create('Ext.menu.Menu', menu);
            
            btn.setMenu(menu);
        }

        btn.showMenu();
    },
    
    onFilterMenuClick: function() {
        console.log('onFilterMenuClick');
    },
    
    onSearch: function(btn, e) {
        console.log('search');
    }
    
});
