Ext.define('CB.model.LocationType', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ],
    
    manyToMany: {
        Locations: {
            type: 'Location',
            role: 'locations',
            field: 'locationId',
            left: {
                field: 'typeId',
                role: 'types'
            }
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
