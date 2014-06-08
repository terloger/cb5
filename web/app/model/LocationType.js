Ext.define('CB.model.LocationType', {
    extend: 'CB.model.Base',

    idProperty: 'id',

    fields: [
        {name: 'locationId', reference: {type: 'Location', inverse: 'types'}},
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ]
});
