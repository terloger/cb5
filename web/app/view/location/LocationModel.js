/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        draw: function(get) {
            return get('user') && get('location') && get('routes.selection');
        }
    }
    
});
