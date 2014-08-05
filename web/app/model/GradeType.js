Ext.define('CB.model.GradeType', {
    extend: 'CB.model.Base',

    requires: [
        'CB.model.Grade'
    ],
    
    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'}
    ]
    
});
