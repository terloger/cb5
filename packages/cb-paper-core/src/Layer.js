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
        
        // add layer to collection
        this.getLayers().add(routeId, layer);
        
        // this is active layer
        /*
        if (this.getRoute() && this.getRoute().get('id') === layer.routeId) {
            this.setActiveLayer(layer);
        }
        */
        
        return layer;
    },
    
    commitLayer: function(layer) {
        var view = this.getView(),
            parentView = view.up('cb-location'),
            vm = view.getViewModel(),
            session = parentView.getSession(),
            route = vm.get('routes.selection'),
            file = vm.get('file'),
            layerRec = file.layers().getAt(file.layers().find('routeId', route.get('id'))),
            layerData = this.exportLayer(layer);
        
        if (!layerRec) {
            
            // create layer record
            layerRec = session.createRecord('Layer', {
                data: Ext.encode(layerData)
            });
            layerRec.setFile(file);
            layerRec.setRoute(route);
            
        } else {
            
            // update layer record
            layerRec.set('data', Ext.encode(layerData));
            
        }
        
        /*
        console.log('session', session);
        console.log('route', route);
        console.log('file', file);
        console.log('layer', layer);
        console.log('layerRec', layerRec);
        console.log('layerData', layerData);
        */
        
        // associate layer record to file
        file.layers().insert(0, layerRec);
    },
    
    commitLayers: function() {
        this.getLayers().each(function(layer) {
            this.commitLayer(layer);
        }, this);
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
    
    /**
     * Transform
     */
    
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
    
    transformLayers: function(scale, cx, cy, dx, dy) {
        var matrix = new paper.Matrix(),
            center = new paper.Point(cx, cy);
    
        matrix.scale(scale, center);
        matrix.translate(dx, dy);
        
        Ext.each(paper.project.layers, function(layer){
            layer.transform(matrix);
        });
        
        paper.view.draw();
    },

    
    
    /**
     * Import/export
     */
    
    importLayer: function(layerRec) {
        var data = Ext.decode(layerRec.get('data')),
            layer = this.createLayer(layerRec),
            matrix = this.getImportMatrix(),
            path,
            ghost;
    
        // import paths
        if (data.paths && data.paths.length) {
            Ext.each(data.paths, function(segments){
                path = this.createPath({
                    segments: segments
                });
                layer.addChild(path);
            }, this);
            
            ghost = this.createGhostPath(data.paths);
            layer.addChild(ghost);
        }

        // de-normalize layer
        layer.transform(matrix);
        
        paper.view.draw();
    },
    
    exportLayer: function(layer) {
        var matrix = this.getExportMatrix(),
            clone = layer.clone(),
            segments = [],
            paths = [],
            icons = [];
    
        // normalize layer
        clone.transform(matrix);
        
        // loop through children
        Ext.each(clone.children, function(child){
            switch (child.data.type) {
                case 'line':
                    // store line
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
                    // store icon
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

        // return layer data
        return {
            paths: paths,
            icons: icons
        };
    },
    
    getImportMatrix: function() {
        var matrix = new paper.Matrix(),
            tx = Math.round(this.getTranslateX()),
            ty = Math.round(this.getTranslateY()),
            wr = this.getImageScaledWidth() / this.getNormalizedWidth(),
            hr = this.getImageScaledHeight() / this.getNormalizedHeight(),
            scale = wr < hr ? wr : hr;
    
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
            
        matrix.scale(scale);
        matrix.translate(tx, ty);
        
        return matrix;
    }

});
