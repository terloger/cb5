Ext.define('CB.data.Connection', {
    extend: 'Ext.data.Connection',

    method: 'PUT',
    disableCaching: true,
    defaultHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
    },

    onProgress: null,

    getXhrInstance : function() {
        var xhr = this.callParent(arguments);

        if (this.onProgress) {
            xhr.upload.onprogress = this.onProgress;
        }

        return xhr;
    },

    uploadFile: function(File, config) {
        var onProgress = config.progress;
        if (onProgress) {
            this.onProgress = onProgress;
        }

        config = Ext.applyIf(config, {
            xmlData: File
        });

        this.request(config);
    }

});
