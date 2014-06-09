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
        plugins: 'responsive',
        responsiveConfig: {
            tall: {
                height: 66
            },
            wide: {
                height: 96
            }
        },
        items: ['->',{
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
        },{
            xtype: 'textfield',
            name: 'search'
        },{
            xtype: 'button',
            handler: 'onSearch',
            glyph: 'xe63d@climbuddy'
        }]
    },
    
    listeners: {
        afterrender: 'onAfterRender',
        resize: 'onResize',
        scope: 'controller'
    }
    
});
