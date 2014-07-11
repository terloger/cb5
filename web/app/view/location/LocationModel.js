/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    formulas: {
        draw: function(get) {
            //console.log('draw', get('user') && get('location') && get('routes.selection'));
            return get('user') && get('location') && get('routes.selection');
        }
    }
    
});
