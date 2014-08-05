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
        'CB.view.location.Header',
        'CB.view.location.Sidebar',
        'CB.view.location.GradePickerField',
        'CB.view.location.TypePicker',
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
        var vm = this.getViewModel();
        
        // header
        this.tbar = {
            xtype: 'cb-location-header',
            height: 46
        };
        
        // sidebar for desktop devices
        if (Ext.os.deviceType === 'Desktop') {
            this.dockedItems = [{
                xtype: 'cb-location-sidebar',
                viewModel: vm,
                width: 400,
                minWidth: 240,
                maxWidth: 600,
                animCollapse: false,
                collapsible: true,
                collapseDirection: 'left',
                resizable: {
                    handles: 'w'
                }
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
        
        // route tip for touch devices
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
        
        // type picker
        this.items.push({
            xtype: 'cb-location-typepicker',
            floating: true,
            hidden: true,
            closable: true,
            closeAction: 'hide',
            width: 460,
            height: 200,
            bodyPadding: 5,
            bind: {
                location: '{location}'
            },
            listeners: {
                selectionchange: 'typeChange'
            }
        });
        
        this.callParent();
    },

    showLocation: function(location) {
        if (location) {
            this.getViewModel().set('location', location);
        }
    }
    
});
