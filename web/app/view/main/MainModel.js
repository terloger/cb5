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
            autoLoad: true
        },
        gradeTypes: {
            model: 'GradeType',
            storeId: 'gradeTypes',
            autoLoad: true
        },
        locationTypes: {
            model: 'LocationType',
            storeId: 'locationTypes',
            autoLoad: true
        },
        locations: {
            model: 'Location',
            storeId: 'locations',
            autoLoad: {
                recordCreator: function(data, Model) {
                    var schema = Ext.data.schema.Schema.get('default'),
                        record;

                    switch (schema.getEntityName(Model)) {
                        case 'LocationType':
                            record = Ext.data.StoreManager.lookup('locationTypes').getById(data.id);
                            break;
                        case 'Country':
                            record = Ext.data.StoreManager.lookup('countries').getById(data.id);
                            break;
                        default:
                            // create new model instance
                            record = new Model(data);
                            record.phantom = false;
                            break;
                    }

                    return record;
                }
            }
        }
    }
    
});
