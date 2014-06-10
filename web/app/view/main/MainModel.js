/**
 * Main view model
 */
Ext.define('CB.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    
    requires: [
        'CB.model.Location'
    ],

    alias: 'viewmodel.cb-main',
    
    stores: {
        locations: {
            model: 'Location',
            session: true,
            autoLoad: true
        },
        locationTypes: {
            model: 'LocationType',
            autoLoad: true
        },
        grades: {
            model: 'GradeType',
            autoLoad: true
        }
    }
    
});
