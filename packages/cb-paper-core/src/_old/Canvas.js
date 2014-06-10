Ext.define('CB.paper.Canvas', {
    
    config: {
        canvas: null
    },
    
    createCanvas: function() {
        this.setCanvas(this.getContainer().createChild({
            tag: 'canvas',
            cls: 'cb-paper-canvas',
            style: 'position:absolute;'
        }));
        
        paper.setup(this.getCanvas().dom);
        
        this.fireEvent('canvasready', this, this.getCanvas());
    }

});
