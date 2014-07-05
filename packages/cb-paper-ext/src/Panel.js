/**
 * Climbuddy ExtJS paper panel
 */
Ext.define('CB.paper.Panel', {
    extend: 'Ext.container.Container',
    
    xtype : 'cb-paper',
    
    controller: 'cb-paper',

    viewModel: {
        type: 'cb-paper'
    },
    
    listeners: {
        afterrender: 'initPaper',
        resize: 'resizePaper',
        scope: 'controller'
    },
    
    html: [
        '<div id="cb-paper" class="cb-paper">',
            '<canvas id="cb-canvas" class="cb-canvas"></canvas>',
        '</div>'
    ].join('')
    
}); 