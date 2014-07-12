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
        // preload image
        var image = new Image();
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
