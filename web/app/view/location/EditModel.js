/**
 * Add/edit location view model
 */
Ext.define('CB.view.location.EditModel', {
    extend: 'Ext.app.ViewModel',
    
    requires: [
        'Ext.data.JsonStore'
    ],

    alias: 'viewmodel.cb-location-edit',
    
    data: {
        location: null,
        fileCount: 0
    },
    
    constructor: function(config) {
        var me = this;
        
        // add stores manually
        Ext.apply(config, {
            stores: {
                files: {
                    type: 'json',
                    fields: [
                        {name: 'id',   type: 'integer'},
                        {name: 'name', type: 'string'},
                        {name: 'size', type: 'integer'},
                        {name: 'type', type: 'string'},
                        {name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s'}
                    ],
                    listeners: {
                        datachanged: function () {
                            me.set('fileCount', this.getCount());
                        }
                    }
                }
            }
        });
        
        me.callParent(arguments);
    },
    
    formulas: {
        types: function (get) {
            var types = [];
            
            get('location').types().each(function(type){
                types.push(type.get('id'));
            });
            
            return types;
        }
    }
    
});
