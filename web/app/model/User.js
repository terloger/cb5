Ext.define('CB.model.User', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'username', type: 'string'},
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'permission', type: 'int'},
        {name: 'created', type: 'date'}
    ]
    
});
