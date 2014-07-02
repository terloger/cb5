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
    
    data: {
        user: null
    },
    
    stores: {
        countries: {
            model: 'Country',
            autoLoad: true,
            session: true
        },
        gradeTypes: {
            model: 'GradeType',
            autoLoad: true,
            session: true 
        },
        locationTypes: {
            model: 'LocationType',
            autoLoad: true,
            session: true
        },
        locations: {
            model: 'Location',
            autoLoad: true,
            session: true
        }
    }
    
});
