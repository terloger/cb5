/**
 * Main view model
 */
Ext.define('CB.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    
    requires: [
        'CB.model.Location',
        'CB.model.User'
    ],

    alias: 'viewmodel.cb-main',
    
    stores: {
        countries: {
            model: 'Country',
            storeId: 'countries',
            session: true,
            autoLoad: true
        },
        gradeTypes: {
            model: 'GradeType',
            storeId: 'gradeTypes',
            session: true,
            autoLoad: true
        },
        locationTypes: {
            model: 'LocationType',
            storeId: 'locationTypes',
            session: true,
            autoLoad: true
        },
        locations: {
            model: 'Location',
            storeId: 'locations',
            session: true,
            autoLoad: true
        }
    }
    
});
