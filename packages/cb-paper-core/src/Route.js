/**
 * Climbuddy paperjs route mixin
 */
Ext.define('CB.paper.Route', {
    
    config: {
        route: null
    },
    
    constructor: function() {
        this.getViewModel().bind('{routes.selection}', this.setRoute, this);
    },
    
    applyRoute: function(route) {
        // route not changed
        if (route === this.getRoute()) {
            return;
        }
        
        // get old route
        var oldRoute = this.getRoute(),
            layer;
        
        // unhighlight old
        if (oldRoute) {
            layer = this.getLayers().get(oldRoute.get('id'));
            if (layer) {
                this.colorLayer(layer, this.getStrokeColorNormal());
            }
        }
        
        // clear route
        if (!route || !(route instanceof CB.model.Route)) {
            return null;
        }
        
        // highlight new
        layer = this.getLayers().get(route.get('id'));
        if (layer) {
            this.colorLayer(layer, this.getStrokeColorActive());
        }
        
        // confirm change
        return route;
    },
    
    getSelectedRoute: function() {
        return this.getViewModel().get('routes.selection');
    }
    
    /*

    applyRoute: function(route) {
        if (typeof route === 'number') {
            route = this.getLocation().routes().getById(route);
        }
        
        if (route instanceof CB.model.Route) {

            // already set
            if (!this.getRoute() || this.getRoute() !== route) {

                // clear history
                //this.clearHistory();

                // deselect selected item
                if (this.selectedItem) {
                    this.selectedItem.selected = false;
                }

                // unhighlight previous layer
                if (this.activeLayer && this.getRoute().get('id') !== route.get('id')) {
                    this.colorLayer(this.activeLayer, this.strokeColorNormal);
                    this.showIcons(this.activeLayer, false);
                    this.activeLayer = null;
                }

                // highlight current layer
                var layer = this.layers.get(route.get('id'));
                if (layer) {
                    layer.activate();
                    this.activeLayer = layer;
                    this.colorLayer(this.activeLayer, this.strokeColorActive);
                }

                // redraw
                paper.view.draw();

                // confirm apply
                return route;
            }

        } else {

            // unhighlight previous layer
            if (this.activeLayer) {
                this.colorLayer(this.activeLayer, this.strokeColorNormal);
                this.activeLayer = null;

                // redraw
                paper.view.draw();
            }
            
            // confirm clear
            return null;
        }
    },
    
    updateRoute: function(newRoute, oldRoute) {
        console.log('TODO: fix routeselectionchange event', this);
        //this.fireEvent('routeselectionchange', this, newRoute, oldRoute);
    },

    removeRoutes: function(routes) {
        for (var i = 0, len = routes.length; i < len; i++) {
            var route = routes[i];
            var layer = this.layers.get(route.get('id'));
            if (layer) {
                // remove record
                var index = this.getFile().layers().findBy(function(rec, id) {
                    if (rec.get('routeId') === route.get('id')) {
                        return true;
                    }
                }, this);
                if (index > -1) this.getFile().layers().removeAt(index);

                // remove layer
                layer.remove();
            }
        }
        paper.view.draw();
    },

    routeMouseEnter: function(route) {
        var layer = this.layers.get(route.get('id'));
        if (layer && layer !== this.activeLayer && route !== this.getRoute()) {
            this.colorLayer(layer, this.strokeColorOver);
            paper.view.draw();
        }
    },

    routeMouseLeave: function(route) {
        var layer = this.layers.get(route.get('id'));
        if (layer && layer !== this.activeLayer && route !== this.getRoute()) {
            this.colorLayer(layer, this.strokeColorNormal);
            paper.view.draw();
        }
    }
    */

});