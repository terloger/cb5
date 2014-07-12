/**
 * Climbuddy paperjs location mixin
 */
Ext.define('CB.paper.Location', {
    
    config: {
        location: null
    },

    applyLocation: function(location) {
        // location not changed
        if (location === this.getLocation()) {
            return;
        }
        
        paper.project.clear();
        this.getLayers().removeAll();
        
        // clear location
        if (!location || !(location instanceof CB.model.Location)) {
            return null;
        }
        
        // confirm change
        return location;
    },

    updateLocation: function(location, oldLocation) {
        //this.fireEvent('locationchange', this, location, oldLocation);
    }

});
