/**
 * Climbuddy ExtJS paper panel
 */
Ext.define('CB.paper.Panel2', {
    extend: 'Ext.Container',
    xtype : 'cb-paper2',
    
    mixins: {
        location: 'CB.paper.Location',
        tools: 'CB.paper.Tools'
    },
    
    config: {
        html: [
            '<div id="paper" class="paper">',
                '<img id="image" class="image" src="" />',
                '<canvas id="canvas" class="canvas"></canvas>',
            '</div>'
        ].join(''),
        
        location: null,
        route: null,
        file: null,
        canvas: null,
        image: null,
        imageWidth: 0,
        imageHeight: 0,
        
        scale: 1,
        startScale: 1,
        translateX: 0,
        translateY: 0
    },
    
    initialize: function() {
        this.on({
            painted: this.onPainted,
            delay: 100,
            scope: this
        });
    },
    
    onPainted: function() {
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
        
        // touch handlers
        this.getCanvas().on({
            touchstart: this.onTouchStart,
            touchmove: this.onTouchMove,
            touchend: this.onTouchEnd,
            touchcancel: this.onTouchEnd,
            scope: this
        });
        
        // init canvas
        paper.setup(this.getCanvas().dom);
    },
    
    applyLocation: function(location) {
        // check if location and if changed
        if (!(location instanceof CB.model.Location) /*|| this.getLocation() === location*/) {
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
    
    setSrc: function(src) {
        // preload image
        var image = new Image();
        image.addEventListener('load', Ext.bind(function() {
            
            // set image element source
            this.getImage().dom.src = image.src;
            
            // reset scale
            this.setScale(1);
            
            // store image size
            this.setImageWidth(image.width);
            this.setImageHeight(image.height);
            
            // set canvas size
            this.getCanvas().setWidth(this.getImageWidth());
            this.getCanvas().setHeight(this.getImageHeight());
            
            // resize view
            paper.view.viewSize = new paper.Size(image.width, image.height);
            
            var pathData = '["Path",{"selected":true,"applyMatrix":true,"segments":[[{"x":426,"y":464,"selected":true},{"x":0,"y":0,"selected":true},{"x":19.42704,"y":0,"selected":true}],[{"x":420,"y":400,"selected":true},{"x":0,"y":0.99565,"selected":true},{"x":0,"y":-0.66667,"selected":true}],[{"x":420,"y":398,"selected":true},{"x":-0.24759,"y":0.61898,"selected":true},{"x":2.66399,"y":-6.65997,"selected":true}],[{"x":428,"y":377,"selected":true},{"x":-3.04145,"y":6.0829,"selected":true},{"x":1.11598,"y":-2.23196,"selected":true}],[{"x":419,"y":308,"selected":true},{"x":1.71993,"y":3.43986,"selected":true},{"x":-6.02225,"y":-12.04449,"selected":true}],[{"x":366,"y":260,"selected":true},{"x":4.12968,"y":16.51871,"selected":true},{"x":-1.91312,"y":-7.65248,"selected":true}],[{"x":358,"y":240,"selected":true},{"x":3.41291,"y":6.82582,"selected":true},{"x":-7.55775,"y":-15.11551,"selected":true}],[{"x":392,"y":193,"selected":true},{"x":-4.34589,"y":13.03768,"selected":true},{"x":5.63708,"y":-16.91125,"selected":true}],[{"x":390,"y":120,"selected":true},{"x":-0.49633,"y":0.99267,"selected":true},{"x":3.1773,"y":-6.3546,"selected":true}],[{"x":396,"y":99,"selected":true},{"x":0,"y":7.68949,"selected":true},{"x":0,"y":0,"selected":true}]],"strokeColor":[0,0,0]}]';
            console.log(Ext.decode(pathData));
            
            var from = new paper.Point(220, 220);
            var to = new paper.Point(280, 280);
            var path = this.path = new paper.Path.Line(from, to);
            path.strokeWidth = 3;
            path.strokeColor = 'red';
           
            // redraw
            paper.view.draw();
            
        }, this));

        // set new image
        image.src = src;
        
        return src;
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
            
            // store image size
            this.setImageWidth(image.width);
            this.setImageHeight(image.height);
            
            // set canvas size
            this.getCanvas().setWidth(image.width);
            this.getCanvas().setHeight(image.height);
            
            // resize view
            paper.view.viewSize = new paper.Size(image.width, image.height);
            
            var pathData = '["Path",{"selected":true,"applyMatrix":true,"segments":[[{"x":426,"y":464,"selected":true},{"x":0,"y":0,"selected":true},{"x":19.42704,"y":0,"selected":true}],[{"x":420,"y":400,"selected":true},{"x":0,"y":0.99565,"selected":true},{"x":0,"y":-0.66667,"selected":true}],[{"x":420,"y":398,"selected":true},{"x":-0.24759,"y":0.61898,"selected":true},{"x":2.66399,"y":-6.65997,"selected":true}],[{"x":428,"y":377,"selected":true},{"x":-3.04145,"y":6.0829,"selected":true},{"x":1.11598,"y":-2.23196,"selected":true}],[{"x":419,"y":308,"selected":true},{"x":1.71993,"y":3.43986,"selected":true},{"x":-6.02225,"y":-12.04449,"selected":true}],[{"x":366,"y":260,"selected":true},{"x":4.12968,"y":16.51871,"selected":true},{"x":-1.91312,"y":-7.65248,"selected":true}],[{"x":358,"y":240,"selected":true},{"x":3.41291,"y":6.82582,"selected":true},{"x":-7.55775,"y":-15.11551,"selected":true}],[{"x":392,"y":193,"selected":true},{"x":-4.34589,"y":13.03768,"selected":true},{"x":5.63708,"y":-16.91125,"selected":true}],[{"x":390,"y":120,"selected":true},{"x":-0.49633,"y":0.99267,"selected":true},{"x":3.1773,"y":-6.3546,"selected":true}],[{"x":396,"y":99,"selected":true},{"x":0,"y":7.68949,"selected":true},{"x":0,"y":0,"selected":true}]],"strokeColor":[0,0,0]}]';
            console.log(Ext.decode(pathData));
            
            var from = new paper.Point(420, 420);
            var to = new paper.Point(480, 480);
            var path = this.path = new paper.Path.Line(from, to);
            path.strokeWidth = 3;
            path.strokeColor = 'red';
           
            // redraw
            paper.view.draw();
            
        }, this));

        // set new image
        image.src = file.getUrl('320');
        
        // confirm file change
        return file;
    },
    
    updateFile: function(newFile, oldFile) {
        this.fireEvent('filechange', this, oldFile, newFile);
    },
    
    onTouchStart: function(e) {
        this.unfixCanvasSize = true;
        
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
        console.log('touchend');
        switch (this.touchAction) {
            case 'zooming':
                var ratio = this.getScale() / this.getStartScale(),
                    x = this.getTranslateX(),
                    y = this.getTranslateY();
                
                this.setStartScale(this.getScale());
                
                
                var transformCanvas = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(1,1,1)',
                    styleCanvas = {
                        'transform': transformCanvas,
                        '-o-transform': transformCanvas,
                        '-ms-transform': transformCanvas,
                        '-moz-transform': transformCanvas,
                        '-webkit-transform': transformCanvas
                    };
                
                console.log('start resizing');
                this.getCanvas().setStyle(styleCanvas);
                console.log('resize image');
                this.getCanvas().setWidth(this.getImageWidth() * this.getScale());
                this.getCanvas().setHeight(this.getImageHeight() * this.getScale());
                console.log('done resizing');
                
                
                // resize view
                console.log('resize view', this.getCanvas().getWidth(), this.getCanvas().getHeight());
                paper.view.viewSize = new paper.Size(this.getCanvas().getWidth(), this.getCanvas().getHeight());
                console.log('done resizing view');
                console.log('tranform path');
                var path = this.path;
                var matrix = new paper.Matrix(ratio,0,0,ratio,0,0);
                path.transform(matrix);
                console.log('transform');
                   
                paper.view.draw();
                
                break;
        }
        
        this.touchAction = null;
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
            },
            transformCanvas = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(1,1,1)',
            styleCanvas = {
                'transform': transformCanvas,
                '-o-transform': transformCanvas,
                '-ms-transform': transformCanvas,
                '-moz-transform': transformCanvas,
                '-webkit-transform': transformCanvas
            };
    
        this.getImage().setStyle(style);
        this.getCanvas().setStyle(style);
        
        if (this.unfixCanvasSize) {
            this.unfixCanvasSize = false;
            this.getCanvas().setWidth(this.getImageWidth());
            this.getCanvas().setHeight(this.getImageHeight());
        }
        
        /*
        this.getCanvas().setStyle(styleCanvas);
        this.getCanvas().setWidth(this.getImageWidth() * scale);
        this.getCanvas().setHeight(this.getImageHeight() * scale);
        */
    }
    
}); 