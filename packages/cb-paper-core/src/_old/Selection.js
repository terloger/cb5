Ext.define('CB.paper.Selection', {

    selectedItem: null,

    deleteSelectedItem: function() {
        if (this.selectedItem) {
            var item = this.selectedItem,
                parent = this.selectedItem.parent,

                undo = Ext.bind(function() {
                    if (this.selectedItem) {
                        this.selectedItem.selected = false;
                    }
                    this.selectedItem = item;
                    item.selected = true;
                    item.parent = parent;
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this),

                redo = Ext.bind(function() {
                    this.selectedItem = null;
                    item.selected = false;
                    item.remove();
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this);

            this.addHistory(undo, redo);

            redo();
        }
    }

});

/*
Ext.define('CB.common.paper.Selection', {

    config: {
        selectedItem: null
    },

    deleteSelectedItem: function() {
        if (this.getSelectedItem()) {
            var item = this.getSelectedItem(),
                parent = item.parent,
                
                undo = Ext.bind(function() {
                    if (this.getSelectedItem()) {
                        this.getSelectedItem().selected = false;
                    }
                    this.setSelectedItem(item);
                    item.selected = true;
                    item.parent = parent;
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this),
                
                redo = Ext.bind(function() {
                    this.setSelectedItem(null);
                    item.selected = false;
                    item.remove();
                    paper.view.draw();
                    this.fireEvent('change', this);
                }, this);

            this.addHistory(undo, redo);

            redo();
        }
    }

});
*/
