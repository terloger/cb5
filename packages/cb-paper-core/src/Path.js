/**
 * Climbuddy paperjs path
 */
Ext.define('CB.paper.Path', {

    config: {
        pathSimplify: 10, // how much to "simplify" paths when user ends drawing a line
        pathWidth: 2,
        pathGhostWidth: 24,
        pathColorNormal: '#ff4f4f',
        pathColorOver: '#70ff60',
        pathColorActive: '#fff600',
        routeNumberColor: '#000'
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

    createRouteNumber: function(layer, route) {
        var point = this.getLayerStartPoint(layer),
            circle = new paper.Path.Circle({
                center: point,
                radius: 9,
                strokeWidth: 2,
                strokeColor: this.getPathColorNormal(),
                fillColor: this.getPathColorNormal(),
                //fillColor: '#fff',
                data: {
                    type: 'circle'
                }
            }),
            text = new paper.PointText({
                point: new paper.Point(point.x, point.y + 4),
                justification: 'center',
                fontSize: 13,
                fillColor: this.getRouteNumberColor(),
                content: route.get('pos') + 1,
                data: {
                    type: 'text'
                }
            });

        circle.attach({
            mouseenter: Ext.bind(this.pathMouseEnter, this, [circle], true),
            mouseleave: Ext.bind(this.pathMouseLeave, this, [circle], true),
            click: Ext.bind(this.pathClick, this, [circle], true)
        });

        text.attach({
            mouseenter: Ext.bind(this.pathMouseEnter, this, [text], true),
            mouseleave: Ext.bind(this.pathMouseLeave, this, [text], true),
            click: Ext.bind(this.pathClick, this, [text], true)
        });

        layer.addChild(circle);
        layer.addChild(text);

        layer.data.circle = circle;
        layer.data.text = text;

        circle.bringToFront();
        text.bringToFront();
    },

    updateRouteNumber: function(layer, route) {
        var point = this.getLayerStartPoint(layer),
            circle = layer.data.circle,
            text = layer.data.text;

        if (circle) {
            circle.position = point;
            circle.bringToFront();
        }

        if (text) {
            text.position = point;
            text.content = route.get('pos') + 1;
            text.bringToFront();
        }
    },

    updateRouteNumberText: function(layer, route) {
        var text = layer.data.text;

        if (text) {
            text.content = route.get('pos') + 1;
        }
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
