/**
 * Climbuddy paperjs path
 */
Ext.define('CB.paper.Path', {

    config: {
        pathSimplify: 10, // how much to "simplify" paths when user ends drawing a line

        pathWidth: 2,
        pathGhostWidth: 30,
        
        pathColorNormal: '#ff0000',
        pathColorOver: '#18ff00',
        pathColorActive: '#fff600'//'#18ff00'
    },
    
    createPath: function(data) {
        var path = new paper.Path(Ext.apply({
            strokeColor: this.getPathColorNormal(),
            strokeWidth: this.getPathWidth(),
            data: {
                type: 'line'
            }
        }, data));
        
        path.attach({
            click: Ext.bind(this.pathClick, this, [path], true)
        });
        
        return path;
    },
    
    createGhostPath: function(paths) {
        var ghost, path;
        
        Ext.each(paths, function(segments){
            
            path = new paper.Path({
                segments: segments,
                strokeColor: new paper.Color(0,0,0,0),
                strokeWidth: this.getPathGhostWidth(),
                data: {
                    type: 'ghost'
                }
            });
            
            if (!ghost) {
                ghost = path;
            } else {
                ghost.join(path);
            }
            
        }, this);
        
        ghost.attach({
            mouseenter: Ext.bind(this.pathMouseEnter, this, [ghost], true),
            mouseleave: Ext.bind(this.pathMouseLeave, this, [ghost], true),
            click: Ext.bind(this.pathClick, this, [ghost], true)
        });
        
        return ghost;
    },
    
    pathClick: function(e, path){
        if (!path || !path.parent || !path.parent.data || !path.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            vm = view.getViewModel(),
            oldRoute = this.getSelectedRoute(),
            newRoute = path.parent.data.route;
    
        if (newRoute === oldRoute && this.getAllowDeselect()) {
            newRoute = null; // deselect
        }
    
        vm.set('route', newRoute);
    
        view.fireEvent('routeselectionchange', view, newRoute, oldRoute, e);
    },
    
    pathMouseEnter: function(e, path){
        if (!path || !path.parent || !path.parent.data || !path.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            route = path.parent.data.route,
            selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorOver();

        this.colorRouteLayer(route, color);

        view.fireEvent('routemouseenter', view, route);
    },
    
    pathMouseLeave: function(e, path){
        if (!path || !path.parent || !path.parent.data || !path.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            route = path.parent.data.route,
            selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorNormal();

        this.colorRouteLayer(route, color);

        view.fireEvent('routemouseleave', view, route);
    }

});
