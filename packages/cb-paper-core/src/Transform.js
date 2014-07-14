/**
 * Climbuddy paperjs transform mixin
 */
Ext.define('CB.paper.Transform', {
    
    applyTransform: function() {
        if (Ext.supports.Css3DTransforms) {
            this.applyTransform3D();
        } else if (Ext.supports.CssTransforms) {
            this.applyTransform2D();
        } else {
            this.applyTransform1D();
        }
    },
    
    applyTransform3D: function() {
        var scale = this.getScale(),
            x = this.getTranslateX(),
            y = this.getTranslateY(),
            transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(' + scale + ',' + scale + ', 1)',
            style = {
                'transform': transform,
                '-o-transform': transform,
                '-ms-transform': transform,
                '-moz-transform': transform,
                '-webkit-transform': transform
            };
    
        this.getImage().setStyle(style);
    },
    
    applyTransform2D: function() {
        var scale = this.getScale(),
            x = this.getTranslateX(),
            y = this.getTranslateY(),
            transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ',' + scale + ')',
            style = {
                'transform': transform,
                '-o-transform': transform,
                '-ms-transform': transform,
                '-moz-transform': transform,
                '-webkit-transform': transform
            };
    
        this.getImage().setStyle(style);
    },
    
    applyTransform1D: function() {
        var width = this.getImageScaledWidth() + 'px',
            height = this.getImageScaledHeight() + 'px',
            top = this.getTranslateY() + 'px',
            left = this.getTranslateX() + 'px',
            style = {
                width: width,
                height: height,
                top: top,
                left: left
            };
            
        this.getImage().setStyle(style);
    }

});
