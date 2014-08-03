Ext.define('CB.model.Country', {
    extend: 'CB.model.Base',
    
    fields: [
        {name: 'locationId', reference: 'Location', unique: true},
        {name: 'name', type: 'string'},
        {name: 'iso', type: 'string'}
    ]
    
});
