/**
 * Add location view model
 */
Ext.define('CB.view.location.AddModel', {
    extend: 'Ext.app.ViewModel',
    
    requires: [
        'Ext.data.JsonStore'
    ],

    alias: 'viewmodel.cb-location-add',
    
    data: {
        location: null,
        fileCount: 0
    },
    
    stores: {
        files: {
            type: 'json',
            fields: [
                {name: 'id',   type: 'integer'},
                {name: 'name', type: 'string'},
                {name: 'size', type: 'integer'},
                {name: 'type', type: 'string'},
                {name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s'}
            ]
        }
    },
    
    formulas: {
        types: function (get) {
            var location = get('location'),
                types = [];
        
            if (location) {
                location.types().each(function(type){
                    types.push(type.get('id'));
                });
            }
            
            return types;
        }
    }
    
});
