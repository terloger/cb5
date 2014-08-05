    Ext.define('CB.model.LocationType', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ],
    
    manyToMany: {
        TypeLocations: {
            type: 'Location',
            role: 'locations',
            field: 'locationId',
            left: {
                field: 'typeId',
                role: 'types'
            }
        }
    }
    
});
