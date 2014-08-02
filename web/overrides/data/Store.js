Ext.define('CB.overrides.data.Store', {
    override: 'Ext.data.Store',
    
    loadData: function(data) {
        //console.log('load store data', arguments);
        if (data.length === 2) {
            //debugger;
        }
        this.callParent(arguments);
    },

    attemptLoad: function(options) {
        //console.log('attemptLoad', options);
        if (!this.isLoadBlocked()) {
            this.load(options);
        }
    }
    
});