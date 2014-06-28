Ext.define('CB.model.LocationType', {
    extend: 'CB.model.Base',

    idProperty: 'id',

    fields: [
        //{name: 'locationId', reference: {type: 'Location', inverse: 'types'}},
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ],
    
    manyToMany: {
        Locations: {
            type: 'Location',
            role: 'locations',
            field: 'locationId',
            right: {
                field: 'typeId',
                role: 'types'
            }
        }
    }
    
});
