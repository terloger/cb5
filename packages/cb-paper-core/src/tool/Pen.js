Ext.define('CB.paper.tool.Pen', {

    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'pen';
        
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

        this.getTools().add(tool.name, tool);
    }

});