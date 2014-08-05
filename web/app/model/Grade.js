Ext.define('CB.model.Grade', {
    extend: 'CB.model.Base',

    fields: [
        {name: 'routeId', reference: 'Route'},
        {name: 'typeId', reference: {
            type: 'GradeType',
            association: 'GradeTypeGrades',
            role: 'type',
            inverse: 'grades'
        }},
        {name: 'score', type: 'int'},
        {name: 'grade', type: 'string'}
    ]
    
});
