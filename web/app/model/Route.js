Ext.define('CB.model.Route', {
    extend: 'CB.model.Base',

    idProperty: 'id',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'pos', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'created', type: 'date'},
        {name: 'fileId', type: 'int'}
    ],
    
    proxy: null
    
});
