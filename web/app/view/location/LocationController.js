/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    init: function() {
        this.getViewModel().bind('{location}', this.showLocation, this);
    },
    
    showLocation: function(location) {
        if (!location) {
            return;
        }
        
        console.log('showLocation', location);
        
        var view = this.getView(),
            vm = view.getViewModel(),
            rendered = view.rendered,
            visible = view.isVisible(),
            paper = view.down('cb-paper'),
            file = location && location.files ? location.files().getAt(0) : null,
            showLocation = function() {
                vm.set('location', location);
                vm.set('file', file);
                paper.getViewModel().set('location', location);
                paper.setLocation(location);
                paper.setFile(file);
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
    
    hideLocation: function() {
        console.log('hideLocation');
        var view = this.getView(),
            vm = view.getViewModel(),
            paper = view.down('cb-paper');
    
        vm.set('location', null);
        vm.set('file', null);
        paper.setLocation(null);
        paper.setFile(null);
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
        paper.setFile(file);
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
        paper.setFile(file);
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
    }
    
});
