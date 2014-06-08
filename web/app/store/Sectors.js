Ext.define('CB.store.Sectors', {
    extend: 'Ext.data.Store',
    
    storeId: 'Sectors',
    
    model: 'CB.model.Sector',
    
    sorters: [{
        property: 'name',
        direction: 'DESC'
    }],

    autoLoad: false
});
