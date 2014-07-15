Ext.define('CB.paper.tool.Move', {
    
    config: {
        hitTolerance: 30 
    },
    
    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'move';
        
        if (Ext.supports.Touch) {
            tool.attach({
                mousedown: Ext.bind(this.moveToolMouseDown, this)
            });
        }
        
        this.getTools().add(tool.name, tool);
    },
    
    moveToolMouseDown: function(e) {
        var hitResult = paper.project.hitTest(e.point, {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: this.getHitTolerance()
        });
        
        if (!hitResult) {
            return;
        }
        
        this.pathClick(e, hitResult.item);
    }

});
