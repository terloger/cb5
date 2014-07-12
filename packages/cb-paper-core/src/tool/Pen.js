Ext.define('CB.paper.tool.Pen', {
    
    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'pen';
        
        tool.attach({
            mousedown: Ext.bind(this.penToolMouseDown, this),
            mousedrag: Ext.bind(this.penToolMouseDrag, this),
            mouseup: Ext.bind(this.penToolMouseUp, this)
        });
        
        this.getTools().add(tool.name, tool);
    },
    
    penToolMouseDown: function(e) {
        var route,
            layer,
            oldPath,
            path,
            box,
            x,
            y;
        
        // must have route
        route = this.getSelectedRoute();
        if (!route) {
            return;
        }
        
        // make sure we have route layer before we add path
        layer = this.getLayers().get(route.get('id'));
        if (!layer) {
            layer = this.createLayer(route.get('id'));
        }
        
        // activate layer
        layer.activate();
        this.setActiveLayer(layer);
        
        // deselect old path
        oldPath = this.getSelectedItem();
        if (oldPath) {
            oldPath.selected = false;
        }
        
        // create new path
        path = this.createPath({
            segments: [],
            fullySelected: true
        });
        
        // set selected item
        this.setSelectedItem(path);
        
        // add point if event withing image box
        box = this.getImage().getBox();
        x = e.event.x;
        y = e.event.y;
        if (x > box.left && x < box.right && y > box.top && y < box.bottom) {
            path.add(e.point);
        }
    },
    
    penToolMouseDrag: function(e) {
        var path = this.getSelectedItem(),
            box = this.getImage().getBox(),
            x = e.event.x,
            y = e.event.y;
        
        // no path
        if (!path) {
            return;
        }
        
        // add point if event withing image box
        if (x > box.left && x < box.right && y > box.top && y < box.bottom) {
            path.add(e.point);
        }
    },
    
    penToolMouseUp: function(e) {
        var view = this.getView(),
            path = this.getSelectedItem();
        
        // no path
        if (!path) {
            return;
        }
        
        // simplify path
        path.simplify(this.getSimplifyPath());
        
        // fully select path
        path.fullySelected = true;
        
        // commit layer
        this.commitLayer(this.getActiveLayer());
        
        // fire draw event
        this.fireEvent('paperchanged', view, path);
    }
    
    /*
    tool.onMouseDown = Ext.bind(function(e) {
        if (!this.file || !this.route) return false;

        switch (e.event.button) {
            // leftclick
            case 0:
                // load route layer
                var layer = this.getRouteLayer();
                layer.activate();
                this.activeLayer = layer;

                // if we produced a path before, deselect it
                if (this.selectedItem) {
                    this.selectedItem.selected = false;
                }

                // create a new path and set its stroke color to black:
                this.activePath = this.createPath(null, this.route);
                this.activePath.add(e.point);
                this.activePath.data.type = 'line';
                this.activePath.strokeWidth = this.strokeWidth;
                this.activePath.strokeColor = this.strokeColorActive;

                // select the path, so we can see its segment points:
                this.activePath.fullySelected = true;
                break;
            // rightclick
            case 2:
                break;
        }
    }, this);

    tool.onMouseDrag = Ext.bind(function(e) {
        if (!this.file || !this.route || !this.activePath) return false;

        switch (e.event.button) {
            // leftclick
            case 0:
                this.activePath.add(e.point);
                break;
            // rightclick
            case 2:
                break;
        }
    }, this);

    tool.onMouseUp = Ext.bind(function(e) {
        if (!this.file || !this.route || !this.activePath) return false;

        switch (e.event.button) {
            // leftclick
            case 0:
                // when the mouse is released, simplify it:
                this.activePath.simplify(this.simplifyPath);

                // select the path, so we can see its segments:
                this.activePath.fullySelected = true;

                // create history point
                var path = this.activePath,
                    parent = this.activePath.parent,
                    selectedItem = this.selectedItem;

                var undo = Ext.bind(function() {
                    this.selectedItem = null;
                    path.selected = false;
                    path.remove();
                    if (selectedItem) {
                        this.selectedItem = selectedItem;
                        this.selectedItem.selected = true;
                    }
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this);

                var redo = Ext.bind(function() {
                    if (this.selectedItem) {
                        this.selectedItem.selected = false;
                        this.selectedItem = null;
                    }
                    this.selectedItem = path;
                    path.selected = true;
                    path.parent = parent;
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this);

                this.addHistory(undo, redo);

                // select path
                this.selectedItem = this.activePath;
                this.selectedItem.selected = true;

                // finish drawing
                this.activePath = null;

                this.fireEvent('change', this);

                break;
            // rightclick
            case 2:
                break;
        }
    }, this);

    */

});
