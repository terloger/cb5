Ext.define('CB.paper.Layer', {

    layers: Ext.create('Ext.util.MixedCollection'),

    activeLayer: null,

    // DO NOT change this!
    normalizedWidth: 800,
    normalizedHeight: 800,

    transformLayers: function(ratio) {
        var matrix = new paper.Matrix(ratio,0,0,ratio,0,0);
        for (var i = 0, ilen = paper.project.layers.length; i < ilen; i++) {
            var layer = paper.project.layers[i];
            for (var j = 0, jlen = layer.children.length; j < jlen; j++) {
                var child = layer.children[j];
                switch (child.data.type) {
                    case 'line':
                    case 'ghost':
                        child.transform(matrix);
                        break;
                    case 'icon':
                        child.position = new paper.Point(child.position.x * ratio, child.position.y * ratio);
                        break;
                }
            }
        }
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
        }
    },

    clearLayer: function(layer) {

        // no layer passed, find active layer
        if (!layer) {
            if (!this.activeLayer || !this.getRoute() || !this.getFile()) return false;
            layer = this.layers.get(this.getRoute().get('id'));
            if (layer !== this.activeLayer) return false;
        }
        
        // no layer found
        if (!layer) return;

        // fetch layer record
        var rec = this.getFile().layers().getById(this.activeLayer.layerId);
        
        // get layer project reference
        var project = layer.project;
        
        var undo = Ext.bind(function() {
            // re-add layer to project
            layer._project = project;
            layer._index = project.layers.push(layer) - 1;

            // re-add layer to collection
            this.layers.add(layer);
            
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
            this.layers.remove(layer);

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
        this.layers.each(function(layer) {
            this.commitLayer(layer);
        }, this);
    },

    commitLayer: function(layer) {
        // export route
        var data = this.exportLayer(layer);
        //var json = this.exportLayerJson(this.activeLayer);
        
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
    
    createLayer: function(layerId, routeId) {
        // create paper layer
        var layer = new paper.Layer();
        layer.layerId = layerId || -1;
        layer.routeId = routeId || -1;
        
        // add to collection
        this.layers.add(layer.routeId, layer);
        
        // this is active layer
        /*
        if (this.getRoute() && this.getRoute().get('id') === layer.routeId) {
            this.setActiveLayer(layer);
        }
        */
        
        return layer;
    },

    importLayer: function(record) {

        /**
         * Imports from normalized export.
         *
         * @param {object} extjs record CB.model.Layer
         */

        var layer = this.createLayer(record.get('id'), record.get('routeId'));

        // calculate de-normalized matrix
        var wr = this.getImage().getWidth() / this.normalizedWidth, // width ratio
            hr = this.getImage().getHeight() / this.normalizedHeight, // height ratio
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
        if (data.icons && data.icons.length) {
            for (var i = 0, len = data.icons.length; i < len; i++) {
                var icon = data.icons[i];
                this.createIcon(icon.icon, icon.x * nr, icon.y * nr);
            }
        }
        
        paper.view.draw();
    },

    exportLayer: function(layer) {

        /**
         * Exports layer to normalized paperjs array of paths and icons which we can store into db.
         *
         * @argument {object} paperjs layer http://paperjs.org/reference/layer
         */

        // calculate normalized matrix
        var imageWidth  = this.getImage().getWidth(),
            imageHeight = this.getImage().getHeight(),
            widthRatio  = this.normalizedWidth / imageWidth,
            heightRatio = this.normalizedHeight / imageHeight,
            newRatio    = widthRatio > heightRatio ? widthRatio : heightRatio,
            matrix      = new paper.Matrix(newRatio,0,0,newRatio,0,0);

        // prepare export
        var paths = [];
        var icons = [];

        // clone entire layer
        var clone = layer.clone();

        // loop through children
        for (var i = 0, ilen = clone.children.length; i < ilen; i++) {
            var cloned = clone.children[i];
            var original = layer.children[i];
            cloned.data = original.data;
            switch (cloned.data.type) {
                case 'line':
                    cloned.transform(matrix);
                    var segments = [];
                    for (var j = 0, jlen = cloned.segments.length; j < jlen; j++) {
                        var segment = cloned.segments[j];
                        segments.push({
                            point:     { x: segment.point.x,     y: segment.point.y },
                            handleIn:  { x: segment.handleIn.x,  y: segment.handleIn.y },
                            handleOut: { x: segment.handleOut.x, y: segment.handleOut.y }
                        });
                    }
                    paths.push(segments);
                    break;
                case 'icon':
                    icons.push({
                        icon: cloned.data.icon,
                        x: cloned.position.x * newRatio,
                        y: cloned.position.y * newRatio
                    });
                    break;
            }
        }

        // remove clone
        clone.remove();

        // reactivate layer
        layer.activate();
        this.getActiveLayer(layer);

        var retVal = {
            paths: paths,
            icons: icons
        };

        return retVal;
    },

    exportLayerJson: function(layer) {

        /**
         * Exports layer to normalized paperjs array of paths which we can store into db.
         *
         * @argument {object} paperjs layer http://paperjs.org/reference/layer
         */

        // calculate normalized matrix
        var imageWidth  = this.getImage().getWidth(),
            imageHeight = this.getImage().getHeight(),
            widthRatio  = this.normalizedWidth / imageWidth,
            heightRatio = this.normalizedHeight / imageHeight,
            newRatio    = widthRatio > heightRatio ? widthRatio : heightRatio,
            matrix      = new paper.Matrix(newRatio,0,0,newRatio,0,0);

        // prepare export
        var paths = [];
        var icons = [];

        // clone entire layer
        var clone = layer.clone();

        // loop through paths
        for (var i = 0, ilen = clone.children.length; i < ilen; i++) {
            var cloned = clone.children[i];
            var original = layer.children[i];
            cloned.data = original.data;
            switch (cloned.data.type) {
                case 'line':
                    cloned.transform(matrix);
                    break;
                case 'icon':
                    cloned.position = new paper.Point(cloned.position.x * newRatio, cloned.position.y * newRatio);
                    break;
            }
        }

        var json = clone.exportJSON();

        // remove clone
        clone.remove();

        // reactivate layer
        layer.activate();
        this.getActiveLayer(layer);

        return json;
    }

});
