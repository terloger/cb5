Ext.define('CB.paper.tool.Hand', {
    
    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'hand';
        
        tool.onMouseDown = Ext.bind(function(e) {
            
            /*
            if (e.event.button === 2 || e.event.shiftKey || e.event.ctrlKey || e.event.altKey) return;
            
            this.moving = true;
            this.movingEventX = e.event.x || e.event.clientX;
            this.movingEventY = e.event.y || e.event.clientY;
            this.movingElementX = this.getCanvas().getX();
            this.movingElementY = this.getCanvas().getY();
            */
        }, this);

        tool.onMouseDrag = Ext.bind(function(e) {
            //console.log(e.delta, e.point);
            
            return;
            this.getImage().setX(this.getImage().getX() + e.delta.x);
            this.getImage().setY(this.getImage().getY() + e.delta.y);

            this.getCanvas().setX(this.getCanvas().getX() + e.delta.x);
            this.getCanvas().setY(this.getCanvas().getY() + e.delta.y);
            
            /*
            if (e.event.button === 2 || e.event.shiftKey || e.event.ctrlKey || e.event.altKey) return;
            
            if (this.moving) {
                var xy = [
                    this.movingElementX + ((e.event.x || e.event.clientX) - this.movingEventX),
                    this.movingElementY + ((e.event.y || e.event.clientY) - this.movingEventY)
                ];
                this.getImage().setXY(xy);
                this.getCanvas().setXY(xy);
            }
            */
        }, this);

        tool.onMouseUp = Ext.bind(function(e) {
            /*
            if (e.event.button === 2 || e.event.shiftKey || e.event.ctrlKey || e.event.altKey) return;
            
            this.moving = false;
            this.movingEventX = null;
            this.movingEventY = null;
            this.movingElementX = null;
            this.movingElementY = null;
            */
        }, this);

        this.getTools().add(tool.name, tool);
    }

});
