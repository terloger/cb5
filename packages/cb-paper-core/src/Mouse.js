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
        this.on({
            toolchange: this.paperMouseToolChange,
            scope: this
        });
    },
    
    paperMouseToolChange: function(name, tool) {
        switch (name) {
            case 'pen':
            case 'select':
                this.suspendPaperMouseEvents();
                break;
            case 'move':
                this.resumePaperMouseEvents();
                break;
        }
    },
    
    suspendPaperMouseEvents: function() {
        console.log('suspendPaperMouseEvents');
        this.getCanvas().un({
            mousewheel: this.onPaperMouseWheel,
            mousedown: this.onPaperMouseDown,
            mousemove: this.onPaperMouseMove,
            mouseup: this.onPaperMouseUp,
            scope: this
        });
        // fix mouseup when out of window
        Ext.getDoc().un({
            mouseup: this.onPaperMouseUp,
            scope: this
        });
    },
    
    resumePaperMouseEvents: function() {
        console.log('resumePaperMouseEvents');
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
        
        // apply transformation
        this.applyTransform();
        
        // calculate layer ratio and center xy
        var box = this.getCanvas().getBox();
        var cx = e.getX() - box.x;
        var cy = e.getY() - box.y;
        
        // scale layers
        this.scaleLayers(ratio, cx, cy);
    },
    
    onPaperMouseDown: function(e, t) {
        this.paperMouseMoveXY = e.getXY();
    },
    
    onPaperMouseMove: function(e, t) {
        if (this.paperMouseMoveXY) {
            
            var dx = e.getX() - this.paperMouseMoveXY[0];
            var dy = e.getY() - this.paperMouseMoveXY[1];
            
            this.translateLayers(dx, dy);
            
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
