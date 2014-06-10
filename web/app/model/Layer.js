Ext.define('CB.model.Layer', {
    extend: 'CB.model.Base',
    
    idProperty: 'id',
    clientIdProperty: 'clientId',

    fields: [
        {name: 'routeId', reference: 'Route'},
        {name: 'fileId', reference: 'File'},
        {name: 'data', type: 'string'},
        {name: 'created', type: 'date'}
    ]
    
});
