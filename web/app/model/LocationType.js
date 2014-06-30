Ext.define('CB.model.LocationType', {
    extend: 'CB.model.Base',

    idProperty: 'id',

    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ],
    
    manyToMany: {
        Locations: {
            type: 'Location',
            role: 'locations',
            field: 'locationId'
        }
    },
    
    proxy: {
        type: 'direct',
        api: {
            create:  'CB.api.LocationType.create',
            read:    'CB.api.LocationType.read',
            update:  'CB.api.LocationType.update',
            destroy: 'CB.api.LocationType.destroy'
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
