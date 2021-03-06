/**
 * Climbuddy paperjs tools mixin
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
        
        // provide functions for the view
        this.getView().setActiveTool = Ext.bind(this.setActiveTool, this);
    },
    
    applyActiveTool: function(name) {
        var tool = this.getTools().getByKey(name);

        if (!tool || tool === this.getActiveTool()) {
            return;
        }
        
        tool.activate();

        this.getPaper().removeCls([
            'tool-move',
            'tool-pen',
            'tool-select'
        ]);

        this.getPaper().addCls('tool-' + name);
        
        this.fireEvent('toolchange', name, tool);
        
        return tool;
    }

});
