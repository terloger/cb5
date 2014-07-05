Ext.define('CB.paper.tool.Move', {
    
    constructor: function() {
        var tool = new paper.Tool();

        tool.name = 'move';
        
        this.getTools().add(tool.name, tool);
    }

});
