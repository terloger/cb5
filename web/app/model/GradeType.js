Ext.define('CB.model.GradeType', {
    extend: 'CB.model.Base',
    
    idProperty: 'id',

    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ]
});
