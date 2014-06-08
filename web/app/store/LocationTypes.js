Ext.define('CB.store.LocationTypes', {
    extend: 'Ext.data.Store',
    
    storeId: 'LocationTypes',
    
    model: 'CB.model.LocationType',
    
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

    autoLoad: false
});
