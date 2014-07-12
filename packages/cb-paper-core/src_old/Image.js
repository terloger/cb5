Ext.define('CB.paper.Image', {
    
    config: {
        image: null,
        imageWidth: null,
        imageHeight: null
    },
    
    loadImage: function(src) {
        // destroy previous image
        if (this.getImage()) {
            this.getImage().destroy();
        }
        
        // preload image
        var image = new Image();
        image.addEventListener('load', Ext.bind(function() {
            
            // calculate dimensions and positions
            var mw = this.getContainer().getWidth(),
                mh = this.getContainer().getHeight(),
                wr = mw / image.width,
                hr = mh / image.height,
                w  = image.width * (wr < hr ? wr : hr),
                h  = image.height * (wr < hr ? wr : hr),
                xy = [
                    (mw - w) / 2 + this.getContainer().getX(),
                    (mh - h) / 2 + this.getContainer().getY()
                ];
            
            // set image size
            this.setImageWidth(image.width);
            this.setImageHeight(image.height);
            
            // set image
            this.setImage(this.getContainer().createChild({
                tag: 'img',
                cls: 'cb-paper-image',
                src: image.src,
                style: 'position:absolute;'
            }, this.getCanvas()));
            
            // resize image
            this.getImage().setWidth(w);
            this.getImage().setHeight(h);
            
            // resize canvas
            this.getCanvas().setWidth(w);
            this.getCanvas().setHeight(h);
            
            // position image and canvas
            this.getImage().setXY(xy);
            this.getCanvas().setXY(xy);
            
            // resize view
            paper.view.viewSize = new paper.Size(w, h);
            
            // show layers
            Ext.defer(function() {
                this.getFile().layers().each(function(layer, index){
                    Ext.defer(function() {
                        this.importLayer(layer);
                    }, 30 * index, this);
                }, this);
            }, 300, this);
            
            // redraw view
            paper.view.draw();
            
            // fire image ready event
            this.fireEvent('imagechange', this, this.getImage());
            
        }, this));
        image.src = src;
    }

});
