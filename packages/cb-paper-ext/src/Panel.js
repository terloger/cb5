/**
 * Climbuddy ExtJS paper panel
 */
Ext.define('CB.paper.Panel', {
    extend: 'Ext.container.Container',
    xtype : 'cb-paper',
    
    mixins: {
        location: 'CB.paper.Location',
        layer: 'CB.paper.Layer',
        path: 'CB.paper.Path',
        tools: 'CB.paper.Tools'
    },
    
    html: [
        '<div id="paper" class="paper">',
            '<img id="image" class="image" src="" />',
            '<canvas id="canvas" class="canvas"></canvas>',
        '</div>'
    ].join(''),
    
    config: {
        location: null,
        route: null,
        file: null,
        canvas: null,
        image: null,
        
        imageWidth: 0,
        imageHeight: 0,
        imagePadding: 10,
        
        scale: 1,
        startScale: 1,
        translateX: 0,
        translateY: 0
    },
    
    /**
     * Core
     */
    
    initComponent: function() {
        this.callParent();
        
        // initialize panel on afterrender
        this.on({
            afterrender: this.onAfterRender,
            delay: 1,
            scope: this
        });
        
        Ext.util.Observable.capture(this, function() {
            console.log('capture', arguments);
        });
    },
    
    onAfterRender: function() {
        // set canvas and image reference
        this.setImage(Ext.get('image'));
        this.setCanvas(Ext.get('canvas'));
        
        // set absolute position and transform origin
        var style = {
            position: 'absolute',
            'transform-origin': '0 0',
            '-o-transform-origin': '0 0',
            '-ms-transform-origin': '0 0',
            '-moz-transform-origin': '0 0',
            '-webkit-transform-origin': '0 0'
        };
        
        // set canvas and image styles
        this.getImage().setStyle(style);
        this.getCanvas().setStyle(style);
        
        // init canvas
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        var w = this.getWidth();
        var h = this.getHeight();
        this.getCanvas().setWidth(w);
        this.getCanvas().setHeight(h);
        paper.view.viewSize = new paper.Size(w, h);
        
        // draw listeners
        if (Ext.supports.Touch) {
            this.getCanvas().on({
                touchstart: this.onTouchStart,
                touchmove: this.onTouchMove,
                touchend: this.onTouchEnd,
                touchcancel: this.onTouchEnd,
                swipe: this.onSwipe,
                scope: this
            });
        } else {
            this.getCanvas().on({
                mousewheel: this.onMouseWheel,
                mousedown: this.onMouseDown,
                mousemove: this.onMouseMove,
                mouseup: this.onMouseUp,
                scope: this
            });
            // fix mouseup when out of window
            Ext.getDoc().on({
                mouseup: this.onMouseUp,
                scope: this
            });
        }
        
        // init mixins
        this.mixins.location.constructor.call(this);
        this.mixins.layer.constructor.call(this);
        this.mixins.path.constructor.call(this);
        this.mixins.tools.constructor.call(this, {
            tools: ['hand']
        });
    },
    
    onResize: function(w, h, oldW, oldH) {
        this.callParent(arguments);
        if (this.getCanvas()) {
            this.getCanvas().setWidth(w);
            this.getCanvas().setHeight(h);
            paper.view.viewSize = new paper.Size(w, h);
        }
    },
    
    applyLocation: function(location) {
        // check if location and if changed
        if (!(location instanceof CB.model.Location) || this.getLocation() === location) {
            return;
        }

        // set file
        var file = location.files().getAt(0);
        if (file) {
            this.setFile(file);
        }
        
        // confirm change
        return location;
    },

    updateLocation: function(newLocation, oldLocation) {
        this.fireEvent('locationchange', this, newLocation, oldLocation);
    },
    
    applyFile: function(file) {
        if (!(file instanceof CB.model.File)) {
            return;
        }
        
        // preload image
        var image = new Image();
        
        // initialize image on load
        image.addEventListener('load', Ext.bind(function() {
            var box = this.getBox(),
                padding = this.getImagePadding(),
                wr = (box.width - (padding * 2)) / image.width,
                hr = (box.height - (padding * 2)) / image.height,
                scale = wr > hr ? hr : wr,
                translateX = padding,
                translateY = padding;
            
            // apply image src
            this.getImage().dom.src = image.src;
            
            // reset scale
            this.setScale(scale);
            this.setStartScale(scale);
            
            // reset image position
            this.setTranslateX(translateX);
            this.setTranslateY(translateY);
            
            // reset image size
            this.getImage().setWidth(image.width);
            this.getImage().setHeight(image.height);
            
            // store image size
            this.setImageWidth(image.width);
            this.setImageHeight(image.height);
            
            this.applyTransform();
            
            /*
            var path = this.path = new paper.Path.Line(new paper.Point(100,100), new paper.Point(200,200));
            path.strokeWidth = 3; 
            path.strokeColor = 'red';
            paper.view.draw();
            */
            
        }, this));

        // set new image
        image.src = file.getUrl('720');
        
        // confirm file change
        return file;
    },
    
    updateFile: function(newFile, oldFile) {
        this.fireEvent('filechange', this, oldFile, newFile);
    },
    
    /**
     * Touch
     */
    
    onTouchStart: function(e) {
        console.log('onTouchStart');
        e = e.event;
        
        switch (e.touches.length) {
            case 1:
                
                // set touch action
                this.touchAction = 'moving';
                
                // get start touches
                this.startX0 = e.touches[0].pageX;
                this.startY0 = e.touches[0].pageY;
                
                break;
                
            case 2:
                
                // set touch action
                this.touchAction = 'zooming';
                
                // get start touches
                this.startX0 = e.touches[0].pageX;
                this.startY0 = e.touches[0].pageY;
                this.startX1 = e.touches[1].pageX;
                this.startY1 = e.touches[1].pageY;

                // get start center
                this.startCenterX = (this.startX0 + this.startX1) / 2;
                this.startCenterY = (this.startY0 + this.startY1) / 2;

                // get start distance between fingers
                this.startDistance = Math.sqrt(Math.pow((this.startX1 - this.startX0), 2) + Math.pow((this.startY1 - this.startY0), 2));
                
                break;
        }
    },
    
    onTouchMove: function(e) {
        console.log('onTouchMove');
        e = e.event;
        
        switch (this.touchAction) {
            case 'moving':
                
                // get end touches
                var endX0 = e.touches[0].pageX;
                var endY0 = e.touches[0].pageY;
                
                // calculate new translation points
                var translateX = this.getTranslateX() + (endX0 - this.startX0);
                var translateY = this.getTranslateY() + (endY0 - this.startY0);
                
                // set transform properties
                this.setTranslateX(translateX);
                this.setTranslateY(translateY);
                
                // apply transform
                this.applyTransform();
                
                // reset start touches
                this.startX0 = endX0;
                this.startY0 = endY0;
                
                break;
                
            case 'zooming':
            
                // get end touches
                var endX0 = e.touches[0].pageX;
                var endY0 = e.touches[0].pageY;
                var endX1 = e.touches[1].pageX;
                var endY1 = e.touches[1].pageY;

                // get end center
                var endCenterX = (endX0 + endX1) / 2;
                var endCenterY = (endY0 + endY1) / 2;

                // get end distance between fingers
                var endDistance = Math.sqrt(Math.pow((endX1 - endX0), 2) + Math.pow((endY1 - endY0), 2));

                // get distance difference
                var distanceDiff = endDistance / this.startDistance;

                // calculate scale and ratio
                var scale = this.getScale();
                var startScale = this.getStartScale();
                var newScale = startScale * distanceDiff;
                
                /*
                if (newScale < 0.5) {
                    newScale = 0.5;
                } else if (newScale > 4) {
                    newScale = 3;
                }
                */
                
                var ratio = newScale / scale;
                
                // get center position within image
                var mx = endCenterX - this.getCanvas().getX();
                var my = endCenterY - this.getCanvas().getY();

                // get center position within image after resize
                var nx = mx * ratio;
                var ny = my * ratio;

                // get translation difference because of zooming
                var zx = mx - nx;
                var zy = my - ny;
                
                // get translation difference because of moving
                var tx = endCenterX - this.startCenterX;
                var ty = endCenterY - this.startCenterY;
                
                // calculate new translation
                var translateX = this.getTranslateX() + zx + tx;
                var translateY = this.getTranslateY() + zy + ty;
                
                // set transform properties
                this.setScale(newScale);
                this.setTranslateX(translateX);
                this.setTranslateY(translateY);
                
                // apply transform
                this.applyTransform();
                
                // reset start touches
                this.startX0 = endX0;
                this.startY0 = endY0;
                this.startX1 = endX1;
                this.startY1 = endY1;
                
                // reset start center
                this.startCenterX = endCenterX;
                this.startCenterY = endCenterY;
                
                break;
        }
    },
    
    onTouchEnd: function(e) {
        switch (this.touchAction) {
            case 'zooming':
                this.setStartScale(this.getScale());
                break;
        }
        
        this.touchAction = null;
    },
    
    onSwipe: function(e, node, options) {
        console.log('swipe', e.distance, e.duration, e.direction);
        var location = this.getLocation(),
            files = location.files(),
            current, next;
    
        // must have at least two files
        if (files.getCount() < 2) {
            console.log('no files');
            return;
        }
        
        // check to see if proper swipe
        if (e.distance < 200 || e.duration > 300) {
            if (e.distance < 200) console.log('too short distance');
            if (e.duration > 300) console.log('too long duration');
            return;
        }
        
        // get current position
        current = files.indexOf(this.getFile());
        
        // show prev/next
        if (e.direction === 'left') {
            next = current - 1;
        } else {
            next = current + 1;
        }
        
        // show first
        if (next === files.getCount()) {
            next = 0;
        }
        
        // show last
        if (next < 0) {
            next = files.getCount() - 1;
        }
        
        console.log(current, next);
        
        // set file
        this.setFile(files.getAt(next));
    },
    
    /**
     * Mouse
     */
    
    onMouseWheel: function(e, el) {
        // calculate new scale and ratio
        var scale = this.getScale(),
            newScale = e.getWheelDelta() > 0 ? scale * 1.1 : scale / 1.1,
            ratio = newScale / scale;
    
        // constrain scale
        if (newScale < 0.5 || newScale > 6) {
            return;
        }
        
        // get mouse position within image
        var mx = e.getX() - this.getImage().getX();
        var my = e.getY() - this.getImage().getY();
        //console.log(mx, my);
        
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
    
    onMouseDown: function(e, t) {
        this.mouseMoveXY = e.getXY();
    },
    
    onMouseMove: function(e, t) {
        if (this.mouseMoveXY) {
            
            var dx = e.getX() - this.mouseMoveXY[0];
            var dy = e.getY() - this.mouseMoveXY[1];

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
            
            this.mouseMoveXY = e.getXY();
        }
    },
    
    onMouseUp: function(e, t) {
        this.mouseMoveXY = null;
    },
    
    /**
     * Transform
     */
    
    applyTransform: function() {
        var scale = this.getScale(),
            x = this.getTranslateX(),
            y = this.getTranslateY(),
            transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(' + scale + ',' + scale + ',1)',
            style = {
                'transform': transform,
                '-o-transform': transform,
                '-ms-transform': transform,
                '-moz-transform': transform,
                '-webkit-transform': transform
            };
    
        this.getImage().setStyle(style);
    }
    
}); 