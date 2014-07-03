Ext.define('CB.model.Country', {
    extend: 'CB.model.Base',
    
    idProperty: 'id',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'name', type: 'string'},
        {name: 'iso', type: 'string'}
    ]
    
});
