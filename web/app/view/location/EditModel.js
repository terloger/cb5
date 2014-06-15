/**
 * Add/edit location view model
 */
Ext.define('CB.view.location.EditModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location-edit',
    
    formulas: {
        types: function () {
            var types = [];
            
            this.get('location').types().each(function(type){
                types.push(type.get('id'));
            });
            
            return types;
        }
    }
    
});
