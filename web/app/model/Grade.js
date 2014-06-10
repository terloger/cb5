Ext.define('CB.model.Grade', {
    extend: 'CB.model.Base',
    
    idProperty: 'id',

    fields: [
        {name: 'routeId', reference: 'Route'},
        {name: 'typeId', reference: 'GradeType'},
        {name: 'score', type: 'int'},
        {name: 'grade', type: 'string'},
        {name: 'typeId', type: 'int'}
    ],

    getType: function() {
        return Ext.StoreManager.lookup('gradeTypes').getById(this.get('typeId'));
    }
    
});
