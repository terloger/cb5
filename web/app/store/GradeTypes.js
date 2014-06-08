Ext.define('CB.store.GradeTypes', {
    extend: 'Ext.data.Store',
    
    storeId: 'GradeTypes',
    
    model: 'CB.model.GradeType',
    
    sorters: [{
        property: 'id',
        direction: 'ASC'
    }],

    autoLoad: false
});
