Ext.define('CB.model.Layer', {
    extend: 'CB.model.Base',
    
    clientIdProperty: 'clientId',

    fields: [
        {name: 'routeId', reference: 'Route'},
        {name: 'fileId', reference: 'File'},
        {name: 'data', type: 'string'},
        {name: 'created', type: 'date'}
    ],
    
    config: {
        paperLayer: null
    },
    
    proxy: {
        type: 'direct',
        api: {
            create:   'CB.api.Layer.create',
            read:     'CB.api.Layer.read',
            update:   'CB.api.Layer.update',
            destroy:  'CB.api.Layer.destroy'
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
