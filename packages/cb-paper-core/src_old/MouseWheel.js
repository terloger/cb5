Ext.define('CB.paper.MouseWheel', {

    zoom: null,
    zoomStep: 1.1,
    zoomLevel: null,
    zoomLevels: Ext.create('Ext.util.MixedCollection'),
    
    zoomTask: null,
    zoomTaskDelay: 200,
    
    minZoom: 0.2,
    maxZoom: 4,
    
    constructor: function() {
        this.zoomTask = new Ext.util.DelayedTask(function(){
            this.zooming = false;
        }, this);
        
        this.on({
            canvasready: {
                fn: function() {
                    this.getCanvas().on({
                        mousewheel: this.onMouseWheelZoom,
                        scope: this
                    });
                },
                single: true,
                scope: this
            },
            imagechange: this.createZoomLevels,
            scope: this
        });
    },
    
    getZoomInRatio: function(fromLevel, toLevel) {
        return Math.pow(this.zoomStep, Math.abs(fromLevel - toLevel));
    },
    
    getZoomOutRatio: function(fromLevel, toLevel) {
        return Math.pow(1 / this.zoomStep, Math.abs(fromLevel - toLevel));
    },
    
    createZoomLevels: function() {
        var zoom = 1,
            zoomLevels = [],
            minZoomLevels = [],
            maxZoomLevels = [],
            baseZoomLevel = {
                id: 1,
                zoom: 1,
                width: this.getImageWidth(),
                height: this.getImageHeight()
            };
            
        // min zoom levels
        zoom = 1;
        while (zoom !== false) {
            zoom = zoom * (1 / this.zoomStep);
            if (zoom > this.minZoom) {
                minZoomLevels.push({
                    id: zoom,
                    zoom: zoom,
                    width: this.getImageWidth() * zoom,
                    height: this.getImageHeight() * zoom
                });
            } else {
                zoom = false;
            }
        }
        
        // max zoom levels
        zoom = 1;
        while (zoom !== false) {
            zoom = zoom * this.zoomStep;
            if (zoom < this.maxZoom) {
                maxZoomLevels.push({
                    id: zoom,
                    zoom: zoom,
                    width: this.getImageWidth() * zoom,
                    height: this.getImageHeight() * zoom
                });
            } else {
                zoom = false;
            }
        }
        
        // create all zoom levels for this image
        zoomLevels = zoomLevels.concat(minZoomLevels.reverse(), [baseZoomLevel], maxZoomLevels);
        
        // set zoom levels
        this.zoomLevels.clear();
        this.zoomLevels.addAll(zoomLevels);
        
        // set current zoom and zoom level
        this.zoom = this.getImage().getWidth() / this.getImageWidth();
        this.zoomLevels.each(function(zoom, index){
            if (zoom.zoom > this.zoom) {
                this.zoomLevel = index;
                return false;
            }
        }, this);
    },
    
    onMouseWheelAnimazedZoom: function(e, el) {
        if (!e || !e.getWheelDelta || !e.within(this.getCanvas()) || !this.getFile() || !this.getImage()) return;
        
        this.zooming = true;

        // get new zoom level
        var newZoomLevel = this.zoomLevel;
        if (e.getWheelDelta() > 0 && this.zoomLevel < this.zoomLevels.getCount() - 1) {
            newZoomLevel++;
        } else if (e.getWheelDelta() < 0 && this.zoomLevel > 0) {
            newZoomLevel--;
        } else {
            return;
        }

        // get zoom state object
        var zoom = this.zoomLevels.getAt(newZoomLevel);
        if (!zoom) return;

        // calculate new dimensions and positions
        var ratio = zoom.zoom / this.zoom,
            // mouse position within image
            mx = e.getX() - this.getCanvas().getX(),
            my = e.getY() - this.getCanvas().getY(),
            // new position after resize
            nx = mx * ratio,
            ny = my * ratio,
            // diff between old and new position
            dx = mx - nx,
            dy = my - ny,
            // new draw coordinates
            x  = this.getCanvas().getX() + dx,
            y  = this.getCanvas().getY() + dy;
            
        // set zoom
        this.zoom = zoom.zoom;
        this.zoomLevel = newZoomLevel;
        
        this.getImage().stopAnimation();
        this.getImage().animate({
            to: {
                width: zoom.width,
                height: zoom.height,
                x: x,
                y: y
            },
            stopAnimation: true,
            easing: 'linear',
            duration: 200
        });
        
        this.getCanvas().stopAnimation();
        this.getCanvas().animate({
            to: {
                width: zoom.width,
                height: zoom.height,
                x: x,
                y: y
            },
            stopAnimation: true,
            easing: 'linear',
            duration: 200
        });

        // resize view
        paper.view.viewSize = new paper.Size(zoom.width, zoom.height);

        // transform layers
        this.transformLayers(ratio);

        // redraw view
        paper.view.draw();
        
        // delay this.zooming = false;
        this.zoomTask.delay(this.zoomTaskDelay);
    },
    
    onMouseWheelZoom: function(e, el) {
        if (!e || !e.getWheelDelta || !e.within(this.getCanvas()) || !this.getFile() || !this.getImage()) return;
        
        this.zooming = true;

        // get new zoom level
        var newZoomLevel = this.zoomLevel;
        if (e.getWheelDelta() > 0 && this.zoomLevel < this.zoomLevels.getCount() - 1) {
            newZoomLevel++;
        } else if (e.getWheelDelta() < 0 && this.zoomLevel > 0) {
            newZoomLevel--;
        } else {
            return;
        }

        // get zoom state object
        var zoom = this.zoomLevels.getAt(newZoomLevel);
        if (!zoom) return;

        // calculate new dimensions and positions
        var ratio = zoom.zoom / this.zoom,
            // mouse position within image
            mx = e.getX() - this.getCanvas().getX(),
            my = e.getY() - this.getCanvas().getY(),
            // new position after resize
            nx = mx * ratio,
            ny = my * ratio,
            // diff between old and new position
            dx = mx - nx,
            dy = my - ny,
            // new draw coordinates
            xy = [
                this.getCanvas().getX() + dx,
                this.getCanvas().getY() + dy
            ];
            
        // set zoom
        this.zoom = zoom.zoom;
        this.zoomLevel = newZoomLevel;
        
        // resize image
        this.getImage().setWidth(zoom.width);
        this.getImage().setHeight(zoom.height);
        
        // resize canvas
        this.getCanvas().setWidth(zoom.width);
        this.getCanvas().setHeight(zoom.height);
        
        // position canvas and image
        this.getImage().setXY(xy);
        this.getCanvas().setXY(xy);

        // resize view
        paper.view.viewSize = new paper.Size(zoom.width, zoom.height);

        // transform layers
        this.transformLayers(ratio);

        // redraw view
        paper.view.draw();
        
        // delay this.zooming = false;
        this.zoomTask.delay(this.zoomTaskDelay);
    },
    
    onSlideZoom: function(slider, newValue, oldValue, skipPosition) {
        // get zoom object
        var zoom = this.zoomLevels.getAt(newValue);
        if (!zoom) return;
        
        this.zooming = true;
        
        // set zoom
        this.zoom = zoom.zoom;
        this.zoomLevel = newValue;

        // position draw
        if (skipPosition !== true) {
            this.draw.position(
                null,
                null,
                this.draw.getX() + ((this.image.getWidth() - zoom.width) / 2),
                this.draw.getY() + ((this.image.getHeight() - zoom.height) / 2)
            );
        }

        // resize image
        this.image.setWidth(zoom.width);
        this.image.setHeight(zoom.height);

        // resize view
        paper.view.viewSize = new paper.Size(zoom.width, zoom.height);

        // transform layers
        var ratio = (newValue > oldValue) ? this.getZoomInRatio(newValue, oldValue) : this.getZoomOutRatio(oldValue, newValue);
        this.transformLayers(ratio);

        // show/hide icons
        if (this.activeLayer) {
            //this.showIcons(this.activeLayer, this.zoom > this.zoomIconLevel);
        }

        // redraw view
        paper.view.draw();
        
        // delay this.zooming = false;
        this.zoomTask.delay(this.zoomTaskDelay);
    }

});
