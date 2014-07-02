/**
 * Add location controller
 */
Ext.define('CB.view.location.AddController', {
    extend: 'Ext.app.ViewController',
    
    requires: [
        'CB.data.Connection'
    ],

    alias: 'controller.cb-location-add',
    
    close: function() {
        var view = this.getView(),
            mainView = view.up('cb-main'),
            mapView = mainView.down('cb-map');
    
        mainView.setActiveTab(mapView);
    },
    
    onHide: function() {
        this.getView().destroy();
    },
    
    saveLocation: function() {
        console.log('saveLocation');
        var view = this.getView(),
            session = view.getSession(),
            location = view.getViewModel().get('location'),
            batch = session.getSaveBatch();
    
        console.log('changes', session.getChanges());
        console.log('batch', batch);
        
        batch.on({
            complete: this.onSaveComplete,
            exception: this.onSaveException,
            scope: this
        });
        
        batch.start();
    },
    
    onSaveComplete: function() {
        console.log('onSaveComplete', arguments);
        console.log('changes', this.getView().getSession().getChanges());
        console.log('changes', this.getView().getSession().getSaveBatch());
    },
    
    onSaveException: function() {
        console.log('onSaveException', arguments);
    },
    
    onTypeSelect: function(combo, records) {
        console.log('onTypeSelect');
        var view = this.getView(),
            location = view.getViewModel().get('location');
    
        console.log(records);
        
        location.types().removeAll();
        
        if (records.length) {
            location.types().add(records);
        }
        
        console.log(location.types());
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
    },
    
    uploadFiles: function() {
        var view = this.getView(),
            viewModel = view.getViewModel(),
            session = view.getSession(),
            location = viewModel.get('location'),
            button = view.down('multifilebutton'),
            files = button.fileInputEl.dom.files,
            fileCount = files.length;

        if (!fileCount) {
            return;
        }
        
        // mask

        for (var i = 0, len = files.length; i < len; i++) {
            var File = files[i];

            var connection = Ext.create('CB.data.Connection', {
                url: '/api/upload-file/'
            });

            connection.uploadFile(File, {
                headers: {
                    'X-Location-Id': location.get('id'),
                    'X-File-Name': File.name
                },
                progress: function(e) {
                },
                success: function(response, operation) {
                    if (--fileCount === 0) {
                        // unmask
                    }
                    if (response.status === 200) {
                        try
                        {
                            var result = Ext.JSON.decode(response.responseText, true);
                            if (result.success) {
                                location.files().add(session.createRecord('File', result.data));
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Server Exception',
                                    msg: result.message,
                                    icon: Ext.MessageBox.ERROR,
                                    buttons: Ext.MessageBox.OK
                                });
                            }
                        } catch (e) {
                            Ext.MessageBox.show({
                                title: 'Server Exception',
                                msg: 'Error processing response from server.',
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.MessageBox.OK
                            });
                        }
                    }
                },
                failure: function(response, operation) {
                    if (--fileCount === 0) {
                        // unmask
                    }
                    Ext.MessageBox.show({
                        title: 'Server Exception',
                        msg: 'Error ' + response.status + ': ' + response.statusText,
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.MessageBox.OK
                    });
                },
                scope: this
            });
        }
    }
    
});
