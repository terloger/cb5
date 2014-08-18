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
            markers = Ext.create('Ext.util.MixedCollection'),
            mc = new MarkerClusterer(map, [], {
                gridSize: 60,
                maxZoom: 9
            });
            
        // set map reference on controller and view
        me.setMap(map);
        view.setMap(map);

        // enable marker clusterer
        me.setMarkerClusterer(mc);

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

    slugify2: function(s, opt) {
        s = String(s);
        opt = Object(opt);

        var defaults = {
            'delimiter': '-',
            'limit': undefined,
            'lowercase': true,
            'replacements': {},
            'transliterate': (typeof(XRegExp) === 'undefined') ? true : false
        };

        // Merge options
        for (var k in defaults) {
            if (!opt.hasOwnProperty(k)) {
                opt[k] = defaults[k];
            }
        }

        var char_map = {
            // Latin
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ő': 'O',
            'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH',
            'ß': 'ss',
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
            'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
            'ÿ': 'y',

            // Latin symbols
            '©': '(c)',

            // Greek
            'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
            'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
            'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
            'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
            'Ϋ': 'Y',
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
            'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
            'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
            'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
            'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',

            // Turkish
            'Ş': 'S', 'İ': 'I', 'Ç': 'C', 'Ü': 'U', 'Ö': 'O', 'Ğ': 'G',
            'ş': 's', 'ı': 'i', 'ç': 'c', 'ü': 'u', 'ö': 'o', 'ğ': 'g',

            // Russian
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
            'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
            'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
            'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
            'Я': 'Ya',
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
            'я': 'ya',

            // Ukrainian
            'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
            'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',

            // Czech
            'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U',
            'Ž': 'Z',
            'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
            'ž': 'z',

            // Polish
            'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ó': 'o', 'Ś': 'S', 'Ź': 'Z',
            'Ż': 'Z',
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
            'ż': 'z',

            // Latvian
            'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i', 'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N',
            'Š': 'S', 'Ū': 'u', 'Ž': 'Z',
            'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
            'š': 's', 'ū': 'u', 'ž': 'z'
        };

        // Make custom replacements
        for (var k in opt.replacements) {
            s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
        }

        // Transliterate characters to ASCII
        if (opt.transliterate) {
            for (var k in char_map) {
                s = s.replace(RegExp(k, 'g'), char_map[k]);
            }
        }

        // Replace non-alphanumeric characters with our delimiter
        var alnum = (typeof(XRegExp) === 'undefined') ? RegExp('[^a-z0-9]+', 'ig') : XRegExp('[^\\p{L}\\p{N}]+', 'ig');
        s = s.replace(alnum, opt.delimiter);

        // Remove duplicate delimiters
        s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter);

        // Truncate slug to max. characters
        s = s.substring(0, opt.limit);

        // Remove delimiter from ends
        s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '');

        return opt.lowercase ? s.toLowerCase() : s;
    },

    slugify: function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },
    
    mapReady: function() {
        var me = this,
            vm = me.getViewModel(),
            store = vm.get('locations'),
            showMarkers = function() {
                store = vm.get('locations');
                store.each(function(location, index){
                    //console.log(me.slugify2(location.get('name')));
                    var latLng = new google.maps.LatLng(location.get('lat'), location.get('lng')),
                        type = location.types().getAt(0),
                        icon = type ? type.get('type') : 'default',
                        drop = false;

                    // dont show locations without files
                    if (location.files().getCount() <= 0) {
                        return;
                    }

                    this.addMarker(latLng, location, icon, drop);
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
        if (!store) {
            Ext.defer(showMarkers, 500, this);
        } else if (store.isLoaded()) {
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
        var location = this.markerMenu.getLocation();
        
        if (!location) {
            return;
        }
        
        this.redirectTo('location/' + location.get('id'));
    },
    
    moveLocation: function() {
        var marker = this.markerMenu.getMarker();
        
        if (marker) {
            marker.setDraggable(true);
        }
    },
    
    deleteLocation: function() {
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
            icon: this.getMarkerIconUrl(icon)
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
        if (delay) {
            Ext.defer(function(){
                marker.setMap(this.getMap());
            }, delay, this);
        } else {
            marker.setMap(this.getMap());
        }

        // add event listeners
        google.maps.event.addListener(marker, 'click',      Ext.bind(this.markerClick, this, [marker], true));
        google.maps.event.addListener(marker, 'rightclick', Ext.bind(this.markerRightClick, this, [marker], true));
        google.maps.event.addListener(marker, 'dragend',    Ext.bind(this.markerDragEnd, this, [marker], true));

        // add to marker clusterer
        this.getMarkerClusterer().addMarker(marker);

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

    getMarkerIconUrl: function(icon) {
        return 'resources/types/' + icon + '.png';
    },

    /**
     * Search
     */

    search: function(field, value, oldValue) {
        // no google or value not string
        if (typeof google === 'undefined' || typeof value !== 'string') {
            return false;
        }

        // clear the search
        if (value === '') {
            this.clearSearch();
            return;
        }

        field.getEl().down('.clear').show();

        this.searchLocations(field, value);

        this.searchMap(field, value);

        /*
        // mask menu if rendered
        if (menu.rendered) {
            menu.getStore().removeAll();
            menu.setHeight(100);
            menu.mask('Searching ...');
        }

        // unmask menu
        if (menu.rendered) {
            menu.setHeight(null);
            menu.unmask();
        }
        */
    },

    searchLocations: function(field, value) {
        var locations = this.getViewModel().get('locations'),
            menu = this.getSearchMenu(),
            results = [];

        locations.each(function(location){
            var result = false,
                regex = new RegExp(value, 'gi');

            if (location.get('name').search(regex) > -1) {
                result = true;
            }

            if (location.get('description').search(regex) > -1) {
                result = true;
            }

            if (result === true) {
                results.push({
                    name: location.get('name'),
                    iconCls: 'icon-climbuddy',
                    location: new google.maps.LatLng(location.get('lat'), location.get('lng')),
                    bounds: null,
                    record: location
                });
            }

        },this);

        // load data into menu store
        menu.getStore().loadData(results);

        // show menu
        menu.showBy(field, 'tl-bl');
        field.focus();
    },

    searchMap: function(field, value) {
        var geocoder = new google.maps.Geocoder(),
            menu = this.getSearchMenu(),
            results = [];

        // if user clears the search during callback
        this.searchCleared = false;

        // ask google for some data
        geocoder.geocode({ 'address': value }, Ext.bind(function(response, status) {

            // geocoding successful and search not cleared
            if (status === google.maps.GeocoderStatus.OK && !this.searchCleared) {

                Ext.each(response, function(result){
                    results.push({
                        name: result.formatted_address,
                        iconCls: 'icon-google',
                        location: result.geometry.location,
                        bounds: result.geometry.bounds,
                        record: result
                    });
                });

                // append data into menu store
                menu.getStore().loadData(results, true);

                // show menu
                menu.showBy(field, 'tl-bl');
                field.focus();
            }
        }, this));
    },

    searchClick: function(e, target) {
        var fly = Ext.fly(target);

        if (fly.is('.search')) {
            this.doSearch();
            return;
        }

        if (fly.is('.clear')) {
            this.clearSearch();
            return;
        }
    },

    clearSearch: function() {
        var menu = this.searchMenu,
            marker = this.searchMarker,
            field = this.getView().down('#searchField');

        field.suspendEvents();
        field.reset();
        field.resumeEvents();

        if (menu) {
            menu.getStore().removeAll();
            menu.hide();
        }

        if (marker) {
            marker.setMap(null);
        }

        field.getEl().down('.clear').hide();

        this.searchCleared = true;
    },

    doSearch: function() {
        var view = this.getView(),
            field = view.down('#searchField');

        this.search(field, field.getValue());
    },

    searchItemClick: function(sm, selection) {
        if (!selection.length) {
            return false;
        }

        var item = selection[0],
            map = this.getMap(),
            marker = this.searchMarker;

        if (item.get('record') instanceof CB.model.Location) {
            if (marker) marker.setMap(null);
        } else {
            if (!marker) {
                marker = this.searchMarker = new google.maps.Marker();
            }
            // show marker
            marker.setPosition(item.get('location'));
            marker.setMap(map);
        }

        // center map
        map.setCenter(item.get('location'));
        if (item.get('bounds')) {
            map.fitBounds(item.get('bounds'));
        }
    },

    searchSpecialKey: function(field, e) {
        if (e.getKey() === e.ENTER) {
            this.doSearch();
        } else if (e.getKey() === e.ESC) {
            this.clearSearch();
        }
    },

    searchFocus: function(field) {
        var menu = this.searchMenu;

        // got menu and some search results
        if (menu && menu.getStore().getCount()) {
            // show menu
            menu.triggerCt = field;
            menu.showBy(field, 'tl-bl');

            // re-focus search field
            field.focus();
        }
    },

    getSearchMenu: function() {
        var menu = this.searchMenu;

        // create menu
        if (!menu) {
            menu = this.searchMenu = Ext.create('CB.view.map.SearchMenu', {
                floating: true,
                hidden: true,
                //closable: true,
                closeAction: 'hide',
                bodyPadding: 5,
                maxWidth: 400,
                maxHeight: 300,
                autoScroll: true,
                listeners: {
                    selectionchange: this.searchItemClick,
                    scope: this
                }
            });
        }

        return menu;
    },

    /**
     * Type filter
     */

    typePicker: function(btn, e) {
        var picker = this.filterMenu;

        if (!picker) {
            picker = this.filterMenu = Ext.create('CB.view.location.TypePicker', {
                floating: true,
                hidden: true,
                closable: true,
                closeAction: 'hide',
                width: 460,
                height: 200,
                bodyPadding: 5,
                location: false,
                listeners: {
                    selectionchange: this.typeChange,
                    scope: this
                }
            });
        }
        
        if (picker.isVisible()) {
            // hide picker
            picker.hide();
        } else {
            // show picker
            picker.triggerCt = btn;
            picker.showBy(btn, 'tl-bl');
        }
    },

    typeChange: function(sm, selection) {
        var view = this.getView(),
            vm = view.getViewModel(),
            locations = vm.get('locations'),
            btn = view.down('#filterButton'),
            mc = this.getMarkerClusterer(),
            markers = mc.getMarkers(),
            filter = {
                types: selection || []
            },
            added,
            marker,
            types,
            visible;

        btn[selection.length ? 'addCls' : 'removeCls']('filtered');

        // loop through all locations
        locations.each(function(location){

            // dont touch locations without files
            if (location.files().getCount() <= 0) {
                return;
            }

            // prepare vars
            marker = location.getMarker();
            types = [];
            visible = false;

            // loop through location types
            location.types().each(function(type){

                // type filter
                if (filter.types) {
                    if (filter.types.length === 0 || Ext.Array.contains(filter.types, type)) {

                        // add type so that we can switch marker icon if necessary
                        types.push(type.get('type'));

                        // show this marker
                        visible = true;
                    }
                }

            },this);

            // switch icon
            if (types.length) {
                marker.setIcon(this.getMarkerIconUrl(types[0]));
            }

            // show/hide marker
            marker.setVisible(visible);

            // handle marker clusterer
            added = markers.indexOf(marker) > -1;
            
            if (visible && !added) {
                mc.addMarker(marker);
            }

            if (!visible && added) {
                mc.removeMarker(marker);
            }

        },this);
    }
    
});
