/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        hasLocation: function(get) {
            return get('location') instanceof CB.model.Location;
        },
        hasFiles: function(get) {
            var location = get('location');
            return location instanceof CB.model.Location ? location.files().getCount() > 1: false;
        },
        editMode: function(get) {
            var user = get('user'),
                location = get('location');
            return (user instanceof CB.model.User && location instanceof CB.model.Location);
        },
        fileCount: function(get) {
            var location = get('location');
            return location instanceof CB.model.Location ? location.files().getCount() : 0;
        },
        currentFile: function(get) {
            var location = get('location'),
                current;
            
            if (location && location instanceof CB.model.Location && location.files().getCount()) {
                return '';
            }
            
            return '';
        }
    }
    
});
