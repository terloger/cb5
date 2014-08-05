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
            path;
        
        // must have route
        route = this.getSelectedRoute();
        if (!route) {
            return;
        }
        
        // make sure we have route layer before we create path
        layer = this.getRouteLayer(route.get('id'));
        if (!layer) {
            // we will assign record when we commit layer in penToolMouseUp
            layer = this.createLayer(null, route);
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
            strokeColor: this.getPathColorActive(),
            fullySelected: true
        });
        
        // set selected item
        this.setSelectedItem(path);
        
        // add point if event withing image box
        if (this.withinImage(e.event.offsetX, e.event.offsetY)) {
            path.add(e.point);
        }
    },
    
    penToolMouseDrag: function(e) {
        var path = this.getSelectedItem();
        
        // no path or not within image
        if (!path || !this.withinImage(e.event.offsetX, e.event.offsetY)) {
            return;
        }
        
        path.add(e.point);
    },
    
    penToolMouseUp: function(e) {
        var view = this.getView(),
            path = this.getSelectedItem();

        // no path
        if (!path) {
            return;
        }
        
        // simplify path
        path.simplify(this.getPathSimplify());
        
        // fully select path
        path.fullySelected = false;

        // create ghost path
        this.createGhostPath([path.segments]);
        
        // commit active layer
        this.commitLayer(this.getActiveLayer());
        
        // fire draw event
        this.fireEvent('paperchanged', view, path);
    }

});
