/**
 * Single location view
 */
Ext.define('CB.view.location.Location', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'CB.paper.Panel',
        'CB.view.Spinner'
    ],
    
    xtype: 'cb-location',
    
    controller: 'cb-location',
    
    viewModel: {
        type: 'cb-location'
    },
    
    session: true,
    
    title: 'Location',
    
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
            reference: 'title',
            cls: 'title',
            bind: {
                hidden: '{!location}',
                text: '{location.name}'
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
            tooltip: 'Add Photo',
            overflowText: 'Add Photo',
            glyph: 'xe623@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Select Tool',
            overflowText: 'Select Tool',
            glyph: 'xe62a@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Move Tool',
            overflowText: 'Move Tool',
            glyph: 'xe63a@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Pen Tool',
            overflowText: 'Pen Tool',
            glyph: 'xe628@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Lock',
            overflowText: 'Lock',
            glyph: 'xe630@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Unlock',
            overflowText: 'Unlock',
            glyph: 'xe631@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!isEditMode}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom In',
            overflowText: 'Zoom In',
            glyph: 'xe63f@climbuddy',
            bind: {
                hidden: '{!isLocation}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom Out',
            overflowText: 'Zoom Out',
            glyph: 'xe63e@climbuddy',
            bind: {
                hidden: '{!isLocation}'
            }
        },{
            xtype: 'tbseparator',
            bind: {
                hidden: '{!isLocation}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Print',
            overflowText: 'Print',
            glyph: 'xe62e@climbuddy',
            bind: {
                hidden: '{!isLocation}'
            }
        },'->',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Settings',
            overflowText: 'Settings',
            glyph: 'xe60a@climbuddy',
            bind: {
                hidden: '{!isEditMode}'
            }
        }]
    },
    
    items: [{
        xtype: 'cb-paper',
        reference: 'cb-paper'
    }]
    
});
