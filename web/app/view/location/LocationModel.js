/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        fileCount: function(get) {
            var location = get('location');
            return location ? location.files().getCount() : 0;
        }
    }
    
});
