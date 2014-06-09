/**
 * Main view model
 */
Ext.define('CB.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-main',

    data: {
        name: 'Climbuddy',
        version: '1.0'
    },
    
    session: Ext.create('Ext.data.Session'),
    
    stores: {
        Locations: {
            source: 'Locations'
        },
        LocationTypes: {
            source: 'LocationTypes'
        }
    }
    
});
