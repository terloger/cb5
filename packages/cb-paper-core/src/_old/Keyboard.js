Ext.define('CB.paper.Keyboard', {

    onBodyMouseEnter: function (e) {
        // focus if not edited
        if (!this.header) {
            this.header = Ext.ComponentQuery.query('locationheader')[0];
        }
        if (!this.header.editor && !this.routes.editingPlugin.activeEditor) {
            this.focus();
        }
        
        // attach key events
        if (!this.keyEvents) {
            Ext.getBody().on({
                keydown: this.onBodyKeyDown,
                keyup: this.onBodyKeyUp,
                scope: this
            });
            this.keyEvents = true;
        }
    },

    onBodyMouseLeave: function (e) {
        // unattach key events if not holding down key special key
        if (!this.keyDown) {
            Ext.getBody().un({
                keydown: this.onBodyKeyDown,
                keyup: this.onBodyKeyUp,
                scope: this
            });
        }
        this.keyEvents = false;
    },

    onBodyKeyDown: function (e) {
        switch (e.getKey()) {
            //
            // hide toolbars and routes
            // 
            case e.TAB:
                if (this.hideBars) {
                    this.fitTbar();
                    this.fitBbar();
                    this.tbar.animate({ to: { opacity: 1 },   easing: 'easeOut', duration: 150 });
                    this.bbar.animate({ to: { opacity: 1 },   easing: 'easeOut', duration: 150 });
                    this.routes.animate({ to: { opacity: 1 }, easing: 'easeOut', duration: 150 });
                        this.hideBars = false;
                        this.animateToFit();
                } else {
                    this.tbar.animate({ to: { opacity: 0 },   easing: 'easeOut', duration: 150 });
                    this.bbar.animate({ to: { opacity: 0 },   easing: 'easeOut', duration: 150 });
                    this.routes.animate({ to: { opacity: 0 }, easing: 'easeOut', duration: 150 });
                        this.hideBars = true;
                        this.animateToFit();
                }
                e.stopEvent();
                break;
            //
            // toggle fullscreen
            //
            case e.F:
            case e.ENTER:
                if ((e.ENTER && e.ctrlKey) || e.F) {
                    if (this.window.maximized) {
                        this.window.restore();
                    } else {
                        this.window.maximize();
                    }
                    e.stopEvent();
                }
                break;
            //
            // show/hide icons
            //
            case e.I:
                if (this.route) {
                    this.iconsVisible = !this.iconsVisible;
                    this.showIcons(this.activeLayer, this.iconsVisible);
                    paper.view.draw();
                    e.stopEvent();
                }
                break;
            //
            // delete item
            //
            case e.DELETE:
                this.deleteSelectedItem();
                e.stopEvent();
                break;
            //
            // undo
            //
            case e.Z:
                if (e.ctrlKey) {
                    this.undoHistory();
                    e.stopEvent();
                }
                break;
            //
            // redo
            //
            case e.Y:
                if (e.ctrlKey) {
                    this.redoHistory();
                    e.stopEvent();
                }
                break;
            //
            // prev
            //
            case e.LEFT:
                this.prevFile();
                e.stopEvent();
                break;
            //
            // prev
            //
            case e.RIGHT:
                this.nextFile();
                e.stopEvent();
                break;
            //
            // prev
            //
            case e.UP:
                var selection = this.routes.getSelectionModel().getSelection();
                var index = (selection.length) ? this.routes.store.indexOf(selection[0]) - 1 : 0;
                if (index < 0) index = 0;
                this.routes.getSelectionModel().selectRange(index, index, false);
                this.focus();
                e.stopEvent();
                break;
            //
            // prev
            //
            case e.DOWN:
                var selection = this.routes.getSelectionModel().getSelection();
                var count = this.routes.store.getCount();
                var index = (selection.length) ? this.routes.store.indexOf(selection[0]) + 1 : 0;
                if (index >= count) index = count - 1;
                this.routes.getSelectionModel().selectRange(index, index, false);
                this.focus();
                e.stopEvent();
                break;
            //
            // tools
            //
            case e.V:
                if (this.activeTool.name !== 'move' && CB.User) {
                    this.setActiveTool('move');
                }
                e.stopEvent();
                break;
            case e.B:
                if (this.activeTool.name !== 'pen' && CB.User) {
                    this.setActiveTool('pen');
                }
                e.stopEvent();
                break;
            case e.H:
                if (this.activeTool.name !== 'hand') {
                    this.setActiveTool('hand');
                }
                e.stopEvent();
                break;
            case e.SPACE:
                if (this.activeTool.name !== 'hand') {
                    this.previousTool = this.activeTool;
                    this.setActiveTool('hand');
                    this.keyDown = true;
                    this.focus();
                }
                e.stopEvent();
                break;
        }
    },

    onBodyKeyUp: function (e) {
        switch (e.getKey()) {
            case e.SPACE:
                if (this.previousTool) {
                    this.setActiveTool(this.previousTool.name);
                    this.previousTool = null;
                    this.keyDown = false;
                }
                e.stopEvent();
                break;
        }

        // cleanup key events in case user was holding down special key
        if (!this.keyEvents) {
            Ext.getBody().un({
                keydown: this.onBodyKeyDown,
                keyup: this.onBodyKeyUp,
                scope: this
            });
        }
    }

});
