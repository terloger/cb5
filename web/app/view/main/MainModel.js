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
            autoLoad: true,
            listeners: {
                load: {
                    fn: function() {

                        // create global grade store
                        // on first and hopefully the only load :)

                        var grades = [];
                        this.each(function(type){
                            grades = grades.concat(type.grades().getRange());
                        });
                        Ext.create('Ext.data.Store', {
                            model: 'Grade',
                            storeId: 'grades',
                            data: grades
                        });
                    },
                    single: true
                }
            }
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

                    // custom record creator which loads records
                    // from global stores if available insted of creating new ones

                    var schema = Ext.data.schema.Schema.get('default'),
                        record;

                    switch (schema.getEntityName(Model)) {
                        case 'Grade':
                            record = Ext.data.StoreManager.lookup('grades').getById(data.id);
                            break;
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
