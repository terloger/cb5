Ext.define('CB.model.Location', {
    extend: 'CB.model.Base',
    
    requires: [
        'Ext.data.proxy.Direct',
        'Ext.data.validator.Presence',
        'Ext.data.validator.Length',
        'CB.model.LocationType',
        'CB.model.Route',
        'CB.model.File'
    ],
    
    config: {
        marker: null
    },

    fields: [
        {name: 'countryId', reference: 'Country', unique: true},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'lat', type: 'float'},
        {name: 'lng', type: 'float'},
        {name: 'created', type: 'date'}
    ],
    
    validators: [
        {type: 'presence', name: 'name'},
        {type: 'length',   name: 'name', min: 3},
        {type: 'presence', name: 'description'},
        {type: 'length',   name: 'description', min: 3}
    ],

    proxy: {
        type: 'direct',
        api: {
            create  : 'CB.api.Location.save',
            read    : 'CB.api.Location.read',
            update  : 'CB.api.Location.save',
            destroy : 'CB.api.Location.destroy'
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'data',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json'
        }
    }
    
});
