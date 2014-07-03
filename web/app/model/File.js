Ext.define('CB.model.File', {
    extend: 'CB.model.Base',
    
    requires: [
        'CB.model.Layer'
    ],

    idProperty: 'id',
    
    fields: [
        {name: 'locationId', reference: 'Location'},
        {name: 'name', type: 'string'},
        {name: 'fileName', type: 'string'},
        {name: 'extension', type: 'string'},
        {name: 'mimeType', type: 'string'},
        {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	],

    proxy: {
        type: 'direct',
        api: {
            destroy : 'CB.api.Location.removeFile'
        }
    },

    getFolder: function(size) {
        return CB.Config.get('folder.uploads') + '/' +
                Ext.Date.format(this.get('created'), 'Y/m/d') + '/' +
                this.get('fileName') + (size ? '_' + size : '') + '.' + this.get('extension');
    },

    getUrl: function(size) {
        return CB.Config.get('url.uploads') + '/' +
                Ext.Date.format(this.get('created'), 'Y/m/d') + '/' +
                this.get('fileName') + (size ? '_' + size : '') + '.' + this.get('extension');
    }

});
