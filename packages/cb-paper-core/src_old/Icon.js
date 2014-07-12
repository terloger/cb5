Ext.define('CB.paper.Icon', {

    icons: [
        'anchor',
        'arete',
        'belay',
        'bolt',
        'chimney',
        'chockstone',
        'couloir',
        'crack',
        'crux',
        'dihedral',
        'grass',
        'hole',
        'overhang',
        'piton',
        'ramp',
        'rock',
        'roof',
        'sanduhr',
        'slab',
        'snow',
        'tree'
    ],

    getIconUrl: function(icon) {
        return '/resources/images/signs/' + icon + '.png';
    },

    createIcon: function(icon, x, y, visible, createHistory) {
        // icon url
        var source = this.getIconUrl(icon);

        // icon config
        var minScale = Math.pow(1 / 1.1, 2),
            maxScale = Math.pow(1.1, 2),
            minOpacity = 1,
            maxOpacity = 1;

        // create raster
        var raster = new paper.Raster({
            source: source,
            position: new paper.Point(x, y),
            opacity: minOpacity,
            visible: visible || false
        });

        // downscale raster
        raster.scale(minScale);

        // custom raster properties
        raster.data.type = 'icon';
        raster.data.icon = icon;

        // history
        if (createHistory) {
            var parent = raster.parent;
            var selectedItem = this.selectedItem;

            var undo = Ext.bind(function() {
                this.selectedItem = null;
                raster.selected = false;
                raster.remove();

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
                }
                this.selectedItem = raster;
                raster.parent = parent;
                raster.selected = true;
                paper.view.draw();
                this.fireEvent('change', this);
            }, this);

            this.addHistory(undo, redo);

            redo();
        }
    },

    showIcons: function(layer, visible) {
        if (layer) {
            for (var i = 0, len = layer.children.length; i < len; i++) {
                var child = layer.children[i];
                switch (child.data.type) {
                    case 'line':
                        break;
                    case 'icon':
                        child.visible = visible;
                        break;
                }
            }
        }
    }

});
