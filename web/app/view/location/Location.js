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
        items: [/*{
            xtype: 'cb-spinner'
        },*/{
            xtype: 'tbtext',
            reference: 'title',
            cls: 'title',
            bind: {
                text: '{location.name}'
            }
        }]
    },
    
    items: [{
        xtype: 'cb-paper',
        reference: 'cb-paper'
    }]
    
});
