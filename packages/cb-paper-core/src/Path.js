/**
 * Climbuddy paperjs path
 */
Ext.define('CB.paper.Path', {

    config: {
        simplifyPath: 10, // how much to "simplify" paths when user ends drawing a line

        strokeWidth: 2,
        ghostStrokeWidth: 30,
        
        strokeColorNormal: '#ff0000',
        strokeColorOver: '#fff600',
        strokeColorActive: '#18ff00'
    },
    
    constructor: function(config) {
    },
    
    createPath: function(data) {
        return new paper.Path(Ext.apply(data, {
            strokeColor: this.getStrokeColorNormal(),
            strokeWidth: this.getStrokeWidth(),
            data: {
                type: 'line'
            }
        }));
    },
    
    createGhostPath: function(paths) {
        var ghost, path;
        
        Ext.each(paths, function(segments){
            
            path = new paper.Path({
                segments: segments,
                strokeColor: new paper.Color(0,0,0,0),
                strokeWidth: 30,
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
        
        return ghost;
    }

});
