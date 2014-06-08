Ext.define('CB.store.Routes', {
    extend: 'Ext.data.Store',
    
    storeId: 'Routes',
    
    model: 'CB.model.Route',
    
    sorters: [{
        property: 'pos',
        direction: 'ASC'
    }],
    
    autoLoad: false
});
