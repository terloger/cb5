Ext.define('CB.store.Countries', {
    extend: 'Ext.data.Store',
    
    storeId: 'Countries',
    
    model: 'CB.model.Country',
    
    autoLoad: false
});
