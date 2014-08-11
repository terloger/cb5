/**
 * Climbuddy paperjs file mixin
 */
Ext.define('CB.paper.File', {
    
    config: {
        file: null,
        fileSize: '1080'
    },

    applyFile: function(file) {
        // not changed
        if (file === this.getFile()) {
            this.getView().removeCls('loading');
            return;
        }
        
        // remove existing project
        if (paper.project) {
            paper.project.remove();
        }
        
        // setup new project
        paper.setup(this.getCanvas().dom);
        
        // clear image
        if (this.getImage()) {
            this.getImage().destroy();
            this.setImage(null);
        }
        
        // must be a valid file or we're passing null
        if (!file || !(file instanceof CB.model.File)) {
            return null;
        }
        
        // start loading image
        this.preloadImage(file);
        
        // confirm file change
        return file;
    },
    
    updateFile: function(file, oldFile) {
        //this.fireEvent('filechange', this, file, oldFile);
    }

});
