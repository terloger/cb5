/**
 * Climbuddy paperjs location mixin
 */
Ext.define('CB.paper.Location', {
    
    config: {
        /**
         * Location record
         * 
         * @param {CB.model.Location} location
         */
        location: null
    },

    /**
     * Apply location
     * 
     * @param {CB.model.Location} location
     */
    applyLocation: function(location) {
        // check if location and if changed
        if (!(location instanceof CB.model.Location) || this.getLocation() === location) {
            return;
        }
        

        // set file
        var file = location.files().getAt(0);
        if (file) {
            this.setFile(file);
        }
        
        // confirm change
        return location;
    },
    
    /**
     * Update location
     * 
     * @param {CB.model.Location} oldLocation
     * @param {CB.model.Location} newLocation
     */
    updateLocation: function(newLocation, oldLocation) {
        this.fireEvent('locationchange', this, newLocation, oldLocation);
    }

});
