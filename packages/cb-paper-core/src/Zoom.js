/**
 * Climbuddy paperjs zoom mixin
 */
Ext.define('CB.paper.Zoom', {
    
    config: {
        zoomFactor: Math.pow(1.1, 2)
    },
    
    constructor: function() {
        var view = this.getView();
        
        // provide functions for the view
        view.zoomIn = Ext.bind(this.zoomIn, this);
        view.zoomOut = Ext.bind(this.zoomOut, this);
    },
    
    zoomIn: function() {
        var newScale = this.getScale() * this.getZoomFactor();
        
        this.applyZoom(newScale);
    },
    
    zoomOut: function() {
        var newScale = this.getScale() * (1 / this.getZoomFactor());
        
        this.applyZoom(newScale);
    },
    
    applyZoom: function(newScale) {
        var ratio = newScale / this.getScale(),
            w = this.getImageScaledWidth(),
            h = this.getImageScaledHeight(),
            newW = this.getImageScaledWidth(newScale),
            newH = this.getImageScaledHeight(newScale),
            tx = this.getTranslateX(),
            ty = this.getTranslateY(),
            dx = (w - newW) / 2, // difference in x translation
            dy = (h - newH) / 2, // difference in y translation
            cx = tx + (w / 2),   // image center x
            cy = ty + (h / 2),   // image center y
            translateX = this.getTranslateX() + dx,
            translateY = this.getTranslateY() + dy;
    
        this.setScale(newScale);
        
        this.setTranslateX(translateX);
        this.setTranslateY(translateY);
        
        this.applyTransform();
        
        this.scaleLayers(ratio, cx, cy);
    }

});
