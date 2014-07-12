Ext.define('CB.model.Route', {
    extend: 'CB.model.Base',

    clientIdProperty: 'clientId',

    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'pos', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'created', type: 'date'},
        {name: 'fileId', type: 'int'}
    ],
    
    proxy: {
        type: 'direct',
        api: {
            create:   'CB.api.Route.create',
            read:     'CB.api.Route.read',
            update:   'CB.api.Route.update',
            destroy:  'CB.api.Route.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            allowSingle: false
        }
    }
    
});
