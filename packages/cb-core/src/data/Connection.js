Ext.define('CB.data.Connection', {
    extend: 'Ext.data.Connection',

    onProgress: Ext.emptyFn,

    getXhrInstance : function() {
        var xhr = this.callParent(arguments);

        if (this.onProgress) {
            xhr.upload.onprogress = this.onProgress;
        }

        return xhr;
    },

    request : function(options) {
        if (options.progress) {
            this.onProgress = Ext.bind(options.progress, options.scope || this);
        }

        this.callParent(arguments);
    }

});