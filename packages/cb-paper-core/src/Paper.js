/**
 * Climbuddy paperjs core mixin
 */
Ext.define('CB.paper.Paper', {
    
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
        this.setCanvas(Ext.get('cb-canvas'));
        
        // init canvas
        //paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        this.resizePaper(w, h);
    },
    
    resizePaper: function(a, b, c) {
        var w = Ext.isNumber(a) ? a : b,
            h = Ext.isNumber(a) ? b : c;
    
        if (this.getCanvas() && paper.view) {
            this.getCanvas().setWidth(w);
            this.getCanvas().setHeight(h);
            paper.view.viewSize = new paper.Size(w, h);
            paper.view.draw();
        }
    }

});
