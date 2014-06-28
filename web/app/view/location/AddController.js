/**
 * Add location controller
 */
Ext.define('CB.view.location.AddController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-add',
    
    saveLocation: function() {
        console.log('saveLocation');
        var view = this.getView(),
            session = view.getSession(),
            mainView = view.up('cb-main'),
            mainSession = mainView.getSession(),
            batch = mainSession.getSaveBatch(),
            location = view.getViewModel().get('location');
    
        
    
        console.log('main session', mainSession);
        console.log('main session changes', mainSession.getChanges());
        console.log('batch', batch);
        
        console.log('location', location);
        
        return;
        
        batch.on({
            complete: this.onBatchComplete,
            exception: this.onBatchException,
            scope: this
        });
        
        batch.start();
        
    },
    
    onBatchComplete: function() {
        console.log('complete', arguments);
    },
    
    onBatchException: function() {
        console.log('exception', arguments);
    },
    
    onTypeSelect: function(combo, records) {
        console.log('onTypeSelect');
        var view = this.getView(),
            session = view.getSession(),
            mainView = view.up('cb-main'),
            mainSession = mainView.getSession(),
            location = this.getView().getViewModel().get('location'),
            types = [],
            type;
                
        location.types().removeAll();
        
        if (records.length) {
            Ext.each(records, function(record){
                type = mainSession.createRecord('LocationType', {
                    name: record.get('name'),
                    type: record.get('type')
                });
                types.push(type);
            });
            location.types().add(types);
        }
    },
    
    addFiles: function(button) {
        console.log('onFileAdd');
        var view = this.getView(),
            grid = view.down('grid'),
            store = grid.getStore(),
            files = button.fileInputEl.dom.files,
            data = [],
            file;

        for (var i = 0, len = files.length; i < len; i++) {
            file = files[i];
            data.push({
                id:   i + 1,
                name: file.name,
                size: file.size,
                type: file.type,
                date: file.lastModifiedDate
            });
        }

        store.loadData(data);
        view.getViewModel().set('fileCount', store.getCount());
    },
    
    clearFiles: function() {
        console.log('onFileClear');
        var view = this.getView(),
            grid = view.down('grid'),
            fileField = view.down('filebutton');
    
        view.getViewModel().set('fileCount', 0);
        grid.getStore().removeAll();
        fileField.reset();
    }
    
});
