Ext.define('CB.paper.Location', {
    
    config: {
        location: null
    },

    applyLocation: function(location) {
        // check location record
        if (!(location instanceof CB.model.Location)) return;
        
        // check if location changed
        if (this.getLocation() === location) return;

        // set file
        var file = location.files().getAt(0);
        if (file) this.setFile(file);
        
        // confirm change
        return location;
    },
    
    updateLocation: function(newLocation, oldLocation) {
        this.fireEvent('locationchange', this, newLocation, oldLocation);
    }

});
