/**
 * Climbuddy paperjs mouse mixin
 */
Ext.define('CB.paper.Mouse', {
    
    config: {
        scale: 1,
        translateX: 0,
        translateY: 0
    },
    
    constructor: function() {
        this.getCanvas().on({
            mousewheel: this.onPaperMouseWheel,
            mousedown: this.onPaperMouseDown,
            mousemove: this.onPaperMouseMove,
            mouseup: this.onPaperMouseUp,
            scope: this
        });
        // fix mouseup when out of window
        Ext.getDoc().on({
            mouseup: this.onPaperMouseUp,
            scope: this
        });
    },
    
    onPaperMouseWheel: function(e, el) {
        // calculate new scale and ratio
        var scale = this.getScale(),
            newScale = e.getWheelDelta() > 0 ? scale * 1.1 : scale / 1.1,
            ratio = newScale / scale;
    
        // constrain scale
        if (newScale < 0.1 || newScale > 6) {
            return;
        }
        
        // get mouse position within image
        var mx = e.getX() - this.getImage().getX();
        var my = e.getY() - this.getImage().getY();
        if (mx < 0) mx = 100;
        if (my < 0) my = 100;
        if (mx > (this.getImageWidth() * scale)) mx = this.getImageWidth() * scale - 100;
        if (my > (this.getImageHeight() * scale)) my = this.getImageHeight() * scale - 100;
        
        // get mouse position within image after resize
        var nx = mx * ratio;
        var ny = my * ratio;
        
        // get difference in mouse positions before and after resize
        var dx = mx - nx;
        var dy = my - ny;
        
        // calculate new translate x and y
        var translateX = this.getTranslateX() + dx;
        var translateY = this.getTranslateY() + dy;
        
        // set resize properties
        this.setScale(newScale);
        this.setTranslateX(translateX);
        this.setTranslateY(translateY);
        
        this.applyTransform();
        
        /*
        var path = this.path;
        var matrix = new paper.Matrix();
        var box = this.getCanvas().getBox();
        matrix.scale(ratio, ratio, new paper.Point(e.getX() - box.x, e.getY() - box.y));
        path.transform(matrix);
        paper.view.draw();
        */
    },
    
    onPaperMouseDown: function(e, t) {
        this.paperMouseMoveXY = e.getXY();
    },
    
    onPaperMouseMove: function(e, t) {
        if (this.paperMouseMoveXY) {
            
            var dx = e.getX() - this.paperMouseMoveXY[0];
            var dy = e.getY() - this.paperMouseMoveXY[1];

            /*
            var path = this.path;
            var matrix = new paper.Matrix();
            matrix.translate(dx, dy);
            path.transform(matrix);
            paper.view.draw();
            */
            
            var translateX = this.getTranslateX() + dx;
            var translateY = this.getTranslateY() + dy;
            
            this.setTranslateX(translateX);
            this.setTranslateY(translateY);
            
            this.applyTransform();
            
            this.paperMouseMoveXY = e.getXY();
        }
    },
    
    onPaperMouseUp: function(e, t) {
        this.paperMouseMoveXY = null;
    }

});
