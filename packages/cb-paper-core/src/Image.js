/**
 * Climbuddy paperjs image mixin
 */
Ext.define('CB.paper.Image', {
    
    config: {
        image: null,
        imageWidth: 0,
        imageHeight: 0,
        imagePadding: 20
    },
    
    preloadImage: function(file) {
        var view = this.getView(),
            image = new Image();
    
        // show loading indicator
        view.addCls('loading');
        
        // remove paper layer references
        this.getLayers().removeAll();
        
        // remove existing project
        if (paper.project) {
            paper.project.remove();
        }
        
        // setup new project
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        this.resizePaper(view.getWidth(), view.getHeight());
        
        // preload image
        image.addEventListener('load', Ext.bind(this.loadImage, this, [image]));
        image.id = 'cb-image';
        image.className = 'cb-image';
        image.src = file.getUrl(this.getFileSize());
    },
    
    loadImage: function(image) {
        var view = this.getView(),
            box = view.getBox(),
            pad = this.getImagePadding(),
            wr = (box.width - (pad * 2)) / image.width,
            hr = (box.height - (pad * 2)) / image.height,
            scale = wr > hr ? hr : wr,
            translateX = (box.width - (image.width * scale)) / 2, // center
            //translateX = pad, // left
            translateY = pad,
            newImage = this.getPaper().insertFirst(image);
            
        // hide loading indicator
        view.removeCls('loading');
    
        // create image
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
        
        // show layers
        this.getFile().layers().each(function(layer, index){
            this.importLayer(layer);
        }, this);
    },
    
    getImageScaledWidth: function() {
        return this.getImageWidth() * this.getScale();
    },
    
    getImageScaledHeight: function() {
        return this.getImageHeight() * this.getScale();
    }

});
