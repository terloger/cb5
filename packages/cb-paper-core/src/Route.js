/**
 * Climbuddy paperjs route mixin
 */
Ext.define('CB.paper.Route', {
    
    config: {
        route: null,
        allowDeselect: false
    },
    
    constructor: function() {
        var view = this.getView(),
            vm = view.getViewModel();
        
        // provide functions for the view
        view.getSelectedRoute = Ext.bind(this.getSelectedRoute, this);
        view.clearRoute = Ext.bind(this.clearRoute, this);
        view.removeRoute = Ext.bind(this.removeRoute, this);
        view.routeMouseEnter = Ext.bind(this.routeMouseEnter, this);
        view.routeMouseLeave = Ext.bind(this.routeMouseLeave, this);
        
        // bind to route selection change
        vm.bind('{route}', this.setRoute, this);
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
            layer = this.getRouteLayer(oldRoute);
            if (layer) {
                this.colorLayer(layer, this.getPathColorNormal());
            }
        }
        
        // clear route
        if (!route || !(route instanceof CB.model.Route)) {
            return null;
        }

        // activate and highlight new
        layer = this.getRouteLayer(route);
        if (layer) {
            layer.activate();
            this.setActiveLayer(layer);
            this.colorLayer(layer, this.getPathColorActive());
        }
        
        // confirm change
        return route;
    },
    
    getSelectedRoute: function() {
        return this.getViewModel().get('route');
    },

    clearRoute: function(route) {
        var layer = this.getRouteLayer(route);
        if (layer) {
            this.removeLayer(layer);
        }
    },
    
    removeRoute: function(route) {
        if (route === this.getSelectedRoute()) {
            this.getViewModel().set('route', null);
        }

        this.clearRoute(route);
    },
    
    routeMouseEnter: function(route) {
        var selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorOver();
    
        this.colorRouteLayer(route, color);
    },
    
    routeMouseLeave: function(route) {
        var selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorNormal();
    
        this.colorRouteLayer(route, color);
    }
    
});
