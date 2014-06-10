Ext.define('CB.paper.Path', {

    config: {
        activePath: null,
        simplifyPath: 10, // how much to "simplify" paths when user draws a line with mouse

        strokeWidth: 2,
        strokeColorNormal: '#ff0000',
        strokeColorOver: '#fff600',
        strokeColorActive: '#18ff00',

        ghostStrokeWidth: 30,
        ghostStrokeColor: '#ffffff',
        ghostStrokeColorAlpha: .0
    },
    
    createPath: function(data, route) {
        var path = new paper.Path(data);
        path.data.type = 'line';
        path.strokeWidth = this.getStrokeWidth();
        path.strokeColor = this.getStrokeColorNormal();
        
        return path;
    },
    
    createGhostPath: function(paths) {
        var ghost;
        
        for (var i = 0, len = paths.length; i < len; i++) {
            var data = paths[i];
            
            var path = new paper.Path(data);
            path.data.type = 'ghost';
            path.strokeWidth = this.getGhostStrokeWidth();
            path.strokeColor = this.getGhostStrokeColor();
            path.strokeColor.alpha = this.getGhostStrokeColorAlpha();
            
            if (!ghost) {
                ghost = path;
            } else {
                ghost.join(path);
            }
        }
        /*
        ghost.onMouseEnter = Ext.bind(function(){
            var route = this.getLocation().routes().getById(ghost.parent.routeId);
            if (route) {
                this.routeMouseEnter(route);
                this.fireEvent('routemouseenter', this, route);
            }
            
        }, this);
        
        ghost.onMouseLeave = Ext.bind(function(){
            var route = this.getLocation().routes().getById(ghost.parent.routeId);
            if (route) {
                this.routeMouseLeave(route);
                this.fireEvent('routemouseleave', this, route);
            }
        }, this);
        
        ghost.on('click', Ext.bind(function(){
            var route = this.getLocation().routes().getById(ghost.parent.routeId);
            if (route && route !== this.getRoute()) {
                this.setRoute(route);
            } else {
                this.setRoute();
            }
        }, this));
        */
        return ghost;
    }

});
