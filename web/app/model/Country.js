Ext.define('CB.model.Country', {
    extend: 'CB.model.Base',
    
    idProperty: 'id',

    fields: [
        {name: 'locationId', reference: {type: 'Location', inverse: 'country'}},
        {name: 'name', type: 'string'},
        {name: 'iso', type: 'string'}
    ]
    
});
