/**
 * Single location view
 */
Ext.define('CB.view.location.Location', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.layout.container.Border',
        'Ext.grid.plugin.CellEditing',
        'CB.paper.Panel'
    ],
    
    xtype: 'cb-location',
    
    controller: 'cb-location',
    
    viewModel: {
        type: 'cb-location'
    },
    
    title: 'Location',
    cls: 'cb-location',
    bodyCls: 'cb-location-body',
    
    layout: {
        type: 'fit'
    },
    
    bodyStyle: {
        overflow: 'visible'
    },
    
    listeners: {
        hide: 'hideLocation',
        scope: 'controller'
    },
    
    tbar: {
        ui: 'header',
        height: 72,
        layout: {
            overflowHandler: 'menu'
        },
        defaults: {
            hidden: true,
            bind: {
                hidden: '{!location}'
            }
        },
        items: [{
            xtype: 'tbtext',
            cls: 'title',
            bind: {
                hidden: '{!location}',
                text: '{location.name}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Add Photo',
            overflowText: 'Add Photo',
            glyph: 'xe623@climbuddy',
            bind: {
                hidden: '{!hasUser}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!hasUser}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Previous Photo',
            overflowText: 'Previous Photo',
            glyph: 'xe61b@climbuddy',
            handler: 'prevFile',
            bind: {
                hidden: '{!hasFiles}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Next Photo',
            overflowText: 'Next Photo',
            glyph: 'xe61c@climbuddy',
            handler: 'nextFile',
            bind: {
                hidden: '{!hasFiles}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!hasFiles}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom In',
            overflowText: 'Zoom In',
            glyph: 'xe63f@climbuddy',
            handler: 'zoomIn',
            bind: {
                hidden: '{!hasLocation}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom Out',
            overflowText: 'Zoom Out',
            glyph: 'xe63e@climbuddy',
            handler: 'zoomOut',
            bind: {
                hidden: '{!hasLocation}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!hasLocation}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Select Tool',
            overflowText: 'Select Tool',
            glyph: 'xe62a@climbuddy',
            paperTool: 'select',
            handler: 'setTool',
            toggleGroup: 'paper-tools',
            bind: {
                hidden: '{!editMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Move Tool',
            overflowText: 'Move Tool',
            glyph: 'xe63a@climbuddy',
            paperTool: 'move',
            handler: 'setTool',
            toggleGroup: 'paper-tools',
            pressed: true,
            bind: {
                hidden: '{!editMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Pen Tool',
            overflowText: 'Pen Tool',
            glyph: 'xe628@climbuddy',
            paperTool: 'pen',
            handler: 'setTool',
            toggleGroup: 'paper-tools',
            bind: {
                hidden: '{!editMode}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!editMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Print',
            overflowText: 'Print',
            glyph: 'xe62e@climbuddy',
            bind: {
                hidden: '{!hasLocation}'
            }
        },'->',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Settings',
            overflowText: 'Settings',
            glyph: 'xe60a@climbuddy',
            bind: {
                hidden: '{!hasUser}'
            }
        }]
    },
    
    dockedItems: [{
        xtype: 'panel',
        title: 'Routes',
        itemId: 'sidebar',
        cls: 'cb-location-sidebar',
        width: 300,
        minWidth: 200,
        maxWidth: 500,
        animCollapse: false,
        collapsible: true,
        collapseDirection: 'right',
        stateful: true,
        stateId: 'CB.view.location.Sidebar',
        resizable: {
            handles: 'w'
        },
        plugins: 'responsive',
        responsiveConfig: {
            'tall': {
                dock: 'bottom',
                height: 200
            },
            'wide': {
                dock: 'right',
                height: 'auto'
            }
        },
        layout: {
            type: 'border'
        },
        items: [{
            xtype: 'gridpanel',
            region: 'center',
            itemId: 'routes',
            reference: 'routes',
            bind: {
                store: '{location.routes}'
            },
            tbar: {
                bind: {
                    hidden: '{!hasUser}'
                },
                items: [{
                    xtype: 'button',
                    ui: 'blank',
                    tooltip: 'Add route',
                    glyph: 'xe618@climbuddy',
                    handler: 'addRoute',
                    bind: {
                        hidden: '{!hasUser}'
                    }
                },{
                    xtype: 'button',
                    ui: 'blank',
                    tooltip: 'Remove selected routes',
                    glyph: 'xe617@climbuddy',
                    handler: 'removeRoute',
                    bind: {
                        hidden: '{!hasUser}'
                    }
                }]
            },
            selType: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                pluginId: 'cellediting',
                clicksToEdit: 2
            },
            columns: [{
                text: 'Name',
                dataIndex: 'name',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }]
        },{
            xtype: 'panel',
            title: 'Mini Map',
            region: 'south',
            itemId: 'miniMap',
            height: 200,
            minHeight: 160,
            maxHeight: 360,
            split: true,
            collapsible: true,
            stateful: true,
            stateId: 'CB.view.location.MiniMap',
            layout: {
                type: 'fit'
            },
            listeners: {
                resize: 'resizeMiniMap'
            }
        }]
    }],
    
    items: [{
        xtype: 'cb-paper'
    }]
    
});
