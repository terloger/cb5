/**
 * Climbuddy paperjs tools
 */
Ext.define('CB.paper.Tools', {
    requires: [
        'Ext.util.MixedCollection'
    ],
    
    mixins: {
        hand: 'CB.paper.tool.Hand',
        move: 'CB.paper.tool.Move',
        pen: 'CB.paper.tool.Pen'
    },
    
    config: {
        activeTool: null,
        tools: null
    },
    
    constructor: function(config) {
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
        var tool = this.getTools().getByKey(name);
        if (!tool || tool === this.getActiveTool()) return;
        
        tool.activate();
        
        return tool;
    }

});
