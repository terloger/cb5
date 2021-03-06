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
    
    checkUser: function() {
        var vm = this.getViewModel(),
            user = vm.get('user');

        return user instanceof CB.model.User;
    },

    showLocation: function(location) {
        if (!location) {
            return;
        }

        this.initSession(location);

        var view = this.getView();

        if (!view.rendered) {
            view.on({
                afterrender: Ext.bind(this.doShowLocation, this, [location])
            });
        } else if (!view.isVisible()) {
            view.on({
                show: Ext.bind(this.doShowLocation, this, [location]),
                single: true
            });
        } else {
            this.doShowLocation(location);
        }
    },

    doShowLocation: function(location) {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
            papervm = paper.getViewModel();

        vm.set('location', location);

        vm.set('file', location.files().getAt(0));

        papervm.set('route', null);

        this.fileDataChanged();

        this.initMiniMap(location);
    },

    hideLocation: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');

        vm.set('location', null);
        vm.set('file', null);
        vm.set('dirty', false);

        this.destroyMiniMap();

        this.destroySession(location);
    },

    switchCard: function() {
        var view = this.getView(),
            card = view.down('#card'),
            paper = view.down('cb-paper'),
            overview = view.down('cb-location-overview');

        //card.setActiveItem(overview.isVisible() ? paper : overview);
    },

    /**
     * Session handling
     */

    initSession: function(location) {
        var view = this.getView(),
            paper = view.down('cb-paper'),
            session = view.getSession();

        // destroy session
        if (session) {
            session.destroy();
        }

        // create new session
        session = Ext.create('Ext.data.Session');

        // apply session to view and paper
        view.setSession(session);
        paper.setSession(session);

        // no location?
        if (!location) {
            return;
        }

        // add location
        session.adopt(location);

        // adopt location routes
        location.routes().each(function(route){
            session.adopt(route);
        });

        // adopt location files
        location.files().each(function(file){
            session.adopt(file);

            // adopt file layers
            file.layers().each(function(layer){
                session.adopt(layer);
            });
        });

        // adopt location types
        Ext.data.StoreManager.lookup('locationTypes').each(function(type){
            session.adopt(type);
        });

        // adopt grade types and grades
        Ext.data.StoreManager.lookup('gradeTypes').each(function(type){
            session.adopt(type);

            type.grades().each(function(grade){
                session.adopt(grade);
            });
        });
        
        // init location type associations
        this.initSessionAssociations(location, 'LocationTypes');

        // init route grades associations for each route
        location.routes().each(function(route){
            this.initSessionAssociations(route, 'RouteGrades');
        }, this);
    },

    destroySession: function(location) {
        if (!(location instanceof CB.model.Location)) {
            return;
        }

        var view = this.getView(),
            session = view.getSession();

        // remove location types associations
        this.removeSessionAssociations(location, 'LocationTypes');

        // remove route grades associations from each route
        location.routes().each(function(route){
            this.removeSessionAssociations(route, 'RouteGrades');
        }, this);

        if (session) {
            session.destroy();
        }
    },

    initSessionAssociations: function(model, associationName) {
        var view = this.getView(),
            session = view.getSession(),
            association = model.schema.getAssociation(associationName),
            manyToMany = association.isManyToMany,
            left = association.left,
            right = association.right,
            store = model[left.getterName](),
            role = manyToMany ? right : left,
            matrix;

        // set session for location types
        store.setSession(session);

        // attach matrix to the store
        if (manyToMany) {
            matrix = session.getMatrixSlice(role, model.get('id'));
            if (!matrix.store) {
                matrix.attach(store);
                matrix.notify = role.onMatrixUpdate;
                matrix.scope = role;
            }
        }

        // bind role event handlers to store
        store.on({
            add: role.onAddToMany,
            remove: role.onRemoveFromMany,
            clear: role.onRemoveFromMany,
            scope: role
        });

        // load initial associations
        if (store.getCount()) {
            role.onAddToMany(store, store.getData().items, true);
        }
    },

    removeSessionAssociations: function(model, associationName) {
        if (!(model instanceof CB.model.Base) || !model.schema) {
            return;
        }

        var association = model.schema.getAssociation(associationName),
            manyToMany = association.isManyToMany,
            left = association.left,
            right = association.right,
            store = model[left.getterName](),
            role = manyToMany ? right : left;

        if (manyToMany) {
            store.matrix.destroy();
        }

        store.un({
            add: role.onAddToMany,
            remove: role.onRemoveFromMany,
            clear: role.onRemoveFromMany,
            scope: role
        });
    },

    /**
     * Save location
     */

    save: function() {
        this.operations = [
            'saveLocation',
            'saveTypes',
            'saveRouteGrades'
        ];

        this.saveLocation();
    },

    saveComplete: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            routes = view.down('cb-location-routes');

        vm.set('dirty', false);

        view.unmask();

        this.initSession(location);

        this.fireEvent('locationupdated', location);
    },

    operationComplete: function(operation) {
        var index = this.operations.indexOf(operation);

        if (index > -1) {
            this.operations.splice(index, 1);
        }

        if (this.operations.length === 0) {
            this.saveComplete();
        }
    },
    
    saveLocation: function() {
        var view = this.getView(),
            session = view.getSession(),
            changes = session.getChanges(),
            batch = session.getSaveBatch();

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
        var view = this.getView(),
            paper = view.down('cb-paper');
    
        if (batch) {
            paper.remapLayers();
        }
        
        this.operationComplete('saveLocation');
        
        this.saveTypes();
    },
    
    saveLocationException: function(batch, operation) {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
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
        this.operationComplete('saveRouteGrades');
    },

    /**
     * Type
     */
    
    typePicker: function(e, dom) {
        var view = this.getView(),
            vm = view.getViewModel(),
            user = vm.get('user'),
            picker = view.down('cb-location-typepicker'),
            btn = view.down('#types');
    
        if (!user) {
            return;
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
    
    typeChange: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');

        view.down('#types').setTypes(location.types());

        vm.set('dirty', true);
    },
    
    saveTypes: function() {
        var view = this.getView(),
            session = view.getSession(),
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
    
    saveTypesComplete: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        location.commit();
        location.types().commitChanges();
        
        this.operationComplete('saveTypes');

        this.saveRouteGrades();
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
     * Save route grades
     */

    saveRouteGrades: function() {
        var view = this.getView(),
            session = view.getSession(),
            changes = session.getChanges();

        if (changes && changes.Grade && changes.Grade.routes) {
            this.getView().mask('Saving Route Types ...');

            CB.api.Location.setRouteGrades(changes.Grade.routes, function(result) {
                if (result && result.success) {
                    this.saveRouteGradesComplete(result);
                } else {
                    this.saveRouteGradesException(result);
                }
            }, this);
        } else {
            this.saveRouteGradesComplete();
        }
    },

    saveRouteGradesComplete: function() {
        this.operationComplete('saveRouteGrades');
    },

    saveRouteGradesException: function(result) {
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: result && result.message ? result.message : 'Unable to save Route Grades!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });

        this.operationComplete('saveRouteGrades');
    },

    /**
     * MiniMap
     */

    initMiniMap: function(location) {
        var view = this.getView(),
            miniMap = view.down('cb-location-minimap');

        if (!miniMap) {
            return;
        }
        
        if (miniMap.getCollapsed()) {
            miniMap.on({
                resize: Ext.bind(this.showMiniMap, this, [location]),
                single: true
            });
        } else {
            this.showMiniMap(location);
        }
    },

    showMiniMap: function(location) {
        var view = this.getView(),
            miniMap = view.down('cb-location-minimap'),
            lat = location.get('lat'),
            lng = location.get('lng'),
            center, type, icon, marker;

        if (!miniMap.map) {
            this.createMiniMap();
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
    },

    createMiniMap: function() {
        var miniMap = this.getView().down('cb-location-minimap');

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
        var miniMap = this.getView().down('cb-location-minimap');

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
     * Paper
     */

    getPaperContextMenu: function(scope) {
        var menu = this.imageMenu;

        if (!menu) {
            menu = this.menu = Ext.create('Ext.menu.Menu', {
                renderTo: Ext.getBody(),
                items: [{
                    xtype: 'menuitem',
                    text: 'Remove image',
                    glyph: 'xe61f@climbuddy',
                    handler: this.removeFile,
                    scope: this
                }]
            });
        }

        return menu;
    },
    
    setPaperTool: function(btn) {
        var view = this.getView(),
            paper = view.down('cb-paper');

        paper.setActiveTool(btn.paperTool);
    },
    
    paperChanged: function(paper, item) {
        this.getViewModel().set('dirty', true);
    },

    paperContextMenu: function(e, dom) {
        this.getPaperContextMenu().showAt(e.getXY());
        e.stopEvent();
        return false;
    },

    paperRouteSelectionChange: function(paper, route, oldRoute, e) {
        var view = this.getView(),
            vm = view.getViewModel();
    
        vm.set('selectedroute', route);
    
        if (Ext.os.deviceType === 'Desktop') {
            
            var routes = view.down('cb-location-routes'),
                sm = routes.getSelectionModel();
        
            if (route) {
                sm.select(route);
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
            session = view.getSession(),
            routes = view.down('cb-location-routes'),
            route = session.createRecord('Route', {
                pos: routes.getStore().getCount()
            });
    
        routes.getStore().add(route);

        routes.getSelectionModel().select(route);
        
        routes.getPlugin('locationRouteCellEditing').startEdit(route, 1);
    },

    clearRoute: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
            route = paper.getSelectedRoute(),
            file = vm.get('file'),
            fileLayers = file.layers,
            layer = file.getRouteLayer(route);

        if (!layer) {
            return;
        }

        // drop layer
        layer.drop();

        // ext bug fix
        file.layers = fileLayers;

        // remove route
        paper.clearRoute(route);

        // trigger data change
        this.routeDataChanged();
    },
    
    removeRoute: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
            location = vm.get('location'),
            file = vm.get('file'),
            route = vm.get('routes.selection'),
            layer;

        if (!route) {
            return;
        }

        // remove paper route
        paper.removeRoute(route);

        // get route layer
        layer = file.getRouteLayer(route)
        if (layer) {
            // fix ext bug
            var fileLayers = file.layers;

            // drop layer
            layer.drop();

            // fix ext bug
            file.layers = fileLayers;
        }

        // fix ext bug
        var locationRoutes = location.routes;

        // drop route
        route.drop();
        
        // fix ext bug
        location.routes = locationRoutes;

        // mark view as dirty
        vm.set('dirty', true);
    },

    beforeRouteEdit: function(plugin, context) {
        var isUser = this.checkUser(),
            vm = this.getViewModel(),
            editor,
            location,
            route;

        if (!isUser) {
            return false;
        }

        if (context.field === 'grades') {
            editor = context.column.getEditor();
            if (editor) {
                location = vm.get('location');
                route = vm.get('routes.selection'),
                editor.setLocation(location);
                editor.setRoute(route);
            }
        }

        return true;
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
            route = selection.length ? selection[selection.length - 1] : null;

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
     * Route drag drop
     */

    beforeRouteDrag: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');

        this.locationRoutesFix = location.routes;

        return this.checkUser();
    },

    routeDrop: function(node, data, overModel, dropPosition, dropHandlers) {
        if (!data.records.length) {
            return false;
        }

        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
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

        if (!location.routes) {
            location.routes = this.locationRoutesFix;
        }
    },

    reorderRoutes: function(routes) {
        Ext.each(routes, function(route, index){
            route.set('pos', index);
        }, this);
    },

    /**
     * File
     */

    setFile: function(file) {
        var vm = this.getViewModel(),
            location = vm.get('location');

        vm.set('file', file);
        vm.set('fileIndex', location.files().indexOf(file) + 1);
    },
    
    prevFile: function() {
        var view = this.getView(),
            paper = view.down('cb-paper'),
            vm = view.getViewModel(),
            location = vm.get('location'),
            file = this.getPrevFile();

        if (!file || paper.hasCls('loading')) {
            return;
        }
        
        vm.set('file', file);
        vm.set('fileIndex', location.files().indexOf(file) + 1);
    },
    
    nextFile: function() {
        var view = this.getView(),
            paper = view.down('cb-paper'),
            vm = view.getViewModel(),
            location = vm.get('location'),
            file = this.getNextFile();

        if (!file || paper.hasCls('loading')) {
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
            files = button.fileInputEl.dom.files;

        if (!files.length) {
            this.saveFilesComplete();
            return;
        }

        this.files = files;
        this.fileCount = files.length;
        this.fileErrors = [];

        this.saveFile(location, files[0], 0);
    },

    saveFile: function(location, file, index) {
        var view = this.getView(),
            next = index + 1,
            message = 'Uploading image {0} of {1}: {2}%';
        
        view.mask(Ext.String.format(message, index + 1, this.fileCount, 0));

        CB.service.File.upload({
            file: file,
            location: location,
            scope: this,
            progress: function(percent, e) {
                view.mask(Ext.String.format(message, index + 1, this.fileCount, percent));
            },
            success: function(result) {
                var f = location.files().add(Ext.create('CB.model.File', result.data));

                f[0].setLocation(location);

                this.fileDataChanged();

                if (next < this.fileCount) {
                    this.saveFile(location, this.files[next], next);
                } else {
                    this.saveFilesComplete();
                }
            },
            failure: function(msg) {
                this.fileErrors.push(msg);

                this.fileDataChanged();

                if (next < this.fileCount) {
                    this.saveFile(location, this.files[next], next);
                } else {
                    this.saveFilesComplete();
                }
            }
        });
    },
    
    saveFilesComplete: function() {
        this.getView().unmask();
        
        Ext.MessageBox.show({
            title: 'Success',
            msg: 'All files were successfully uploaded.',
            icon: Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK
        });
    },
    
    saveFilesException: function() {
        this.getView().unmask();
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: this.fileErrors.join('<br />'),
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
    },

    removeFile: function() {
        var vm = this.getViewModel(),
            location = vm.get('location'),
            file = vm.get('file');

        if (!file) {
            return;
        }

        if (location.files().getCount() < 2) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Sorry, but you can\'t delete the only image. Add some more, then remove it.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.MessageBox.OK
            });
            return;
        }

        Ext.MessageBox.confirm('Delete file?', 'Are you sure you want to delete this file?', function(btn) {
            if (btn === 'yes') {
                this.doRemoveFile(file);
            }
        }, this);
    },

    doRemoveFile: function(file) {
        var location = this.getViewModel().get('location'),
            files = location.files(),
            nextFile = this.getNextFile(),
            locationFiles = location.files;

        files.remove(file);

        files.sync({
            success: function(batch) {
                location.files = locationFiles; // fix extjs bug

                this.setFile(nextFile);

                this.fileDataChanged();
            },
            failure: function(batch) {
                location.files = locationFiles; // fix extjs bug

                location.files().rejectChanges();

                var exceptions = batch.getExceptions(),
                    msg = [];

                Ext.each(exceptions, function(exception){
                    msg.push(exception.getError());
                }, this);

                Ext.MessageBox.show({
                    title: 'Server Exception',
                    msg: msg.length ? msg.join('<br />') : 'Unable to remove file!',
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.MessageBox.OK
                });
            },
            scope: this
        });
    },

    fileDataChanged: function() {
        var vm = this.getViewModel(),
            location = vm.get('location'),
            files = location.files(),
            file = vm.get('file');
    
        vm.set('fileCount', files.getCount());
        vm.set('fileIndex', files.indexOf(file) + 1);
        vm.set('hasFiles', files.getCount() > 1);
    },

    /**
     * Zoom
     */

    zoomIn: function() {
        this.getView().down('cb-paper').zoomIn();
    },

    zoomOut: function() {
        this.getView().down('cb-paper').zoomOut();
    }
    
});
