/**
 * Single location view
 */
Ext.define('CB.view.location.Location', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-location',
    
    controller: 'cb-location',
    
    viewModel: {
        type: 'cb-location'
    },
    
    session: {},
    
    layout: {
        type: 'fit'
    },
    
    title: 'Location',
    
    tbar: {
        ui: 'header',
        plugins: 'responsive',
        responsiveConfig: {
            tall: {
                height: 66
            },
            wide: {
                height: 96
            }
        },
        items: [{
            xtype: 'tbtext',
            reference: 'title',
            cls: 'title',
            bind: {
                text: '{location.name}'
            }
        }]
    },
    
    items: []
    
});
