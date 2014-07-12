Ext.define('CB.model.Sector', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'name', type: 'string'},
        {name: 'created', type: 'date'}
    ]
    
});
