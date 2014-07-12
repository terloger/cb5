/**
 * Climbuddy paperjs canvas mixin
 */
Ext.define('CB.paper.Canvas', {
    
    config: {
        paper: null,
        canvas: null
    },
    
    constructor: function() {
        var view = this.getView(),
            w = view.getWidth(),
            h = view.getHeight();
        
        // set paper, canvas and image reference
        this.setPaper(Ext.get('cb-paper'));
        this.setImage(Ext.get('cb-image'));
        this.setCanvas(Ext.get('cb-canvas'));
        
        // init canvas
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        this.resizePaper(w, h);
    }

});
