Ext.define('CB.model.Grade', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'typeId', reference: {
            type: 'GradeType',
            association: 'TypeGrades',
            role: 'type',
            inverse: 'grades'
        }},
        {name: 'score', type: 'int'},
        {name: 'grade', type: 'string'}
    ]
    
});
