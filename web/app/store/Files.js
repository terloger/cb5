Ext.define('CB.store.Files', {
    extend: 'Ext.data.Store',
    
    storeId: 'Files',
    
    model: 'CB.model.File',
    
    autoLoad: false
});
