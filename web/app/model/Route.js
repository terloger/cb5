Ext.define('CB.model.Route', {
    extend: 'CB.model.Base',

    idProperty: 'id',
    clientIdProperty: 'clientId',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'sectorId', reference: 'Sector'},
        {name: 'pos', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'created', type: 'date'},
        {name: 'fileId', type: 'int'}
    ]
    
});
