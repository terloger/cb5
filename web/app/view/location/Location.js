/**
 * Single location view
 */
Ext.define('CB.view.location.Location', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.layout.container.Border',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.DragDrop',
        'Ext.toolbar.Spacer',
        'CB.form.field.MultiFileButton',
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
    
    initComponent: function() {
        // toolbar
        this.tbar = {
            ui: 'header',
            height: 46,
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
            },' ',{
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
                xtype: 'tbtext',
                bind: {
                    hidden: '{!hasFiles}',
                    text: '{fileIndex} of {fileCount}'
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
                    hidden: '{!fileCount}'
                }
            },{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Zoom Out',
                overflowText: 'Zoom Out',
                glyph: 'xe63e@climbuddy',
                handler: 'zoomOut',
                bind: {
                    hidden: '{!fileCount}'
                }
            },{
                xtype: 'tbseparator',
                bind: {
                    hidden: '{!draw}'
                }
            },{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Select Tool',
                overflowText: 'Select Tool',
                glyph: 'xe62a@climbuddy',
                paperTool: 'select',
                handler: 'setPaperTool',
                toggleGroup: 'paper-tools',
                bind: {
                    hidden: '{!draw}'
                }
            },{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Move Tool',
                overflowText: 'Move Tool',
                glyph: 'xe63a@climbuddy',
                paperTool: 'move',
                handler: 'setPaperTool',
                toggleGroup: 'paper-tools',
                pressed: true,
                bind: {
                    hidden: '{!draw}'
                }
            },{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Pen Tool',
                overflowText: 'Pen Tool',
                glyph: 'xe628@climbuddy',
                paperTool: 'pen',
                handler: 'setPaperTool',
                toggleGroup: 'paper-tools',
                bind: {
                    hidden: '{!draw}'
                }
            },{
                xtype: 'tbseparator',
                bind: {
                    hidden: '{!user}'
                }
            },{
                xtype: 'multifilebutton',
                ui: 'blank',
                tooltip: 'Add Photo',
                overflowText: 'Add Photo',
                glyph: 'xe623@climbuddy',
                bind: {
                    hidden: '{!user}'
                },
                listeners: {
                    change: 'saveFiles'
                }
            },{
                xtype: 'tbseparator',
                bind: {
                    hidden: '{!dirty}'
                }
            },{
                xtype: 'button',
                ui: 'default',
                text: 'Save',
                glyph: 'xe647@climbuddy',
                handler: 'saveLocation',
                bind: {
                    hidden: '{!dirty}'
                }
            },'->',{
                xtype: 'button',
                ui: 'blank',
                tooltip: 'Settings',
                overflowText: 'Settings',
                glyph: 'xe60a@climbuddy',
                bind: {
                    hidden: '{!user}'
                }
            }]
        };
        
        // sidebar
        if (Ext.os.deviceType === 'Desktop') {
            this.dockedItems = [{
                xtype: 'panel',
                title: 'Routes',
                itemId: 'sidebar',
                cls: 'cb-location-sidebar',
                width: 300,
                minWidth: 240,
                maxWidth: 600,
                animCollapse: false,
                collapsible: true,
                collapseDirection: 'left',
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
                    cls: 'cb-routes',
                    bind: {
                        store: '{location.routes}'
                    },
                    selModel: {
                        mode: 'SINGLE',
                        allowDeselect: true
                    },
                    tbar: {
                        bind: {
                            hidden: '{!user}'
                        },
                        items: [{
                            xtype: 'button',
                            ui: 'blank',
                            tooltip: 'Add route',
                            glyph: 'xe618@climbuddy',
                            handler: 'addRoute',
                            bind: {
                                hidden: '{!user}'
                            }
                        },{
                            xtype: 'button',
                            ui: 'blank',
                            tooltip: 'Remove selected routes',
                            glyph: 'xe619@climbuddy',
                            handler: 'removeRoute',
                            bind: {
                                hidden: '{!user}'
                            }
                        }]
                    },
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop',
                            dragText: 'Drag and drop to reorganize'
                        }
                    },
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
                    }],
                    listeners: {
                        edit: 'routeDataChanged',
                        itemclick: 'routeSelectionChange',
                        itemmouseenter: 'routeMouseEnter',
                        itemmouseleave: 'routeMouseLeave'
                    }
                },{
                    xtype: 'panel',
                    title: 'Mini Map',
                    region: 'south',
                    itemId: 'miniMap',
                    cls: 'cb-location-map',
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
            }];
        }
        
        // paper
        this.items = [{
            xtype: 'cb-paper',
            cls: 'loading',
            listeners: {
                routeselectionchange: 'paperRouteSelectionChange',
                routemouseenter: 'paperRouteMouseEnter',
                routemouseleave: 'paperRouteMouseLeave'
            }
        }];
        
        // route tip
        if (Ext.os.deviceType !== 'Desktop') {
            this.items.push({
                xtype: 'window',
                itemId: 'routeTip',
                minWidth: 200,
                padding: 20,
                title: 'Route title',
                closeAction: 'hide',
                resizable: false,
                listeners: {
                    close: 'closeRouteTip'
                }
            });
        }
        
        this.callParent();
    },

    showLocation: function(location) {
        this.getViewModel().set('location', location);
    }
    
});
