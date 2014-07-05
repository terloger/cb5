/**
 * Climbuddy paperjs tools
 */
Ext.define('CB.paper.Tools', {
    requires: [
        'Ext.util.MixedCollection'
    ],
    
    mixins: {
        move: 'CB.paper.tool.Move',
        pen: 'CB.paper.tool.Pen',
        select: 'CB.paper.tool.Select'
    },
    
    config: {
        tools: null,
        activeTool: null
    },
    
    constructor: function(config) {
        console.log('construct tools');
        // create tools collection
        this.setTools(Ext.create('Ext.util.MixedCollection'));
        
        // register tools
        var tools = config && config.tools && config.tools.length ? config.tools : null;
        if (tools) {
            for (var i = 0, len = tools.length; i < len; i++) {
                var tool = tools[i];
                if (this.mixins[tool]) {
                    this.mixins[tool].constructor.call(this);
                    if (i === 0) {
                        this.setActiveTool(tool);
                    }
                }
            }
        }
    },
    
    applyActiveTool: function(name) {
        console.log('applyActiveTool', name);
        var tool = this.getTools().getByKey(name);
        
        if (!tool || tool === this.getActiveTool()) {
            console.log('not tool');
            return;
        }
        
        console.log('activate tool', tool.name);
        
        tool.activate();
        
        this.fireEvent('toolchange', name, tool);
        
        return tool;
    }

});
