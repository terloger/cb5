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
    
    config: {
        data: {
            user: null
        },
        stores: {
            countries: {
                model: 'Country',
                autoLoad: true
            },
            locationTypes: {
                model: 'LocationType',
                autoLoad: true
            },
            gradeTypes: {
                model: 'GradeType',
                autoLoad: true
            },
            locations: {
                model: 'Location',
                session: true,
                autoLoad: true
            }
        }
    }
    
});
