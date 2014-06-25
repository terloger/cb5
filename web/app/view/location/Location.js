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
    
    layout: {
        type: 'fit'
    },
    
    title: 'Location',
    
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
            hidden: true,
            bind: {
                hidden: '{!location}',
                text: '{location.name}'
            }
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Previous Photo',
            overflowText: 'Previous Photo',
            glyph: 'xe61b@climbuddy'
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Next Photo',
            overflowText: 'Next Photo',
            glyph: 'xe61c@climbuddy'
        },'-',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Add Photo',
            overflowText: 'Add Photo',
            glyph: 'xe623@climbuddy'
        },'-',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Select Tool',
            overflowText: 'Select Tool',
            glyph: 'xe62a@climbuddy'
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Move Tool',
            overflowText: 'Move Tool',
            glyph: 'xe63a@climbuddy'
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Pen Tool',
            overflowText: 'Pen Tool',
            glyph: 'xe628@climbuddy'
        },'-',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Lock',
            overflowText: 'Lock',
            glyph: 'xe630@climbuddy'
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Unlock',
            overflowText: 'Unlock',
            glyph: 'xe631@climbuddy'
        },'-',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom Out',
            overflowText: 'Zoom Out',
            glyph: 'xe63e@climbuddy'
        },{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Zoom In',
            overflowText: 'Zoom In',
            glyph: 'xe63f@climbuddy'
        },'-',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Print',
            overflowText: 'Print',
            glyph: 'xe62e@climbuddy'
        },'->',{
            xtype: 'button',
            ui: 'blank',
            tooltip: 'Settings',
            overflowText: 'Settings',
            glyph: 'xe60a@climbuddy'
        }]
    },
    
    items: [{
        xtype: 'cb-paper',
        reference: 'cb-paper'
    }]
    
});
