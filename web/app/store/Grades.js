Ext.define('CB.store.Grades', {
    extend: 'Ext.data.Store',
    
    storeId: 'Grades',
    
    model: 'CB.model.Grade',
    
    autoLoad: false
});
