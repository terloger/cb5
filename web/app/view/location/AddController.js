/**
 * Add location controller
 */
Ext.define('CB.view.location.AddController', {
    extend: 'Ext.app.ViewController',
    
    requires: [
        'CB.data.Connection'
    ],

    alias: 'controller.cb-location-add',
    
    /**
     * Core
     */
    
    save: function() {
        console.log('save');
        this.operations = [
            'saveLocation',
            'saveTypes',
            'saveFiles'
        ];
        
        this.saveLocation();
    },
    
    saveComplete: function() {
        console.log('saveComplete');
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        view.unmask();
        
        this.close();
        
        this.fireEvent('createlocation', location);
    },
    
    operationComplete: function(operation) {
        console.log('operationComplete', operation);
        var index = this.operations.indexOf(operation);
        
        if (index > -1) {
            this.operations.splice(index, 1);
        }
        
        if (this.operations.length === 0) {
            this.saveComplete();
        }
    },
    
    close: function() {
        var view = this.getView(),
            mainView = view.up('cb-main'),
            mapView = mainView.down('cb-map');
    
        mainView.setActiveTab(mapView);
    },
    
    hideView: function() {
        this.getView().destroy();
    },
    
    /**
     * Location
     */
    
    saveLocation: function() {
        var view = this.getView(),
            session = view.getSession(),
            batch = session.getSaveBatch();
            
        console.log('saveLocation', session.getChanges());
        
        this.getView().mask('Saving Location ...');
        
        if (!batch) {
            this.saveLocationComplete();
            return;
        }
        
        batch.on({
            complete: this.saveLocationComplete,
            exception: this.saveLocationException,
            single: true,
            scope: this
        });
        
        batch.start();
    },
    
    saveLocationComplete: function(batch, operation) {
        console.log('saveLocationComplete');
        this.operationComplete('saveLocation');
        this.saveTypes();
    },
    
    saveLocationException: function(batch, operation) {
        console.log('saveLocationException', arguments);
        var exceptions = batch.getExceptions(),
            msg = [];
    
        Ext.each(exceptions, function(exception){
            msg.push(exception.getError());
        }, this);
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: msg.length ? msg.join('<br />') : 'Unable to save Location!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveLocation');
        this.operationComplete('saveTypes');
        this.operationComplete('saveFiles');
    },
    
    /**
     * Types
     */
    
    setTypes: function(combo, records) {
        console.log('setTypes', records);
        var view = this.getView(),
            location = view.getViewModel().get('location');
    
        location.types().removeAll();
        
        if (records.length) {
            location.types().add(records);
        }
    },
    
    saveTypes: function() {
        var view = this.getView(),
            session = view.getSession(),
            changes = session.getChanges();
        
        console.log('saveTypes', changes);
        
        if (changes && changes.LocationType && changes.LocationType.locations) {
            this.getView().mask('Saving Location Types ...');
            
            CB.api.Location.setTypes(changes.LocationType.locations, function(result) {
                if (result && result.success) {
                    this.saveTypesComplete(result);
                } else {
                    this.saveTypesException(result);
                }
            }, this);
        } else {
            this.saveFiles();
        }
    },
    
    saveTypesComplete: function(result) {
        console.log('saveTypesSuccess', result);
        
        this.operationComplete('saveTypes');
        
        this.saveFiles();
    },
    
    saveTypesException: function(result) {
        console.log('saveTypesException', result);
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: result && result.message ? result.message : 'Unable to save Location Types!',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveTypes');
    },
    
    /**
     * Files
     */
    
    setFiles: function(button) {
        var view = this.getView(),
            grid = view.down('grid'),
            store = grid.getStore(),
            files = button.fileInputEl.dom.files,
            data = [],
            file;

        console.log('setFiles', files);
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
        console.log('clearFiles');
        var view = this.getView(),
            grid = view.down('grid'),
            fileField = view.down('filebutton');
    
        view.getViewModel().set('fileCount', 0);
        grid.getStore().removeAll();
        fileField.reset();
    },
    
    saveFiles: function() {
        var view = this.getView(),
            button = view.down('multifilebutton'),
            files = button.fileInputEl.dom.files,
            len = files.length,
            i = 0;
    
        this.fileCount = len;
        this.fileErrors = [];
    
        console.log('saveFiles', files);
        
        if (!len) {
            this.saveFilesComplete();
            return;
        }
        
        this.getView().mask('Saving Location Files ...');
        
        for (; i < len; i++) {
            this.saveFile(files[i]);
        }
    },
    
    saveFilesComplete: function() {
        console.log('saveFilesComplete');
        
        this.operationComplete('saveFiles');
    },
    
    saveFilesException: function() {
        console.log('saveFilesExceptions');
        
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: this.fileErrors.join('<br />'),
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveFiles');
    },
    
    /**
     * File
     */
    
    saveFile: function(File) {
        console.log('saveFile', File);
        var view = this.getView(),
            viewModel = view.getViewModel(),
            location = viewModel.get('location'),
            connection = Ext.create('CB.data.Connection', {
                url: '/api/upload-file/'
            });

        connection.uploadFile(File, {
            headers: {
                'X-Location-Id': location.get('id'),
                'X-File-Name': File.name
            },
            /*progress: function(e) {
            },*/
            success: function(response, operation) {
                try {
                    var result = Ext.JSON.decode(response.responseText, true);
                    if (result.success) {
                        this.saveFileComplete(result);
                    } else {
                        this.saveFileException(result.message ? result.message : 'Unable to upload File!');
                    }
                } catch (e) {
                    this.saveFileException('Error processing response from server.');
                }
            },
            failure: function(response, operation) {
                this.saveFileException('Error ' + response.status + ': ' + response.statusText);
            },
            scope: this
        });
    },
    
    saveFileComplete: function(result) {
        console.log('saveFileComplete', result);
        var view = this.getView(),
            viewModel = view.getViewModel(),
            location = viewModel.get('location');
    
        location.files().add(Ext.create('CB.model.File', result.data));
        
        if (--this.fileCount === 0) {
            if (this.fileErrors.length) {
                this.saveFilesException();
            } else {
                this.saveFilesComplete();
            }
        }
    },
    
    saveFileException: function(msg) {
        console.log('saveFileException', msg);
        this.fileErrors.push(msg);
        
        if (--this.fileCount === 0) {
            this.saveFilesException();
        }
    }
    
});
