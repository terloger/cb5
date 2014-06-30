/**
 * Map view controller
 */
Ext.define('CB.view.map.MapController', {
    extend: 'Ext.app.ViewController',
    
    alias: 'controller.cb-map',
    
    config: {
        /**
         * Map
         */
        map: null,
        markers: null,
        overlay: null,
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
        Ext.destroyMembers(this, 'mapMenu', 'markerMenu', 'filterMenu');
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
        google.maps.event.addListener(this.getMap(),     'dragend',           Ext.bind(this.onMapDragEnd, this));
        google.maps.event.addListener(this.getMap(),     'zoom_changed',      Ext.bind(this.onMapZoomChanged, this));
        google.maps.event.addListener(this.getMap(),     'maptypeid_changed', Ext.bind(this.onMapTypeIdChanged, this));
        if (Ext.supports.Touch) {
            google.maps.event.addListener(this.getMap(), 'click',             Ext.bind(this.onMapRightClick, this));
        } else {
            google.maps.event.addListener(this.getMap(), 'click',             Ext.bind(this.onMapClick, this));
            google.maps.event.addListener(this.getMap(), 'rightclick',        Ext.bind(this.onMapRightClick, this));
        }
    },
    
    onResize: function(w, h) {
        if (this.getMap()) {
            google.maps.event.trigger(this.getMap(), 'resize');
            
            if (this.getLastCenter()) {
                this.getMap().setCenter(this.getLastCenter(), this.getZoom());
            }
        }
    },
    
    /**
     * Location
     */
    
    addLocation: function() {
        console.log('addLocation');
        var countries = this.getView().getViewModel().get('countries'),
            latLng = this.mapMenu.getEvent().latLng,
            lat = latLng.lat(),
            lng = latLng.lng(),
            country;
        
        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }
        
        this.geocoder.geocode({latLng: latLng}, Ext.bind(function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var iso = null;
                for (var i = 0, len = results.length; i < len; i++) {
                    var r = results[i];
                    for (var j = 0, len = r.address_components.length; j < len; j++) {
                        var c = r.address_components[j];
                        if (c.types.indexOf('country') > -1) {
                            iso = c.short_name;
                            break;
                        }
                    }
                    if (iso) break;
                }
                
                country = countries.getAt(countries.find('iso', iso));
                if (country) {
                    this.fireEvent('addlocation', country, lat, lng);
                    return;
                }
            }
            
            Ext.Msg.alert('Error', 'Unable to fetch country name!');
        }, this));
    },
    
    openLocation: function() {
        var location = this.markerMenu.getLocation();
        
        if (!location) {
            return;
        }
        
        this.redirectTo('location/' + location.get('id'));
    },
    
    moveLocation: function() {
        console.log('move location');
    },
    
    deleteLocation: function() {
        console.log('delete location');
    },
    
    /**
     * Map
     */
    
    refreshMap: function() {
        console.log('refresh map');
    },
    
    onMapReady: function() {
        var me = this,
            store = me.getView().getViewModel().get('locations'),
            showMarkers = function() {
                store.each(function(location, index){
                    var hasFiles = location.files().getCount() > 0,
                        latLng = new google.maps.LatLng(location.get('lat'), location.get('lng')),
                        type = location.types().getAt(0),
                        icon = type ? type.get('type') : 'default',
                        drop = false;
                        
                        console.log(location.types().getCount(), location);
                        
                    //if (hasFiles) {
                        this.addMarker(latLng, location, icon, drop);
                    //}
                }, this);
            };
        
        // show markers immediately or on store load
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
        
        // create map overlay
        this.setOverlay(new google.maps.OverlayView());
        this.getOverlay().setMap(this.getMap());
        this.getOverlay().draw = function(){
            if (!this.ready) {
                this.ready = true;
                google.maps.event.trigger(this, 'ready');
            }
        };
    },
    
    onMapClick: function(e) {
        console.log('onMapClick');
    },
    
    onMapRightClick: function(e) {
        var view = this.getView(),
            menu = this.mapMenu;
        
        if (!menu) {
            this.mapMenu = menu = view.add(view.mapMenu);
        }
        
        menu.setEvent(e);
        
        menu.showAt(this.getLatLngLocalXY(e.latLng));
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
        console.log('getMapTypeId');
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
    
    getLatLngXY: function(latLng) {
        if (!latLng) return [0,0];
        
        var overlay = this.getOverlay(),
            projection,
            pixel,
            box;
        
        if (!overlay.ready) {
            return [0,0];
        }
    
        projection = overlay.getProjection();
        pixel = projection.fromLatLngToContainerPixel(latLng);
        box = this.getView().body.getBox();

        return [pixel.x + box.x, pixel.y + box.y];
    },
    
    getLatLngLocalXY: function(latLng) {
        if (!latLng) return [0,0];
        
        var overlay = this.getOverlay(),
            projection,
            pixel;
    
        if (!overlay || !overlay.ready) {
            return [0,0];
        }
        
        projection = overlay.getProjection();
        pixel = projection.fromLatLngToContainerPixel(latLng);
        
        return [pixel.x, pixel.y];
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
        console.log('onMarkerClick');
        var location = marker.getLocation();
        if (location) {
            this.redirectTo('location/' + location.get('id'));
            //this.fireEvent('markerclick', marker, location, e);
        }
    },
    
    onMarkerRightClick: function(e, marker) {
        var view = this.getView(),
            menu = this.markerMenu,
            location = marker ? marker.getLocation() : null;
    
        if (!marker || !location) {
            return;
        }
        
        if (!menu) {
            this.markerMenu = menu = view.add(view.markerMenu);
        }
        
        menu.setMarker(marker);
        menu.setLocation(location);
        menu.setEvent(e);
        
        menu.showAt(this.getLatLngLocalXY(e.latLng));
    },
    
    onMarkerDragEnd: function(e, marker) {
        console.log('onMarkerDragEnd');
        var location = marker.getLocation();
        if (location) {
            this.fireEvent('markerdragend', marker, location, e);
        }
    },
    
    /**
     * Toolbar
     */
    
    onSearch: function(btn, e) {
        console.log('search');
    },
    
    showFilterMenu: function(btn, e) {
        console.log('onFilterButtonClick');
        var view = this.getView(),
            viewModel = view.getViewModel(),
            menu = this.filterMenu;

        if (!menu) {
            menu = {
                xtype: 'menu',
                items: [],
                listeners: {
                    click: this.onFilterMenuItemClick,
                    scope: this
                }
            };
            viewModel.get('locationTypes').each(function(type){
                menu.items.push({
                    xtype: 'menucheckitem',
                    text: type.get('name'),
                    type: type.get('type'),
                    checked: true
                });
            }, this);
            
            this.filterMenu = menu = view.add(menu);
            btn.setMenu(menu);
        }
        
        btn.showMenu();
    },
    
    onFilterMenuItemClick: function(menu, item, e) {
        console.log('onFilterMenuItemClick');
    }
    
});
