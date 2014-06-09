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
                create  : 'CB.api.{entityName}.save',
                read    : 'CB.api.{entityName}.read',
                update  : 'CB.api.{entityName}.save',
                destroy : 'CB.api.{entityName}.destroy'
            },
            reader: {
                type: 'json'
            }
        }
    }
    
});
