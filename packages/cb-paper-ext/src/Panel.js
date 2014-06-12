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
        scale: 1,
        translateX: 0,
        translateY: 0
    },
    
    initComponent: function() {
        this.callParent();
        
        // initialize panel on afterrender
        this.on({
            afterrender: this.onAfterRender,
            delay: 1,
            scope: this
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
        this.getCanvas().on({
            mousewheel: this.onMouseWheel,
            mousedown: this.onMouseDown,
            mousemove: this.onMouseMove,
            mouseup: this.onMouseUp,
            scope: this
        });
        
        if (Ext.supports.Touch) {
            this.getCanvas().on({
                swipe: this.onSwipe,
                scope: this
            });
        }
        
        // fix mouseup when out of window
        Ext.getDoc().on({
            mouseup: this.onMouseUp,
            scope: this
        });
        
        // init mixins
        this.mixins.location.constructor.call(this);
        this.mixins.layer.constructor.call(this);
        this.mixins.path.constructor.call(this);
        this.mixins.tools.constructor.call(this, {
            tools: ['hand']
        });
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
    
    onResize: function(w, h, oldW, oldH) {
        this.callParent(arguments);
        console.log('resize');
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
        image.addEventListener('load', Ext.bind(function() {
            
            // set image element source
            this.getImage().dom.src = image.src;
            
            // reset scale
            this.setScale(1);
            
            // reset position
            this.getImage().setX(0);
            this.getImage().setY(0);
            
            // store image size
            this.setImageWidth(image.width);
            this.setImageHeight(image.height);
            
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
            /*,
            transformCanvas = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(1,1,1)',
            styleCanvas = {
                'transform': transformCanvas,
                '-o-transform': transformCanvas,
                '-ms-transform': transformCanvas,
                '-moz-transform': transformCanvas,
                '-webkit-transform': transformCanvas
            };*/
    
        this.getImage().setStyle(style);
        
        
        //this.getCanvas().setStyle(style);
        //this.getCanvas().setStyle(styleCanvas);
        //this.getCanvas().setWidth(this.getImageWidth() * scale);
        //this.getCanvas().setHeight(this.getImageHeight() * scale);
    }
    
}); 