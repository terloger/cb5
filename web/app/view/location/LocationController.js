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
            return;
        }
        
        console.log('showLocation', location);
        
        var view = this.getView(),
            miniMap = this.getMiniMap(),
            vm = view.getViewModel(),
            rendered = view.rendered,
            visible = view.isVisible(),
            isLocation = location instanceof CB.model.Location,
            file = isLocation ? location.files().getAt(0) : null,
            center = isLocation ? new google.maps.LatLng(location.get('lat'), location.get('lng')) : null,
            showLocation = function() {
                vm.set('location', location);
                vm.set('file', file);
                
                // set map center
                if (miniMap && center) {
                    miniMap.setCenter(center, 15);
                }
            };
            
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
    
    
    createMiniMap: function() {
        // no google available
        if (typeof google === 'undefined') {
            console.log('no google');
            return false;
        }
        
        var view = this.getView().down('#minimap'),
            map = new google.maps.Map(view.body.dom, {
                zoom: 15,
                mapTypeId: 'satellite'
            });
        
        this.setMiniMap(map);
    },
    
    hideLocation: function() {
        console.log('hideLocation');
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper');
    
        vm.set('location', null);
        vm.set('file', null);
    },
    
    prevFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
            file = this.getPrevFile();
        
        if (!file) {
            return;
        }
        
        vm.set('file', file);
    },
    
    nextFile: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper'),
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
    
    setPaperTool: function(btn) {
        var paper = this.getView().down('cb-paper'),
            ctrl = paper.getController();
    
        ctrl.setActiveTool(btn.paperTool);
    }
    
});
