/**
 * Map view model
 */
Ext.define('CB.view.map.MapModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-map',
    
    stores: {
        Locations: {
            source: 'Locations'
        },
        LocationTypes: {
            source: 'LocationTypes'
        }
    }
});
