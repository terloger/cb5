Ext.define('CB.model.Sector', {
    extend: 'CB.model.Base',

    idProperty: 'sectorId',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'name', type: 'string'},
        {name: 'created', type: 'date'}
    ]
    
});
