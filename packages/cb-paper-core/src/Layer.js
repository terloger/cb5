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
    
    /**
     * Core
     */
    
    constructor: function() {
        // create layer collection
        this.setLayers(Ext.create('Ext.util.MixedCollection'));
        
        var view = this.getView();
        
        // provide functions for the view
        view.remapLayers = Ext.bind(this.remapLayers, this);
    },
    
    getRouteLayer: function(route) {
        var routeId = route instanceof CB.model.Route ? route.get('id') : route;
        return this.getLayers().get(routeId);
    },
    
    getRecordLayer: function(record) {
        var recordId = record instanceof CB.model.Layer ? record.get('id') : record;
        return this.getLayers().findBy(function(layer){
            return layer.data.record && layer.data.record.get('id') === recordId;
        }, this);
    },
    
    /**
     * Crate/remove
     */
    
    createLayer: function(record, route) {
        // create paper layer
        var layer = new paper.Layer({
            data: {
                record: record,
                route: route
            }
        });
        
        // set paper layer reference on layer record
        if (record) {
            record.setPaperLayer(layer);
        }
        
        // add layer to collections
        this.getLayers().add(route.get('id'), layer);
        
        return layer;
    },
    
    removeLayer: function(layer) {
        if (layer) {
            this.getLayers().remove(layer);
            layer.remove();
        }
    },
    
    remapLayers: function() {
        this.getLayers().eachKey(function(routeId, layer){
            var route = layer.data.route;
            
            if (!route) {
                return;
            }
            
            // ext assigns dynamic id for newly created records
            // example: Route-1, Route-2, Route-3, ...
            // when records are saved, the receive id from the server
            // this is where we check if the id changed and update it
            if (route.get('id') !== routeId) {
                this.getLayers().updateKey(routeId, route.get('id'));
            }
        }, this);
    },
    
    /**
     * Commit
     */
    
    commitLayer: function(layer) {
        var view = this.getView(),
            vm = view.getViewModel(),
            session = view.getSession(),
            file = vm.get('file'),
            route = vm.get('routes.selection'),
            record = layer.data.record,
            layerData = this.exportLayer(layer);
    
        if (!record) {
            
            // create layer record
            record = session.createRecord('Layer', {
                data: Ext.encode(layerData)
            });
            record.setRoute(route);
            
            // set record reference on paper layer
            layer.data.record = record;
            
            // set paper layer reference on layer record
            record.setPaperLayer(layer);
            
            // associate layer record to file
            file.layers().add(record);
            
        } else {
            
            // update layer record
            record.set('data', Ext.encode(layerData));
            
        }
    },
    
    commitLayers: function() {
        this.getLayers().each(function(layer) {
            this.commitLayer(layer);
        }, this);
    },
    
    /**
     * Color
     */
    
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
    
    colorRouteLayer: function(route, color) {
        this.colorLayer(this.getRouteLayer(route), color);
    },
    
    colorRecordLayer: function(record, color) {
        this.colorLayer(this.getRecordLayer(record), color);
    },

    /**
     * Transform
     */
    
    scaleLayers: function(scale, cx, cy) {
        var matrix = new paper.Matrix(),
            center = cx && cy ? new paper.Point(cx, cy) : null;
            
        matrix.scale(scale, center);
        
        this.transformLayers(matrix);
    },
    
    translateLayers: function(dx, dy) {
        var matrix = new paper.Matrix();
        
        matrix.translate(dx, dy);
        
        this.transformLayers(matrix);
    },
    
    transformLayers: function(matrix) {
        Ext.each(paper.project.layers, function(layer){
            layer.transform(matrix);
        });
        
        paper.view.draw();
    },

    /**
     * Import/export
     */
    
    importLayer: function(record) {
        var data = Ext.decode(record.get('data')),
            layer = this.createLayer(record, record.getRoute()),
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
