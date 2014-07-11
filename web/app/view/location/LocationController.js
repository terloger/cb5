/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    config: {
        miniMap: null
    },
    
    /**
     * Core
     */
    
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
            file = location.files().getAt(0),
            lat = location.get('lat'),
            lng = location.get('lng'),
            marker, center, type, icon,
            
            showLocation = function() {
                vm.set('location', location);
                vm.set('file', file);
                
                me.createMiniMap();
                
                me.fileDataChanged();
                
                location.files().on({
                    datachanged: me.fileDataChanged,
                    scope: me
                });
                
                location.routes().on({
                    datachanged: me.routeDataChanged,
                    scope: me
                });
                
                if (miniMap && miniMap.map) {
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
        session = mainSession.spawn();
        view.setSession(session);
        
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
            session = view.getSession(),
            location = vm.get('location');
    
        vm.set('location', null);
        vm.set('file', null);
        vm.set('dirty', false);
        
        me.destroyMiniMap();
        
        location.files().un({
            datachanged: me.fileDataChanged,
            scope: me
        });
        
        location.routes().un({
            datachanged: me.routeDataChanged,
            scope: me
        });
        
        if (session) {
            session.destroy();
        }
    },
    
    saveLocation: function() {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            session = view.getSession(),
            batch = session.getSaveBatch();
    
        console.log(session.getChanges());
        
        if (!batch) {
            return;
        }
        
        batch.on({
            complete: this.saveLocationComplete,
            exception: this.saveLocationException,
            scope: this
        });
        
        batch.start();
    },
    
    saveLocationComplete: function(batch, operation) {
        console.log('saveLocationComplete', batch);
    },
    
    saveLocationException: function(batch, operation) {
        console.log('saveLocationException', arguments);
        var exceptions = batch.getExceptions(),
            msg = [];
    
        Ext.each(exceptions, function(exception){
            msg.push(exception.getError());
        }, this);
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: msg.length ? msg.join('<br />') : 'Unable to save Location!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
    },
    
    /**
     * MiniMap
     */
    
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
    
    /**
     * Tools
     */
    
    setTool: function(btn) {
        var paper = this.getView().down('cb-paper'),
            ctrl = paper.getController();
    
        ctrl.setActiveTool(btn.paperTool);
    },
    
    /**
     * Zoom
     */
    
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
    
    /**
     * Route
     */
    
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
    },
    
    routeDataChanged: function() {
        var vm = this.getViewModel();
        
        console.log('routedata', arguments);
        var getStackTrace = function() {var obj = {};Error.captureStackTrace(obj, getStackTrace);return obj.stack;};
console.log(getStackTrace());
        vm.set('dirty', true);
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
