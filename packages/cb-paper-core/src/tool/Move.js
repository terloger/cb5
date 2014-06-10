Ext.define('CB.paper.tool.Move', {

    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'move';
        
        tool.onMouseDown = Ext.bind(function(e) {
            switch (e.event.button) {
                // leftclick
                case 0:
                    // unselect previous
                    if (this.selectedItem && this.selectedItem !== e.item) {
                        this.selectedItem.selected = false;
                    }

                    // select item
                    if (e.item) {
                        this.selectedItem = e.item;
                        this.selectedItem.selected = true;
                        this.selectedItem.originalPosition = this.selectedItem.position;
                    } else {
                        this.selectedItem = null;
                    }
                    break;
                // rightclick
                case 2:
                    break;
            }
        }, this);

        tool.onMouseDrag = Ext.bind(function(e) {
            switch (e.event.button) {
                // leftclick
                case 0:
                    if (this.selectedItem && this.selectedItem.data.type === 'icon') {
                        this.selectedItem.position = e.point;
                        this.drawChanged = true;
                    }
                    break;
                // rightclick
                case 2:
                    break;
            }
        }, this);

        tool.onMouseUp = Ext.bind(function(e) {
            switch (e.event.button) {
                // leftclick
                case 0:
                    if (this.selectedItem && this.drawChanged) {

                        // create move history

                        var item = this.selectedItem,
                            position = item.position,
                            originalPosition = item.originalPosition;

                        this.selectedItem = null;

                        var undo = Ext.bind(function() {
                            if (this.selectedItem) {
                                this.selectedItem.selected = false;
                                this.selectedItem = null;
                            }
                            item.position = originalPosition;
                            item.selected = true;
                            this.selectedItem = item;
                            paper.view.draw();
                            this.fireEvent('change', this);
                        }, this);

                        var redo = Ext.bind(function() {
                            if (this.selectedItem) {
                                this.selectedItem.selected = false;
                                this.selectedItem = null;
                            }
                            item.position = position;
                            item.selected = true;
                            this.selectedItem = item;
                            paper.view.draw();
                            this.fireEvent('change', this);
                        }, this);

                        this.addHistory(undo, redo);

                        redo();
                        
                        this.drawChanged = false;
                        
                        this.fireEvent('change', this);
                    }
                    break;
                // rightclick
                case 2:
                    break;
            }
        }, this);

        this.getTools().add(tool.name, tool);
    }

});
