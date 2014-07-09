/**
 * CB ExtJS paper panel view controller
 */
Ext.define('CB.paper.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-paper',
    
    mixins: {
        location: 'CB.paper.Location',
        layer: 'CB.paper.Layer',
        ppath: 'CB.paper.PPath', // cannot use path ;)
        tools: 'CB.paper.Tools',
        mouse: 'CB.paper.Mouse',
        touch: 'CB.paper.Touch'
    },
    
    config: {
        paper: null,
        canvas: null,
        image: null,
        
        location: null,
        file: null,
        route: null,
        
        fileSize: '1080',
        
        imageWidth: 0,
        imageHeight: 0,
        imagePadding: -72
    },
    
    init: function() {
        var vm = this.getViewModel().getParent();
        
        vm.bind('{location}', this.setLocation, this);
        vm.bind('{file}', this.setFile, this);
    },
    
    initPaper: function() {
        var view = this.getView(),
            w = view.getWidth(),
            h = view.getHeight();
    
        // set paper, canvas and image reference
        this.setPaper(Ext.get('cb-paper'));
        this.setImage(Ext.get('cb-image'));
        this.setCanvas(Ext.get('cb-canvas'));
        
        // init canvas
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        this.resizePaper(w, h);
        
        // init mixins
        
        if (Ext.supports.Touch) {
            this.mixins.touch.constructor.call(this);
        } else {
            this.mixins.mouse.constructor.call(this);
        }
        
        this.mixins.location.constructor.call(this);
        this.mixins.layer.constructor.call(this);
        
        this.mixins.ppath.constructor.call(this);
        
        this.mixins.tools.constructor.call(this, {
            tools: ['move','select','pen']
        });
    },
    
    resizePaper: function(a, b, c) {
        var w = Ext.isNumber(a) ? a : b,
            h = Ext.isNumber(a) ? b : c;
    
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
            return null;
        }
        
        // confirm change
        return location;
    },

    updateLocation: function(location, oldLocation) {
        //this.fireEvent('locationchange', this, location, oldLocation);
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
        image.addEventListener('load', Ext.bind(this.loadFile, this, [image]));
        image.id = 'cb-image';
        image.className = 'cb-image';
        image.src = file.getUrl(this.getFileSize());
        
        // confirm file change
        return file;
    },
    
    updateFile: function(file, oldFile) {
        //this.fireEvent('filechange', this, file, oldFile);
    },
    
    loadFile: function(image) {
        var view = this.getView(),
            box = view.getBox(),
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

        //this.fireEvent('fileload', this, this.getFile());
    },
    
    /**
     * Transform
     */
    
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
    
        this.getImage().setStyle(style);
    }
    
});