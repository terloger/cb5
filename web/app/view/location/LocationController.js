/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    config: {
        miniMap: null
    },
    
    init: function() {
        var vm = this.getViewModel();
        
        vm.bind('{location}', this.showLocation, this);
    },
    
    showLocation: function(location) {
        if (!location) {
            console.log('no location');
            return;
        }
        
        console.log('showLocation', location);
        
        var me = this,
            view = me.getView(),
            miniMap = view.down('#miniMap'),
            vm = view.getViewModel(),
            mainSession = view.up('cb-main').getSession(),
            session = view.getSession(),
            rendered = view.rendered,
            visible = view.isVisible(),
            isLocation = location instanceof CB.model.Location,
            file = isLocation ? location.files().getAt(0) : null,
            lat = location.get('lat'),
            lng = location.get('lng'),
            marker, center, type, icon,
            
            showLocation = function() {
                vm.set('location', location);
                vm.set('file', file);
                
                me.createMiniMap();
                
                if (isLocation && miniMap && miniMap.map) {
                    if (miniMap.getCollapsed()) {
                        miniMap.on({
                            expand: showMiniMap,
                            single: true
                        });
                    } else {
                        showMiniMap();
                    }
                }
            },
            
            showMiniMap = function() {
                center = new google.maps.LatLng(lat, lng);
                type = location.types().getAt(0);
                icon = type ? type.get('type') : 'default';
                marker = new google.maps.Marker({
                    position: center,
                    lat: lat,
                    lng: lng,
                    title: location.get('name'),
                    icon: 'resources/types/' + icon + '.png',
                    shadow: 'resources/types/shadow.png'
                });
                miniMap.map.setCenter(center, 15);
                marker.setMap(miniMap.map);
            };
        
        // destroy session
        if (session) {
            session.destroy();
        }
        
        // create new session
        if (isLocation) {
            session = mainSession.spawn();
            view.setSession(session);
        }
        
        // show location
        if (!rendered) {
            view.on({
                afterrender: showLocation
            });
        } else if (!visible) {
            view.on({
                show: showLocation,
                single: true
            });
        } else {
            showLocation();
        }
    },
    
    hideLocation: function() {
        console.log('hideLocation');
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            session = view.getSession();
    
        vm.set('location', null);
        vm.set('file', null);
        
        me.destroyMiniMap();
        
        if (session) {
            session.destroy();
        }
    },
    
    createMiniMap: function() {
        console.log('createMiniMap');
        // no google available
        if (typeof google === 'undefined') {
            console.log('no google');
            return false;
        }
        
        var me = this,
            miniMap = me.getView().down('#miniMap');
        
        if (!miniMap.mapBody) {
            miniMap.mapBody = miniMap.body.createChild({tag: 'div', cls: 'cb-map-body', style: 'width:100%;height:100%;'});
        }
        
        if (!miniMap.map) {
            miniMap.map = new google.maps.Map(miniMap.mapBody.dom, {
                zoom: 15,
                mapTypeId: 'satellite'
            });
        }
    },
    
    destroyMiniMap: function() {
        console.log('destroyMiniMap');
        var me = this,
            miniMap = me.getView().down('#miniMap');
        
        if (miniMap.mapBody) {
            miniMap.mapBody.destroy();
            delete miniMap.mapBody;
            delete miniMap.map;
        }
    },
    
    resizeMiniMap: function(w, h) {
        var miniMap = this.getView().down('#miniMap'),
            center;
        
        if (miniMap.map) {
            center = miniMap.map.getCenter();
            google.maps.event.trigger(miniMap.map, 'resize');
            miniMap.map.setCenter(center, 15);
        }
    },
    
    prevFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            file = this.getPrevFile();
        
        if (!file) {
            return;
        }
        
        vm.set('file', file);
    },
    
    nextFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            file = this.getNextFile();
        
        if (!file) {
            return;
        }
        
        vm.set('file', file);
    },
    
    getPrevFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            files = location.files(),
            file = vm.get('file'),
            index,
            prev;
    
        // must have at least two files
        if (files.getCount() < 2) {
            return files.getAt(0);
        }
        
        // get current position
        index = files.indexOf(file);
        prev = index - 1;
        
        // show last
        if (prev < 0) {
            prev = files.getCount() - 1;
        }
        
        return files.getAt(prev);
    },
    
    getNextFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            files = location.files(),
            file = vm.get('file'),
            index,
            next;
    
        // must have at least two files
        if (files.getCount() < 2) {
            return files.getAt(0);
        }
        
        // get current position
        index = files.indexOf(file);
        next = index + 1;
        
        // show first
        if (next === files.getCount()) {
            next = 0;
        }
        
        return files.getAt(next);
    },
    
    zoomIn: function() {
        var paper = this.getView().down('cb-paper'),
            ctrl = paper.getController();
    
        ctrl.zoomIn();
    },
    
    zoomOut: function() {
        var paper = this.getView().down('cb-paper'),
            ctrl = paper.getController();
    
        ctrl.zoomOut();
    },
    
    setTool: function(btn) {
        var paper = this.getView().down('cb-paper'),
            ctrl = paper.getController();
    
        ctrl.setActiveTool(btn.paperTool);
    },
    
    addRoute: function() {
        var view = this.getView(),
            session = view.getSession(),
            routes = view.down('#routes'),
            route = session.createRecord('Route', {});
    
        console.log('addRoute', route);
    
        routes.getStore().add(route);
        
        routes.getPlugin('cellediting').startEdit(route, 0);
    },
    
    removeRoute: function() {
        console.log('removeRoute');
    }
    
});
