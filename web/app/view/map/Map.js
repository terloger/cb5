/**
 * Map view
 */
Ext.define('CB.view.map.Map', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.util.MixedCollection',
        'Ext.form.field.Text'
    ],
    
    xtype: 'cb-map',
    
    controller: 'cb-map',
    
    viewModel: {
        type: 'cb-map'
    },
    
    layout: {
        type: 'fit'
    },
    
    title: 'Map',
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Search locations: ',
            cls: 'title',
            margin: '0 5 0 0'
        },{
            xtype: 'textfield',
            name: 'search',
            margin: '0 0 0 0'
        },{
            xtype: 'button',
            handler: 'onSearch',
            glyph: 'xe63d@climbuddy',
            style: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
            }
        },{
            xtype: 'button',
            text: 'Filter',
            glyph: 'xe646@climbuddy',
            menu: [],
            listeners: {
                click: {
                    fn: 'createFilterMenu',
                    single: true
                }
            }
        }]
    },
    
    listeners: {
        afterrender: 'onAfterRender',
        resize: 'onResize',
        scope: 'controller'
    }
    
});
