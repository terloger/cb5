Ext.define('CB.paper.History', {

    history: Ext.create('Ext.util.MixedCollection', {
        allowFunctions: true
    }),
    
    historyIndex: -1,

    addHistory: function(undo, redo) {
        var historyIndex = this.historyIndex + 1;
        if (historyIndex < this.history.getCount()) {
            this.history.removeRange(historyIndex, this.history.getCount() - historyIndex);
        }

        this.history.add(this.history.getCount(), {
            undo: undo,
            redo: redo
        });

        this.tbar.undoBtn.enable();
        this.tbar.redoBtn.disable();

        this.historyIndex++;
    },
    
    clearHistory: function() {
        this.historyIndex = -1;
        this.history.removeAll();
        this.tbar.undoBtn.disable();
        this.tbar.redoBtn.disable();
    },

    undoHistory: function() {
        if (this.history.getCount()) {
            var fn = this.history.getAt(this.historyIndex);
            if (fn && fn.undo && typeof fn.undo === 'function') {
                fn.undo();
                this.historyIndex--;
                this.tbar.redoBtn.enable();
                if (this.historyIndex === -1) {
                    this.tbar.undoBtn.disable();
                }
            }
        }
        
        this.tbar.undoBtn.blur();
    },

    redoHistory: function() {
        if (this.history.getCount()) {
            var fn = this.history.getAt(this.historyIndex + 1);
            if (fn && fn.redo && typeof fn.redo === 'function') {
                fn.redo();
                this.historyIndex++;
                this.tbar.undoBtn.enable();
                if (this.historyIndex === (this.history.getCount() - 1)) {
                    this.tbar.redoBtn.disable();
                }
            }
        }
        
        this.redoBtn.blur();
    }

});
