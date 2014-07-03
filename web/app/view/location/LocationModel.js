/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        isLocation: function(get) {
            return get('location') instanceof CB.model.Location;
        },
        isEditMode: function(get) {
            var user = get('user'),
                location = get('location');
            return (user instanceof CB.model.User && location instanceof CB.model.Location);
        },
        hasFiles: function(get) {
            var location = get('location');
            return location instanceof CB.model.Location ? location.files().getCount() > 1: false;
        },
        fileCount: function(get) {
            var location = get('location');
            return location instanceof CB.model.Location ? location.files().getCount() : 0;
        }
    }
    
});
