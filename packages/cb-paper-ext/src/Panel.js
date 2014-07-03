/**
 * Climbuddy ExtJS paper panel
 */
Ext.define('CB.paper.Panel', {
    extend: 'Ext.container.Container',
    
    xtype : 'cb-paper',
    
    controller: 'cb-paper',

    viewModel: {
        type: 'cb-paper'
    },
    
    mixins: {
        location: 'CB.paper.Location',
        layer: 'CB.paper.Layer',
        path: 'CB.paper.Path',
        tools: 'CB.paper.Tools',
        mouse: 'CB.paper.Mouse',
        touch: 'CB.paper.Touch'
    },
    
    html: [
        '<div id="cb-paper" class="cb-paper">',
            '<canvas id="cb-canvas" class="cb-canvas"></canvas>',
        '</div>'
    ].join(''),
    
    config: {
        location: null,
        route: null,
        file: null,
        
        fileSize: '1080',
        
        paper: null,
        canvas: null,
        image: null,
        
        imageWidth: 0,
        imageHeight: 0,
        imagePadding: 40
    },
    
    /**
     * Core
     */
    
    initComponent: function() {
        this.callParent();
        
        // initialize panel on afterrender
        this.on({
            afterrender: this.onAfterRender,
            scope: this
        });
    },
    
    onAfterRender: function() {
        // set paper, canvas and image reference
        this.setPaper(Ext.get('cb-paper'));
        this.setImage(Ext.get('cb-image'));
        this.setCanvas(Ext.get('cb-canvas'));
        
        // init canvas
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        var w = this.getWidth();
        var h = this.getHeight();
        this.getCanvas().setWidth(w);
        this.getCanvas().setHeight(h);
        paper.view.viewSize = new paper.Size(w, h);
        
        // init mixins
        if (Ext.supports.Touch) {
            this.mixins.touch.constructor.call(this);
        } else {
            this.mixins.mouse.constructor.call(this);
        }
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
    
    /**
     * Location
     */
    
    applyLocation: function(location) {
        // location not changed
        if (location === this.getLocation()) {
            return;
        }
        
        // clear location
        if (!location || !(location instanceof CB.model.Location)) {
            this.setFile(null);
            return null;
        }

        // set file
        this.setFile(location.files().getAt(0));
        
        // confirm change
        return location;
    },

    updateLocation: function(newLocation, oldLocation) {
        this.fireEvent('locationchange', this, newLocation, oldLocation);
    },
    
    /**
     * File
     */
    
    applyFile: function(file) {
        // not changed
        if (file === this.getFile()) {
            return;
        }
        
        // clear image
        if (this.getImage()) {
            this.getImage().destroy();
            this.setImage(null);
        }
        
        // must be a valid file
        if (!file || !(file instanceof CB.model.File)) {
            return null;
        }
        
        // preload image
        var image = new Image();
        image.addEventListener('load', Ext.bind(this.onFileLoad, this, [image]));
        image.id = 'cb-image';
        image.className = 'cb-image';
        image.src = file.getUrl(this.getFileSize());
        
        // confirm file change
        return file;
    },
    
    updateFile: function(newFile, oldFile) {
        this.fireEvent('filechange', this, oldFile, newFile);
    },
    
    onFileLoad: function(image) {
        var box = this.getBox(),
            pad = this.getImagePadding(),
            wr = (box.width - (pad * 2)) / image.width,
            hr = (box.height - (pad * 2)) / image.height,
            scale = wr > hr ? hr : wr,
            translateX = (box.width - (image.width * scale)) / 2,
            translateY = pad;
    
        // create image
        var newImage = this.getPaper().insertFirst(image);
        this.setImage(newImage);

        // apply image size
        this.getImage().setWidth(image.width);
        this.getImage().setHeight(image.height);

        // store image size
        this.setImageWidth(image.width);
        this.setImageHeight(image.height);

        // fit image
        this.setScale(scale);
        this.setStartScale(scale);
        this.setTranslateX(translateX);
        this.setTranslateY(translateY);
        this.applyTransform();

        /*
        var path = this.path = new paper.Path.Line(new paper.Point(100,100), new paper.Point(200,200));
        path.strokeWidth = 3; 
        path.strokeColor = 'red';
        paper.view.draw();
        */

        this.fireEvent('fileload', this, this.getFile());
    },
    
    prevFile: function() {
        var file = this.getPrevFile();
        
        if (!file) {
            return;
        }
        
        this.setFile(file);
    },
    
    nextFile: function() {
        var file = this.getNextFile();
        
        if (!file) {
            return;
        }
        
        this.setFile(file);
    },
    
    getPrevFile: function() {
        var location = this.getLocation(),
            files = location.files(),
            current,
            prev;
    
        // must have at least two files
        if (files.getCount() < 2) {
            return files.getAt(0);
        }
        
        // get current position
        current = files.indexOf(this.getFile());
        prev = current - 1;
        
        // show last
        if (prev < 0) {
            prev = files.getCount() - 1;
        }
        
        return files.getAt(prev);
    },
    
    getNextFile: function() {
        var location = this.getLocation(),
            files = location.files(),
            current,
            next;
    
        // must have at least two files
        if (files.getCount() < 2) {
            return files.getAt(0);
        }
        
        // get current position
        current = files.indexOf(this.getFile());
        next = current + 1;
        
        // show first
        if (next === files.getCount()) {
            next = 0;
        }
        
        return files.getAt(next);
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