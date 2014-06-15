/**
 * Add/edit location controller
 */
Ext.define('CB.view.location.EditController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-edit',
    
    clearFiles: function() {
        console.log('onFileClear');
        var view = this.getView(),
            grid = view.down('grid'),
            fileField = view.down('filebutton');
    
        grid.getStore().removeAll();
        fileField.reset();
    },
    
    addFiles: function(button) {
        console.log('onFileAdd');
        var view = this.getView(),
            grid = view.down('grid'),
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
            console.log(file);
        }

        console.log(data);
        console.log(grid);

        grid.getStore().loadData(data);
    },
    
    removeFile: function(widgetButton) {
        console.log('onFileRemove');
        var view = this.getView(),
            grid = view.down('grid'),
            fileButton = view.down('filebutton'),
            record = widgetButton.getWidgetRecord();
        
        console.log(record);
        console.log(widgetButton);
        console.log(fileButton);
        console.log(grid);
        
        grid.getStore().remove(record);
        fileButton.removeFile(record.get('id'));
    }
    
});
