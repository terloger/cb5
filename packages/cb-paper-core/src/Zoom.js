/**
 * Climbuddy paperjs zoom mixin
 */
Ext.define('CB.paper.Zoom', {
    
    zoomIn: function() {
        var scale = this.getScale(),
            newScale = scale * Math.pow(1.1, 2),
            w = scale * this.getImageWidth(),
            h = scale * this.getImageHeight(),
            newW = newScale * this.getImageWidth(),
            newH = newScale * this.getImageHeight(),
            dx = (w - newW) / 2,
            dy = (h - newH) / 2,
            translateX = this.getTranslateX() + dx,
            translateY = this.getTranslateY() + dy;
        
        this.setScale(newScale);
        this.setTranslateX(translateX);
        this.setTranslateY(translateY);
        this.applyTransform();
    },
    
    zoomOut: function() {
        var scale = this.getScale(),
            newScale = scale * (1 / Math.pow(1.1, 2)),
            w = scale * this.getImageWidth(),
            h = scale * this.getImageHeight(),
            newW = newScale * this.getImageWidth(),
            newH = newScale * this.getImageHeight(),
            dx = (w - newW) / 2,
            dy = (h - newH) / 2,
            translateX = this.getTranslateX() + dx,
            translateY = this.getTranslateY() + dy;
        
        this.setScale(newScale);
        this.setTranslateX(translateX);
        this.setTranslateY(translateY);
        this.applyTransform();
    }

});
