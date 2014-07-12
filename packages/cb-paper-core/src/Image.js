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
        
        var json = '{"paths":[[{"point":{"x":8.948545861297475,"y":110.96196868008948},"handleIn":{"x":0,"y":0},"handleOut":{"x":18.908498925505114,"y":0}},{"point":{"x":69.79865771812081,"y":102.01342281879195},"handleIn":{"x":-18.210398780968603,"y":4.552599695242151},"handleOut":{"x":18.896989377110913,"y":-4.724247344277757}},{"point":{"x":146.75615212527964,"y":109.17225950782998},"handleIn":{"x":-17.736610916354607,"y":-5.912203638784888},"handleOut":{"x":40.25330945717849,"y":13.417769819059487}},{"point":{"x":279.1946308724831,"y":109.17225950782998},"handleIn":{"x":-41.275705357690185,"y":-10.318926339422575},"handleOut":{"x":52.72810888198944,"y":13.18202722049736}},{"point":{"x":445.6375838926174,"y":132.43847874720356},"handleIn":{"x":-53.6354222750864,"y":-8.939237045847733},"handleOut":{"x":24.91612251538959,"y":4.152687085898265}},{"point":{"x":563.7583892617449,"y":162.8635346756152},"handleIn":{"x":0,"y":-35.0055034489105},"handleOut":{"x":0,"y":0}}]],"icons":[]}';
        this.importLayerJson(json);
    },
    
    getImageScaledWidth: function() {
        return this.getImageWidth() * this.getScale();
    },
    
    getImageScaledHeight: function() {
        return this.getImageHeight() * this.getScale();
    }

});
