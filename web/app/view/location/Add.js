/**
 * Add location
 */
Ext.define('CB.view.location.Add', {
    extend: 'Ext.form.Panel',
    
    requires: [
        'Ext.layout.container.Auto',
        'Ext.layout.container.Column',
        'Ext.form.field.ComboBox',
        'Ext.form.field.File',
        'CB.form.field.MultiFileButton',
        'CB.view.location.TypePicker'
    ],
    
    xtype: 'cb-location-add',
    
    controller: 'cb-location-add',
    
    viewModel: {
        type: 'cb-location-add'
    },
    
    title: 'Add location',
    cls: 'cb-location-add',
    autoScroll: true,
    bodyPadding: 10,
    
    listeners: {
        hide: 'hideView',
        scope: 'controller'
    },
    
    tbar: {
        ui: 'header',
        height: 46,
        items: [{
            xtype: 'tbtext',
            text: 'Add location',
            bind: {
                text: 'Add location {location.name}'
            },
            cls: 'title'
        }]
    },
    
    defaults: {
        minWidth: 300,
        maxWidth: 600,
        margin: 10,
        style: {
            'float': 'left'
        }
    },

    fieldDefaults: {
        anchor: '100%'
    },
    
    items: [{
        xtype: 'panel',
        title: 'Information',
        layout: 'anchor',
        frame: true,
        bodyPadding: 20,
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Name',
            bind: '{location.name}',
            allowBlank: false
        },{
            xtype: 'combobox',
            name: 'types',
            fieldLabel: 'Type',
            displayField: 'name',
            valueField: 'id',
            queryMode: 'local',
            multiSelect: true,
            allowBlank: false,
            editable: false,
            value: [],
            bind: {
                store: '{locationTypes}',
                value: '{types}'
            },
            listeners: {
                select: 'setTypes'
            }
        },{
            xtype: 'textarea',
            name: 'description',
            fieldLabel: 'Description',
            bind: '{location.description}'
        },{
            xtype: 'displayfield',
            name: 'country',
            fieldLabel: 'Country',
            bind: '{location.country.name}'
        },{
            xtype: 'displayfield',
            name: 'lat',
            fieldLabel: 'Latitude',
            bind: '{location.lat}'
        },{
            xtype: 'displayfield',
            name: 'lng',
            fieldLabel: 'Longitude',
            bind: '{location.lng}'
        }]
    },{
        xtype: 'cb-location-typepicker',
        title: 'Choose types',
        frame: true,
        bind: {
            location: '{location}'
        }
    },{
        xtype: 'panel',
        title: 'Photos',
        frame: true,
        items: [{
            xtype: 'grid',
            autoScroll: true,
            minHeight: 166,
            emptyText: '<div style="padding:20px;text-align:center;font-size:22px;color:#ccc;">Drop files here ...</div>',
            bind: {
                store: '{files}'
            },
            tbar: {
                items: [{
                    xtype: 'multifilebutton',
                    itemId: 'multifilebutton',
                    ui: 'default-toolbar',
                    name: 'photos',
                    text: 'Select Photos ...',
                    buttonOnly: true,
                    allowBlank: false,
                    //glyph: 'xe623@climbuddy',
                    listeners: {
                        change: 'setFiles'
                    }
                },{
                    xtype: 'button',
                    text: 'Clear',
                    handler: 'clearFiles',
                    hidden: true,
                    bind: {
                        hidden: '{!fileCount}'
                    }
                },{
                    xtype: 'tbtext',
                    hidden: true,
                    bind: {
                        text: '{fileCount} files selected',
                        hidden: '{!fileCount}'
                    }
                }]
            },
            columns: [{
                text: 'Name',
                dataIndex: 'name',
                flex: 2
            },{
                text: 'Type',
                dataIndex: 'type',
                flex: 1
            },{
                text: 'Size',
                dataIndex: 'size',
                flex: 1,
                renderer: function(value) {
                    return Math.round(value / 1024) + ' KB';
                }
            }]
        }]
    }],

    buttons: [{
        text: 'Save',
        formBind: true,
        handler: 'save'
    },{
        text: 'Close',
        handler: 'close'
    }]
    
});
