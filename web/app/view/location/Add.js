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
        'CB.form.field.MultiFileButton'
    ],
    
    xtype: 'cb-location-add',
    
    controller: 'cb-location-add',
    
    viewModel: {
        type: 'cb-location-add'
    },
    
    title: 'Add location',
    bodyPadding: 20,
    autoScroll: true,
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Add location',
            bind: {
                text: 'Add location {location.name}'
            },
            cls: 'title'
        }]
    },
    
    fieldDefaults: {
        anchor: '100%'
    },
    
    items: [{
        xtype: 'panel',
        title: 'Information',
        layout: 'anchor',
        frame: true,
        autoScroll: true,
        bodyPadding: '20 20 10 20',
        margin: '0 0 20 0',
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
        xtype: 'panel',
        title: 'Photos',
        frame: true,
        items: [{
            xtype: 'grid',
            autoScroll: true,
            tbar: {
                items: [{
                    xtype: 'multifilebutton',
                    ui: 'default-toolbar',
                    name: 'photos',
                    text: 'Select Photos ...',
                    buttonOnly: true,
                    allowBlank: false,
                    listeners: {
                        change: 'addFiles'
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
            bind: {
                store: '{files}'
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
        handler: 'saveLocation'
    }]
    
});
