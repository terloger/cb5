Ext.define('CB.paper.File', {
    
    config: {
        file: null
    },

    applyFile: function(file) {
        // check file record
        if (!(file instanceof CB.model.File)) return;
        
        // load file image
        this.loadImage(file.getUrl('720'));
        
        // confirm change
        return file;
    },
    
    updateFile: function(newFile, oldFile) {
        //this.fireEvent('filechange', this, newFile, oldFile);
    }

});
