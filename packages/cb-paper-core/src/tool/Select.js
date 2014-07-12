Ext.define('CB.paper.tool.Select', {
    
    config: {
        selectedItem: null
    },
    
    constructor: function() {
        var tool = new paper.Tool();
        
        tool.name = 'select';
        
        tool.attach({
            mousedown: Ext.bind(this.selectToolMouseDown, this),
            mousedrag: Ext.bind(this.selectToolMouseDrag, this),
            mouseup: Ext.bind(this.selectToolMouseUp, this)
        });
        
        this.getTools().add(tool.name, tool);
    },
    
    selectToolMouseDown: function(e) {
        if (e.event.button !== 0) {
            return false;
        }
        
        var oldItem = this.getSelectedItem(),
            newItem;

        // unselect previous
        if (oldItem && oldItem !== e.item) {
            oldItem.selected = false;
        }

        // select item
        if (e.item) {
            newItem = e.item;
            newItem.selected = true;
            newItem.originalPosition = newItem.position;

        } else {
            newItem = null;
        }

        // set new selected item
        this.setSelectedItem(newItem);
    },
    
    selectToolMouseDrag: function(e) {
        if (e.event.button !== 0) {
            return false;
        }
        
        var item = this.getSelectedItem();
                
        if (!item || !item.data.type === 'icon') {
            return;
        }

        item.position = e.point;
        //this.drawChanged = true;
    },
    
    selectToolMouseUp: function(e) {
        switch (e.event.button) {
            /*
            // leftclick
            case 0:
                return;
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
            */
        }
    }

});
