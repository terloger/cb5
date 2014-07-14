/**
 * Map view controller
 */
Ext.define('CB.view.map.MapController', {
    extend: 'Ext.app.ViewController',
    
    alias: 'controller.cb-map',
    
    listen: {
        controller: {
            '*': {
                createlocation: 'createLocation'
            }
        }
    },
    
    config: {
        map: null,
        markers: null,
        overlay: null,
        markerClusterer: null,
        lastCenter: null
    },
    
    /**
     * Core
     */
    
    createMap: function() {
        // no google available
        if (typeof google === 'undefined') {
            this.getView().add({
                xtype: 'container',
                style: 'padding: 0 1em',
                html: '<p>Looks like Google Maps services are not available at the moment.</p>'
            });
            return;
        }
        
        var me = this,
            view = me.getView(),
            map = new google.maps.Map(view.body.dom, {
                zoom: view.getZoom(),
                mapTypeId: view.getMapTypeId()
            }),
            center = new google.maps.LatLng(view.getCenter().lat, view.getCenter().lng),
            markers = Ext.create('Ext.util.MixedCollection');
            
        // set map reference on controller and view
        me.setMap(map);
        view.setMap(map);
        
        // set map center
        map.setCenter(center, view.getZoom());
        me.setLastCenter(center);
        
        // set markers reference
        me.setMarkers(markers);
        
        // handle map events
        google.maps.event.addListenerOnce(map, 'tilesloaded',       Ext.bind(me.mapReady, me));
        google.maps.event.addListener(map,     'dragend',           Ext.bind(me.mapDragEnd, me));
        google.maps.event.addListener(map,     'zoom_changed',      Ext.bind(me.mapZoomChanged, me));
        google.maps.event.addListener(map,     'maptypeid_changed', Ext.bind(me.mapTypeIdChanged, me));
        if (Ext.supports.Touch) {
            google.maps.event.addListener(map, 'click',             Ext.bind(me.mapRightClick, me));
        } else {
            google.maps.event.addListener(map, 'click',             Ext.bind(me.mapClick, me));
            google.maps.event.addListener(map, 'rightclick',        Ext.bind(me.mapRightClick, me));
        }
    },
    
    resizeMap: function(w, h) {
        if (this.getMap()) {
            google.maps.event.trigger(this.getMap(), 'resize');
            
            if (this.getLastCenter()) {
                this.getMap().setCenter(this.getLastCenter(), this.getView().getZoom());
            }
        }
    },
    
    mapReady: function() {
        var me = this,
            store = me.getView().getViewModel().get('locations'),
            showMarkers = function() {
                store.each(function(location, index){
                    var latLng = new google.maps.LatLng(location.get('lat'), location.get('lng')),
                        type = location.types().getAt(0),
                        icon = type ? type.get('type') : 'default',
                        drop = false;
                        
                    if (location.files().getCount() >= 0) {
                        this.addMarker(latLng, location, icon, drop);
                    }
                }, this);
            };
            
        // create map overlay
        this.setOverlay(new google.maps.OverlayView());
        this.getOverlay().setMap(this.getMap());
        this.getOverlay().draw = function(){
            if (!this.ready) {
                this.ready = true;
                google.maps.event.trigger(this, 'ready');
            }
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
    },
    
    destroy: function () {
        Ext.destroyMembers(this, 'mapMenu', 'markerMenu', 'filterMenu');
        this.callParent();
    },
    
    /**
     * Location
     */
    
    createLocation: function(location) {
        console.log('createLocation', location);
        var view = this.getView(),
            vm = view.getViewModel(),
            locations = vm.get('locations'),
            latLng = new google.maps.LatLng(location.get('lat'), location.get('lng')),
            type = location.types().getAt(0),
            icon = type ? type.get('type') : 'default',
            drop = true,
            delay = 250;
    
        locations.add(location);

        if (location.files().getCount() >= 0) {
            this.addMarker(latLng, location, icon, drop, delay);
        }
    },
    
    addLocation: function() {
        console.log('addLocation', this.mapMenu.getEvent().latLng);
        var countries = this.getView().getViewModel().get('countries'),
            latLng = this.mapMenu.getEvent().latLng,
            lat = latLng.lat(),
            lng = latLng.lng(),
            country;
        
        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }
        
        this.geocoder.geocode({latLng: latLng}, Ext.bind(function(results, status) {
            var iso = null,
                name = null;
                
            console.log('status', status);
            console.log('results', results);
            
            if (status === google.maps.GeocoderStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    var r = results[i];
                    for (var j = 0, len = r.address_components.length; j < len; j++) {
                        var c = r.address_components[j];
                        if (c.types.indexOf('country') > -1) {
                            iso = c.short_name;
                            name = c.long_name;
                            break;
                        }
                    }
                    if (iso) break;
                }
                
                country = countries.getAt(countries.find('iso', iso));
                if (country) {
                    this.fireEvent('addlocation', country, lat, lng);
                    return;
                } else {
                    Ext.Msg.alert('Error', 'Country ' + name + ' (' + iso + ') is not yet supported. Please ask system administrator to add it.s');
                    return;
                }
            }
            
            country = countries.getAt(countries.find('iso', 'NONE'));
            this.fireEvent('addlocation', country, lat, lng);
            
        }, this));
    },
    
    openLocation: function() {
        console.log('openLocation', this.markerMenu.getLocation());
        var location = this.markerMenu.getLocation();
        
        if (!location) {
            return;
        }
        
        this.redirectTo('location/' + location.get('id'));
    },
    
    moveLocation: function() {
        console.log('moveLocation', this.markerMenu.getLocation());
        var marker = this.markerMenu.getMarker();
        
        if (marker) {
            marker.setDraggable(true);
        }
    },
    
    deleteLocation: function() {
        console.log('deleteLocation', this.markerMenu.getLocation());
        var location = this.markerMenu.getLocation(),
            marker = this.markerMenu.getMarker();
    
        Ext.Msg.confirm('Are you sure?', 'Do you really want to remove location?', function(btn){
            if (btn === 'yes') {
                location.erase({
                    callback: function(records, operation, success) {
                        if (success) {
                            this.removeMarker(marker);
                        }
                    },
                    scope: this
                });
            }
        }, this);
        
        this.fireEvent('deletelocation', location, marker);
    },
    
    /**
     * Map
     */
    
    refreshMap: function() {
        console.log('refresh map');
    },
    
    mapClick: function(e) {
    },
    
    mapRightClick: function(e) {
        var view = this.getView(),
            menu = this.mapMenu,
            user = view.getViewModel().get('user'),
            xy = this.getLatLngLocalXY(e.latLng);
    
        if (!user || !xy) {
            return false;
        }
    
        if (!menu) {
            this.mapMenu = menu = view.add(view.mapMenu);
        }
        
        menu.setEvent(e);
        
        menu.showAt(xy);
    },
    
    mapZoomChanged: function() {
        this.getView().saveState();
    },
    
    mapTypeIdChanged: function() {
        this.getView().saveState();
    },
    
    mapDragEnd: function() {
        this.setLastCenter(this.getMap().getCenter());
        this.getView().saveState();
    },
    
    getMapTypeId: function(type) {
        console.log('getMapTypeId');
        switch (type) {
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
        if (!latLng) return false;
        
        var overlay = this.getOverlay(),
            projection,
            pixel,
            box;
        
        if (!overlay || !overlay.ready) {
            return false;
        }
    
        projection = overlay.getProjection();
        pixel = projection.fromLatLngToContainerPixel(latLng);
        box = this.getView().body.getBox();

        return [pixel.x + box.x, pixel.y + box.y];
    },
    
    getLatLngLocalXY: function(latLng) {
        if (!latLng) return false;
        
        var overlay = this.getOverlay(),
            projection,
            pixel;
    
        if (!overlay || !overlay.ready) {
            return false;
        }
        
        projection = overlay.getProjection();
        pixel = projection.fromLatLngToContainerPixel(latLng);
        
        return [pixel.x, pixel.y];
    },
    
    /**
     * Marker
     */
    
    addMarker: function(latLng, location, icon, drop, delay) {
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
        Ext.defer(function(){
            marker.setMap(this.getMap());
        }, delay || 0, this);

        // add event listeners
        google.maps.event.addListener(marker, 'click',      Ext.bind(this.markerClick, this, [marker], true));
        google.maps.event.addListener(marker, 'rightclick', Ext.bind(this.markerRightClick, this, [marker], true));
        google.maps.event.addListener(marker, 'dragend',    Ext.bind(this.markerDragEnd, this, [marker], true));

        // return instance
        return marker;
    },

    removeMarker: function(marker) {
        if (marker) {
            // remove events
            google.maps.event.clearListeners(marker, 'click');
            google.maps.event.clearListeners(marker, 'rightclick');
            google.maps.event.clearListeners(marker, 'dragend');
            
            // remove from collection
            this.getMarkers().remove(marker);

            // remove from map
            marker.setMap(null);
        }
    },
    
    markerClick: function(e, marker) {
        var location = marker.getLocation();
        if (location) {
            this.redirectTo('location/' + location.get('id'));
            //this.fireEvent('markerclick', marker, location, e);
        }
    },
    
    markerRightClick: function(e, marker) {
        var view = this.getView(),
            menu = this.markerMenu,
            location = marker ? marker.getLocation() : null,
            user = view.getViewModel().get('user'),
            xy = this.getLatLngLocalXY(e.latLng);
            
        if (!user || !marker || !location || !xy) {
            return false;
        }
        
        if (!menu) {
            this.markerMenu = menu = view.add(view.markerMenu);
        }
        
        menu.setMarker(marker);
        menu.setLocation(location);
        menu.setEvent(e);
        
        menu.items.getAt(0).setText(location.get('name'));
        
        menu.showAt(xy);
    },
    
    markerDragEnd: function(e, marker) {
        var location = marker.getLocation();
        
        marker.setDraggable(false);
        
        if (location) {
            location.set('lat', e.latLng.lat());
            location.set('lng', e.latLng.lng());
            location.save();
        }
    },
    
    /**
     * Toolbar
     */
    
    search: function(btn, e) {
        console.log('search');
    },
    
    showFilterMenu: function(btn, e) {
        console.log('showFilterMenu');
        var view = this.getView(),
            viewModel = view.getViewModel(),
            menu = this.filterMenu;

        if (!menu) {
            menu = {
                xtype: 'menu',
                items: [],
                listeners: {
                    click: this.filterMenuItemClick,
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
    
    filterMenuItemClick: function(menu, item, e) {
        console.log('filterMenuItemClick');
    }
    
});
