/**
 * Add location controller
 */
Ext.define('CB.view.location.AddController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-add',
    
    /**
     * Core
     */
    
    save: function() {
        this.operations = [
            'saveLocation',
            'saveTypes',
            'saveFiles'
        ];
        
        this.saveLocation();
    },
    
    saveComplete: function() {
        var view = this.getView(),
            vm = view.getViewModel(),
            location = vm.get('location');
    
        view.unmask();
        
        this.close();
        
        this.fireEvent('createlocation', location);
    },
    
    operationComplete: function(operation) {
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
            session = view.getSession().getParent(),
            batch = session.getSaveBatch();
            
        view.mask('Saving Location ...');
        
        if (!batch) {
            this.saveLocationComplete();
            return;
        }
        
        batch.on({
            complete: this.saveLocationComplete,
            exception: this.saveLocationException,
            scope: this
        });
        
        batch.start();
    },
    
    saveLocationComplete: function(batch, operation) {
        this.operationComplete('saveLocation');
        this.saveTypes();
    },
    
    saveLocationException: function(batch, operation) {
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
        var view = this.getView(),
            location = view.getViewModel().get('location');
    
        location.types().each(function(type){
            type.drop();
        });
        
        if (records.length) {
            location.types().add(records);
        }
    },
    
    saveTypes: function() {
        var view = this.getView(),
            session = view.getSession().getParent(),
            changes = session.getChanges();
        
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
        this.operationComplete('saveTypes');
        
        this.saveFiles();
    },
    
    saveTypesException: function(result) {
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
        var view = this.getView(),
            grid = view.down('grid'),
            fileField = view.down('filebutton');
    
        view.getViewModel().set('fileCount', 0);
        grid.getStore().removeAll();
        fileField.reset();
    },
    
    saveFiles: function() {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            location = vm.get('location'),
            button = view.down('multifilebutton'),
            files = button.fileInputEl.dom.files,
            len = files.length,
            i = 0;
    
        this.fileCount = len;
        this.fileErrors = [];
    
        if (!len) {
            this.saveFilesComplete();
            return;
        }
        
        view.mask('Saving Location Files ...');
        
        for (; i < len; i++) {
            CB.service.File.upload({
                file: files[i],
                location: location,
                scope: this,
                success: function(result) {
                    location.files().add(Ext.create('CB.model.File', result.data));

                    if (--this.fileCount === 0) {
                        if (this.fileErrors.length) {
                            this.saveFilesException();
                        } else {
                            this.saveFilesComplete();
                        }
                    }
                },
                failure: function(msg) {
                    this.fileErrors.push(msg);

                    if (--this.fileCount === 0) {
                        this.saveFilesException();
                    }
                }
            });
        }
    },
    
    saveFilesComplete: function() {
        this.operationComplete('saveFiles');
    },
    
    saveFilesException: function() {
        Ext.MessageBox.show({
            title: 'Server Exception',
            msg: this.fileErrors.join('<br />'),
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
        
        this.operationComplete('saveFiles');
    }
    
});
