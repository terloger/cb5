/**
 * Climbuddy paperjs layer mixin
 */
Ext.define('CB.paper.Layer', {

    config: {
        layers: null,
        activeLayer: null,
        normalizedWidth: 800,
        normalizedHeight: 800
    },
    
    constructor: function() {
        this.setLayers(Ext.create('Ext.util.MixedCollection'));
    },
    
    createLayer: function(routeId) {
        // create paper layer
        var layer = new paper.Layer({
            data: {
                routeId: routeId
            }
        });
        
        // add to collection
        this.getLayers().add(routeId, layer);
        
        // this is active layer
        /*
        if (this.getRoute() && this.getRoute().get('id') === layer.routeId) {
            this.setActiveLayer(layer);
        }
        */
        
        return layer;
    },
    
    colorLayer: function(layer, color) {
        if (layer) {
            for (var i = 0, len = layer.children.length; i < len; i++) {
                var child = layer.children[i];
                switch (child.data.type) {
                    case 'line':
                        child.strokeColor = color;
                        break;
                    case 'icon':
                        break;
                }
            }
            
            paper.view.draw();
        }
    },
    
    scaleLayers: function(scale, cx, cy) {
        var matrix = new paper.Matrix();
            
        matrix.scale(scale, new paper.Point(cx, cy));
        
        Ext.each(paper.project.layers, function(layer){
            layer.transform(matrix);
        });
        
        paper.view.draw();
    },
    
    translateLayers: function(dx, dy) {
        var matrix = new paper.Matrix();
        
        matrix.translate(dx, dy);
        
        Ext.each(paper.project.layers, function(layer){
            layer.transform(matrix);
        });
        
        paper.view.draw();
    },

    /**
     * OLD FUNCTIONS
     */

    clearLayer: function(layer) {

        // no layer passed, find active layer
        if (!layer) {
            if (!this.getActiveLayer() || !this.getRoute() || !this.getFile()) return false;
            layer = this.getLayers().get(this.getRoute().get('id'));
            if (layer !== this.getActiveLayer()) return false;
        }
        
        // no layer found
        if (!layer) return;

        // fetch layer record
        var rec = this.getFile().layers().getById(this.getActiveLayer().layerId);
        
        // get layer project reference
        var project = layer.project;
        
        var undo = Ext.bind(function() {
            // re-add layer to project
            layer._project = project;
            layer._index = project.layers.push(layer) - 1;

            // re-add layer to collection
            this.getLayers().add(layer);
            
            // if record exists, re-add it to file layers
            if (rec) {
                this.getFile().layers().add(rec);
            }

            // set active layer
            this.setActiveLayer(layer);

            // redraw view
            paper.view.draw();
            
            // commit
            this.fireEvent('change', this);
        }, this);
        
        var redo = Ext.bind(function() {
            // remove paper layer
            layer.remove();

            // remove layer from collection
            this.getLayers().remove(layer);

            // if record exists, remove it from file layers
            if (rec) {
                this.getFile().layers().remove(rec);
            }

            // unset active layer
            this.setActiveLayer(null);

            // redraw view
            paper.view.draw();
            
            // commit
            this.fireEvent('change', this);
        }, this);

        this.addHistory(undo, redo);
        
        redo();
    },
    
    commitLayers: function() {
        this.getLayers().each(function(layer) {
            this.commitLayer(layer);
        }, this);
    },

    commitLayer: function(layer) {
        // export route
        var data = this.exportLayer(layer);
        //var json = this.exportLayerJson(this.getActiveLayer());
        
        // update/create layer record
        var rec = this.getFile().layers().getById(layer.layerId);
        if (rec) {
            rec.set('data', Ext.encode(data));
        } else {
            rec = Ext.create('CB.model.Layer', {
                id: layer.layerId,
                routeId: layer.routeId,
                data: Ext.encode(data)
            });
        }
        
        this.getFile().layers().insert(0, rec);
    },
    
    importLayer: function(record) {
        var layer = this.createLayer(record.get('id'), record.get('routeId'));
        
        // calculate de-normalized matrix
        var wr = this.getCanvas().getWidth() / this.getNormalizedWidth(), // width ratio
            hr = this.getCanvas().getHeight() / this.getNormalizedHeight(), // height ratio
            nr = wr < hr ? wr : hr, // new ratio
            matrix = new paper.Matrix(nr,0,0,nr,0,0);
            
        // decode layer data
        var data = Ext.decode(record.get('data'));

        // import paths
        if (data.paths && data.paths.length) {
            
            for (var i = 0, len = data.paths.length; i < len; i++) {
                var path = this.createPath(data.paths[i], record);
                path.transform(matrix);
                layer.addChild(path);
            }
            
            var ghost = this.createGhostPath(data.paths);
            ghost.transform(matrix);
            layer.addChild(ghost);
            
        }

        // import icons
        /*
        if (data.icons && data.icons.length) {
            for (var i = 0, len = data.icons.length; i < len; i++) {
                var icon = data.icons[i];
                this.createIcon(icon.icon, icon.x * nr, icon.y * nr);
            }
        }
        */
    },
    
    importLayerJson: function(json) {
        console.log('importPath', json);
        var data = Ext.decode(json),
            matrix = this.getImportMatrix(),
            layer = this.createLayer(666),
            path;
    
        if (data.paths && data.paths.length) {
            Ext.each(data.paths, function(segments){
                path = this.createPath({
                    segments: segments
                });
                
                layer.addChild(path);
                
                /*
                var ghost = this.createGhostPath(data.paths);
                ghost.transform(matrix);
                layer.addChild(ghost);
                */
                
            }, this);
        }

        layer.transform(matrix);
        
        paper.view.draw();
    },
    
    getImportMatrix: function() {
        var matrix = new paper.Matrix(),
            tx = Math.round(this.getTranslateX()),
            ty = Math.round(this.getTranslateY()),
            wr = this.getImageScaledWidth() / this.getNormalizedWidth(),
            hr = this.getImageScaledHeight() / this.getNormalizedHeight(),
            scale = wr < hr ? wr : hr;
    
        console.log(scale, tx, ty);
    
        matrix.translate(tx, ty);
        matrix.scale(scale);
        
        return matrix;
    },
    
    getExportMatrix: function() {
        var matrix = new paper.Matrix(),
            tx = Math.round(-this.getTranslateX()),
            ty = Math.round(-this.getTranslateY()),
            tx2 = this.getCanvas().getX() - this.getImage().getX(),
            ty2 = this.getCanvas().getY() - this.getImage().getY(),
            wr = this.getNormalizedWidth() / this.getImageScaledWidth(),
            hr = this.getNormalizedHeight() / this.getImageScaledHeight(),
            scale = wr > hr ? wr : hr;
            
        console.log('tx', tx, tx2, 'ty', ty, ty2);
            
        matrix.scale(scale);
        matrix.translate(tx, ty);
        
        return matrix;
    },
    
    exportLayer: function(layer) {
        var matrix = this.getExportMatrix(),
            clone = layer.clone(),
            segments = [],
            paths = [],
            icons = [];
    
        clone.transform(matrix);
        
        Ext.each(clone.children, function(child){
            switch (child.data.type) {
                case 'line':
                    segments = [];
                    Ext.each(child.segments, function(segment){
                        segments.push({
                            point:     { x: segment.point.x,     y: segment.point.y },
                            handleIn:  { x: segment.handleIn.x,  y: segment.handleIn.y },
                            handleOut: { x: segment.handleOut.x, y: segment.handleOut.y }
                        });
                    });
                    paths.push(segments);
                    break;
                case 'icon':
                    icons.push({
                        icon: child.data.icon,
                        x: child.position.x,
                        y: child.position.y
                    });
                    break;
            }
        });
        
        // remove clone
        clone.remove();

        // reactivate layer
        layer.activate();
        
        console.log(Ext.encode({
            paths: paths,
            icons: icons
        }));

        // return layer data
        return {
            paths: paths,
            icons: icons
        };
    }

});
