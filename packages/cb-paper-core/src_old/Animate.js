Ext.define('CB.paper.Animate', {

    animateToFitDuration: 150,
    animateToFitEasing: 'easeInOut',

    animateToFit: function() {
        var finalZoom,
            finalZoomLevel,
            maxWidth = this.getImageFitMaxWidth(),
            maxHeight = this.getImageFitMaxHeight(),
            direction = (this.image.getWidth() > maxWidth || this.image.getHeight() > maxHeight) ? 'zoomout' : 'zoomin',
            ratio;

        // calculate final zoom
        switch (direction) {
            case 'zoomin':
                this.zoomLevels.each(function(zoom, index) {
                    if (index <= this.zoomLevel) return;
                    if (zoom.width > maxWidth || zoom.height > maxHeight) return false;
                    finalZoom = zoom;
                    finalZoomLevel = index;
                }, this);
                break;
            case 'zoomout':
                var records = this.zoomLevels.getRange(),
                    index = records.length - 1;
                while (index-- > -1) {
                    var zoom = records[index];
                    if (index < this.zoomLevel) {
                        finalZoom = zoom;
                        finalZoomLevel = index;
                    }
                    if (zoom.width < maxWidth && zoom.height < maxHeight) break;
                }
                break;
        }

        // should never happen
        if (!finalZoom) return;
        
        

        // set zoom
        this.zoomSlider.suspendEvents();
        this.zoomSlider.setValue(finalZoomLevel);
        this.zoomSlider.resumeEvents();

        // hide canvas
        this.canvas.hide();

        // animate draw
        this.draw.animate({
            easing: this.animateToFitEasing,
            duration: this.animateToFitDuration,
            to: {
                left: this.getImageFitLeft(finalZoom.width),
                top: this.getImageFitTop(finalZoom.height)
            }
        });

        // animate image
        this.image.animate({
            easing: this.animateToFitEasing,
            duration: this.animateToFitDuration,
            to: {
                width: finalZoom.width,
                height: finalZoom.height
            },
            callback: function() {
                // show canvas
                this.canvas.show();
            },
            scope: this
        });

        // resize view
        paper.view.viewSize = new paper.Size(finalZoom.width, finalZoom.height);

        // transform layers
        switch (direction) {
            case 'zoomin':
                ratio = this.getZoomInRatio(finalZoomLevel, this.zoomLevel);
                break;
            case 'zoomout':
                ratio = this.getZoomOutRatio(this.zoomLevel, finalZoomLevel);
                break;
        }
        this.transformLayers(ratio);
        
        // set zoom level after layer transformation
        this.zoom = finalZoom.zoom;
        this.zoomLevel = finalZoomLevel;

        // show/hide icons
        if (this.activeLayer) {
            //this.showIcons(this.activeLayer, this.zoom > this.zoomIconLevel);
        }

        // redraw view
        paper.view.draw();
    }

});
