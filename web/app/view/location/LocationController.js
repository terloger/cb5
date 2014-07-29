/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    listen: {
        controller: {
            '*': {
                paperchanged: 'paperChanged'
            }
        }
    },
    
    /**
     * Core
     */
    
    init: function() {
        var vm = this.getViewModel();
        
        vm.bind('{location}', this.showLocation, this);
    },
    
    save: function() {
        console.log('save');
        this.operations = [
            'saveLocation',
            'saveTypes'
        ];
        
        this.saveLocation();
    },
    
    saveComplete: function() {
        console.log('saveComplete');
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        vm.set('dirty', false);
        
        view.unmask();
        
        this.fireEvent('locationupdated', location);
    },
    
    operationComplete: function(operation) {
        console.log('operationComplete', operation);
        var index = this.operations.indexOf(operation);
        
        if (index > -1) {
            this.operations.splice(index, 1);
        }
        
        if (this.operations.length === 0) {
            this.saveComplete();
        }
    },
    
    /**
     * Location
     */
    
    showLocation: function(location) {
        if (!location) {
            console.log('no location');
            return;
        }
        
        console.log('showLocation', location);
        
        var me = this,
            view = me.getView(),
            main = view.up('cb-main'),
            miniMap = view.down('cb-location-minimap'),
            paper = view.down('cb-paper'),
            vm = view.getViewModel(),
            session = view.getSession(),
            rendered = view.rendered,
            visible = view.isVisible(),
            file = location.files().getAt(0),
            lat = location.get('lat'),
            lng = location.get('lng'),
            marker, center, type, icon,
            
            showLocation = function() {
                vm.set('location', location);
                vm.set('file', file);
                
                location.routes().sort('pos', 'ASC');
                
                me.fileDataChanged();
                
                if (!miniMap) {
                    return;
                }
                
                if (miniMap.getCollapsed()) {
                    miniMap.on({
                        expand: showMiniMap,
                        single: true
                    });
                } else {
                    showMiniMap();
                }
            },
            
            showMiniMap = function() {
                if (!miniMap.map) {
                    me.createMiniMap();
                }
                
                if (!miniMap.map) {
                    return;
                }
                
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
        
        // destroy old session
        if (session) {
            session.destroy();
        }
        
        // create new session
        session = main.getSession().spawn();
        view.setSession(session);
        paper.setSession(session);
        
        // show location when view is ready
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
        vm.set('dirty', false);
        
        me.destroyMiniMap();
        
        if (session) {
            session.destroy();
        }
    },
    
    saveLocation: function() {
        var me = this,
            view = me.getView(),
            session = view.getSession().getParent(),
            batch = session.getSaveBatch();
    
        console.log('changes', session.getChanges());
        
        if (!batch) {
            this.saveLocationComplete();
            return;
        }
        
        view.mask('Saving Location ...');
        
        batch.on({
            complete: this.saveLocationComplete,
            exception: this.saveLocationException,
            scope: this
        });
        
        batch.start();
    },
    
    saveLocationComplete: function(batch, operation) {
        console.log('saveLocationComplete');
        var me = this,
            view = me.getView(),
            paper = view.down('cb-paper');
    
        paper.remapLayers();
        
        this.operationComplete('saveLocation');
        
        this.saveTypes();
    },
    
    saveLocationException: function(batch, operation) {
        console.log('saveLocationException');
        var me = this,
            view = me.getView(),
            exceptions = batch.getExceptions(),
            msg = [];
    
        view.unmask();
    
        Ext.each(exceptions, function(exception){
            msg.push(exception.getError());
        }, this);
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: msg.length ? msg.join('<br />') : 'Unable to save Location!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveLocation');
        this.operationComplete('saveTypes');
    },
    
    /**
     * Type
     */
    
    typePicker: function(e) {
        var view = this.getView(),
            vm = view.getViewModel(),
            user = vm.get('user'),
            picker = view.down('cb-location-typepicker');
    
        if (!user) {
            return;
        }
        
        if (picker.isVisible()) {
            // hide picker
            console.log('hide picker');
            picker.hide();
            return;
        } else {
            // show picker
            console.log('show picker');
            picker.triggerCt = view.down('#types');
            picker.showAt(10, 8);
        }
    },
    
    typeChange: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        view.down('#types').setTypes(location.types());
        
        vm.set('dirty', true);
    },
    
    saveTypes: function() {
        var view = this.getView(),
            session = view.getSession().getParent(),
            changes = session.getChanges();
        
        if (changes && changes.LocationType && changes.LocationType.locations) {
            this.getView().mask('Saving Location Types ...');
            
            CB.api.Location.setTypes(changes.LocationType.locations, function(result) {
                if (result && result.success) {
                    this.saveTypesComplete(result);
                } else {
                    this.saveTypesException(result);
                }
            }, this);
        } else {
            this.saveTypesComplete();
        }
    },
    
    saveTypesComplete: function(result) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        location.commit();
        location.types().commitChanges();
        
        this.operationComplete('saveTypes');
    },
    
    saveTypesException: function(result) {
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: result && result.message ? result.message : 'Unable to save Location Types!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveTypes');
    },
    
    /**
     * Paper
     */
    
    setPaperTool: function(btn) {
        this.getView().down('cb-paper').setActiveTool(btn.paperTool);
    },
    
    paperChanged: function(paper, item) {
        this.getViewModel().set('dirty', true);
    },
    
    paperRouteSelectionChange: function(paper, route, oldRoute, e) {
        var view = this.getView(),
            vm = view.getViewModel();
    
        vm.set('selectedroute', route);
    
        if (Ext.os.deviceType === 'Desktop') {
            
            var routes = view.down('cb-location-routes'),
                sm = routes.getSelectionModel();
        
            if (route) {
                sm.select(route, false, true);
            } else {
                sm.deselectAll();
            }
            
        } else {
            
            var tip = view.down('#routeTip');
            
            if (route instanceof CB.model.Route) {
                
                // show tip
                tip.setTitle(route.get('name'));
                if (Ext.supports.Touch) {
                    var touch = e.event && e.event.touches && e.event.touches.length ? e.event.touches[0] : null;
                    if (touch) {
                        tip.showAt(touch.pageX - paper.getX(), touch.pageY - paper.getY());
                    }
                } else {
                    tip.showAt(e.event.layerX + 20, e.event.layerY + 20);
                }

                // reposition tip
                var tbox = tip.getEl().getBox();
                var bbox = Ext.getBody().getBox();
                if (tbox.right > bbox.width) {
                    tip.setX(tip.getX() - tip.getWidth() - 40);
                }
                if (tbox.bottom > bbox.height) {
                    tip.setY(tip.getY() - tip.getHeight() - 40);
                }
                
            } else {
                
                // hide tip
                tip.hide();
                
            }
        }
    },
    
    paperRouteMouseEnter: function(paper, route) {
        var view = this.getView();
        
        if (Ext.os.deviceType === 'Desktop') {
            var routes = view.down('cb-location-routes');
            var node = routes.getView().getNode(route);
            if (node) {
                Ext.fly(node).addCls('x-grid-item-over');
            }
        } else {
            // do nothing
        }
    },
    
    paperRouteMouseLeave: function(paper, route) {
        var view = this.getView();
        
        if (Ext.os.deviceType === 'Desktop') {
            var routes = view.down('cb-location-routes');
            var node = routes.getView().getNode(route);
            if (node) {
                Ext.fly(node).removeCls('x-grid-item-over');
            }
        } else {
            // do nothing
        }
    },
    
    closeRouteTip: function() {
        var view = this.getView(),
            paper = view.down('cb-paper'),
            vm = paper.getViewModel();
    
        vm.set('route', null);
    },
    
    /**
     * Route
     */
    
    addRoute: function() {
        var view = this.getView(),
            session = view.getSession().getParent(),
            routes = view.down('cb-location-routes'),
            route = session.createRecord('Route', {
                pos: routes.getStore().getCount()
            });
    
        console.log('addRoute', route);
    
        routes.getStore().add(route);
        
        routes.getPlugin('cellediting').startEdit(route, 0);
    },
    
    removeRoute: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
            file = vm.get('file'),
            route = vm.get('routes.selection'),
            layer;
    
        if (!route) {
            return;
        }
        
        // remove paper route
        paper.removeRoute(route);

        // drop route
        route.drop();

        // drop layer
        layer = file.getRouteLayer(route)
        if (layer) {
            layer.drop();
        }

        // mark view as dirty
        vm.set('dirty', true);
    },
    
    reorderRoutes: function(routes) {
        Ext.each(routes, function(route, index){
            route.set('pos', index);
        }, this);
    },
    
    routeDrop: function(node, data, overModel, dropPosition, dropHandlers) {
        if (!data.records.length) {
            return false;
        }
        
        var view = this.getView(),
            routes = view.down('cb-location-routes'),
            store = routes.getStore(),
            dragRoute = data.records[0],
            dragIndex = store.indexOf(dragRoute),
            dropRoute = overModel,
            dropIndex = store.indexOf(dropRoute),
            range = store.getRange();
    
        if (dragIndex > dropIndex && dropPosition === 'after') {
            dropIndex++;
        }
        
        if (dropIndex > dragIndex && dropPosition === 'before') {
            dropIndex--;
        }
    
        range.splice(dragIndex, 1);
        range.splice(dropIndex, 0, dragRoute);
        
        this.reorderRoutes(range);
        
        this.routeDataChanged();
        
        store.sort('pos', 'ASC');
    },
    
    routeEdit: function(editor, context) {
        if (context.value !== context.originalValue) {
            this.routeDataChanged();
        }
    },
    
    routeDataChanged: function() {
        this.getViewModel().set('dirty', true);
    },
    
    routeSelectionChange: function(grid, selection) {
        var view = this.getView(),
            vm = view.getViewModel(),
            routes = view.down('cb-location-routes'),
            paper = view.down('cb-paper'),
            papervm = paper.getViewModel(),
            selection = routes.getSelectionModel().getSelection(),
            route = selection.length ? selection[0] : null;
        
        vm.set('selectedroute', route);
        papervm.set('route', route);
    },
    
    routeMouseEnter: function(grid, route, item, index, e) {
        var view = this.getView(),
            paper = view.down('cb-paper');
    
        paper.routeMouseEnter(route);
    },
    
    routeMouseLeave: function(grid, route, item, index, e) {
        var view = this.getView(),
            paper = view.down('cb-paper');
    
        paper.routeMouseLeave(route);
    },
    
    /**
     * Zoom
     */
    
    zoomIn: function() {
        this.getView().down('cb-paper').zoomIn();
    },
    
    zoomOut: function() {
        this.getView().down('cb-paper').zoomOut();
    },
    
    /**
     * MiniMap
     */
    
    createMiniMap: function() {
        var me = this,
            miniMap = me.getView().down('cb-location-minimap');
    
        console.log('createMiniMap');
        
        // no google available
        if (typeof google === 'undefined') {
            miniMap.mapBody = miniMap.body.createChild({
                tag: 'div',
                cls: 'cb-map-body',
                style: 'width:100%;height:100%;padding: 0 1em;',
                html: '<p>Looks like Google Maps services are not available at the moment.</p>'
            });
            return;
        }
        
        if (!miniMap.mapBody) {
            miniMap.mapBody = miniMap.body.createChild({
                tag: 'div',
                cls: 'cb-map-body',
                style: 'width:100%;height:100%;'
            });
        }
        
        if (!miniMap.map) {
            miniMap.map = new google.maps.Map(miniMap.mapBody.dom, {
                zoom: 15,
                minZoom: 12,
                mapTypeId: 'satellite',
                mapTypeControl: false,
                overviewMapControl: false,
                panControl: false,
                rotateControl: false,
                scaleControl: false,
                streetViewControl: false,
                zoomControl: true
            });
        }
    },
    
    destroyMiniMap: function() {
        console.log('destroyMiniMap');
        var me = this,
            miniMap = me.getView().down('cb-location-minimap');
        
        if (miniMap.mapBody) {
            miniMap.mapBody.destroy();
            delete miniMap.mapBody;
            delete miniMap.map;
        }
    },
    
    resizeMiniMap: function(w, h) {
        var miniMap = this.getView().down('cb-location-minimap'),
            center;
        
        if (miniMap.map) {
            center = miniMap.map.getCenter();
            google.maps.event.trigger(miniMap.map, 'resize');
            miniMap.map.setCenter(center, 15);
        }
    },
    
    /**
     * File
     */
    
    prevFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            file = this.getPrevFile();
        
        if (!file) {
            return;
        }
        
        vm.set('file', file);
        vm.set('fileIndex', location.files().indexOf(file) + 1);
    },
    
    nextFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            file = this.getNextFile();
        
        if (!file) {
            return;
        }
        
        vm.set('file', file);
        vm.set('fileIndex', location.files().indexOf(file) + 1);
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
    
    saveFiles: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            button = view.down('multifilebutton'),
            files = button.fileInputEl.dom.files,
            len = files.length,
            i = 0;
    
        this.fileCount = len;
        this.fileErrors = [];
    
        console.log('saveFiles', files);
        
        if (!len) {
            this.saveFilesComplete();
            return;
        }
        
        view.mask('Saving Location Files ...');
        
        for (; i < len; i++) {
            CB.service.File.upload({
                file: files[i],
                location: location,
                scope: this,
                success: function(result) {
                    location.files().add(Ext.create('CB.model.File', result.data));
                    
                    this.fileDataChanged();

                    if (--this.fileCount === 0) {
                        if (this.fileErrors.length) {
                            this.saveFilesException();
                        } else {
                            this.saveFilesComplete();
                        }
                    }
                },
                failure: function(msg) {
                    this.fileErrors.push(msg);
                    
                    this.fileDataChanged();

                    if (--this.fileCount === 0) {
                        this.saveFilesException();
                    }
                }
            });
        }
    },
    
    saveFilesComplete: function() {
        console.log('saveFilesComplete');
        
        this.getView().unmask();
        
        Ext.MessageBox.show({
            title: 'Success',
            msg: 'All files were successfully uploaded.',
            icon: Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK
        });
    },
    
    saveFilesException: function() {
        console.log('saveFilesExceptions');
        
        this.getView().unmask();
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: this.fileErrors.join('<br />'),
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
    },
    
    removeFile: function() {
        
    },
    
    fileDataChanged: function() {
        var vm = this.getViewModel(),
            location = vm.get('location'),
            files = location.files(),
            file = vm.get('file');
    
        vm.set('fileCount', files.getCount());
        vm.set('fileIndex', files.indexOf(file) + 1);
        vm.set('hasFiles', files.getCount() > 1);
    }
    
});
