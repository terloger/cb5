/**
 * This class is the base class for all entities in the application.
 */
Ext.define('CB.model.Base', {
    extend: 'Ext.data.Model',

    schema: {
        namespace: 'CB.model',
        proxy: {
            type: 'direct',
            api: {
                read: 'CB.api.{entityName}.read'
            },
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success',
                messageProperty: 'message'
            }
        }
    }
    
});
