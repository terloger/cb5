/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        hasUser: function(get) {
            return get('user') instanceof CB.model.User;
        },
        hasLocation: function(get) {
            return get('location') instanceof CB.model.Location;
        },
        hasFiles: function(get) {
            return get('hasLocation') && get('location').files().getCount() > 1;
        },
        editMode: function(get) {
            return get('hasUser') && get('hasLocation') && get('routes').selection;
        },
        fileCount: function(get) {
            return get('hasLocation') ? get('location').files().getCount() : 0;
        }
    }
    
});
