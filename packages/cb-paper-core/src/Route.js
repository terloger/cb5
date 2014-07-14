/**
 * Climbuddy paperjs route mixin
 */
Ext.define('CB.paper.Route', {
    
    config: {
        route: null
    },
    
    constructor: function() {
        var view = this.getView(),
            vm = view.getViewModel();
        
        // provide functions for the view
        view.removeRoute = Ext.bind(this.removeRoute, this);
        view.routeMouseEnter = Ext.bind(this.routeMouseEnter, this);
        view.routeMouseLeave = Ext.bind(this.routeMouseLeave, this);
        
        // bind to route selection change
        vm.bind('{routes.selection}', this.setRoute, this);
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
        return this.getViewModel().get('routes.selection');
    },
    
    removeRoute: function(route) {
        var layer = this.getRouteLayer(route);
        this.removeLayer(layer);
    },
    
    routeMouseEnter: function(route) {
        var color = this.getPathColorOver();
        this.colorRouteLayer(route, color);
    },
    
    routeMouseLeave: function(route) {
        var selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorNormal();
    
        this.colorRouteLayer(route, color);
    }
    
});
