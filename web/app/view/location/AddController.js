/**
 * Add location controller
 */
Ext.define('CB.view.location.AddController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-add',
    
    init: function() {
        console.log('init CB.view.location.AddController');
    },
    
    saveLocation: function() {
        console.log('SAVE LOCATION');
        var view = this.getView(),
            session = view.getSession(),
            mainView = view.up('cb-main'),
            mainSession = mainView.getSession();
    
        console.log('main session', mainSession);
        console.log('main session changes', mainSession.getChanges());
        
        var batch = mainSession.getSaveBatch();
        console.log('batch', batch);
        batch.start();
    },
    
    clearFiles: function() {
        console.log('onFileClear');
        var view = this.getView(),
            grid = view.down('grid'),
            fileField = view.down('filebutton');
    
        view.getViewModel().set('fileCount', 0);
        grid.getStore().removeAll();
        fileField.reset();
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
    }
    
});
