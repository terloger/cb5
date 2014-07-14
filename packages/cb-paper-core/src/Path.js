/**
 * Climbuddy paperjs path
 */
Ext.define('CB.paper.Path', {

    config: {
        pathSimplify: 10, // how much to "simplify" paths when user ends drawing a line

        pathWidth: 2,
        pathGhostWidth: 30,
        
        pathColorNormal: '#ff0000',
        pathColorOver: '#fff600',
        pathColorActive: '#fff600'//'#18ff00'
    },
    
    createPath: function(data) {
        return new paper.Path(Ext.apply({
            strokeColor: this.getPathColorNormal(),
            strokeWidth: this.getPathWidth(),
            data: {
                type: 'line'
            }
        },data));
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
            mouseenter: Ext.bind(this.ghostPathMouseEnter, this, [ghost], true),
            mouseleave: Ext.bind(this.ghostPathMouseLeave, this, [ghost], true),
            click: Ext.bind(this.ghostPathClick, this, [ghost], true)
        });
        
        return ghost;
    },
    
    ghostPathClick: function(e, ghost){
        if (!ghost || !ghost.parent || !ghost.parent.data || !ghost.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            route = ghost.parent.data.route;
    
        view.fireEvent('routeclick', view, route);
    },
    
    ghostPathMouseEnter: function(e, ghost){
        if (!ghost || !ghost.parent || !ghost.parent.data || !ghost.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            route = ghost.parent.data.route,
            color = this.getPathColorOver();

        this.colorRouteLayer(route, color);

        view.fireEvent('routemouseenter', view, route);
    },
    
    ghostPathMouseLeave: function(e, ghost){
        if (!ghost || !ghost.parent || !ghost.parent.data || !ghost.parent.data.route) {
            return;
        }
        
        var view = this.getView(),
            route = ghost.parent.data.route,
            selected = this.getSelectedRoute(),
            color = route === selected ? this.getPathColorActive() : this.getPathColorNormal();

        this.colorRouteLayer(route, color);

        view.fireEvent('routemouseleave', view, route);
    }

});
