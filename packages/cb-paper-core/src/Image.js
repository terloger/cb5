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
            vm = view.getViewModel(),
            file = vm.get('file'),
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
        file.layers().each(function(layer){
            this.importLayer(layer);
        }, this);
    },
    
    getImageScaledWidth: function(scale) {
        return this.getImageWidth() * (scale || this.getScale());
    },
    
    getImageScaledHeight: function(scale) {
        return this.getImageHeight() * (scale || this.getScale());
    },
    
    withinImage: function(x, y) {
        var left = this.getTranslateX(),
            right = left + this.getImageScaledWidth(),
            top = this.getTranslateY(),
            bottom = top + this.getImageScaledHeight();

        if (x) {
            if (x < left) {
                return false;
            }
            if (x > right) {
                return false;
            }
        }
        
        if (y) {
            if (y < top) {
                return false;
            }
            if (y > bottom) {
                return false;
            }
        }

        return true;
    }

});
