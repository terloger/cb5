/**
 * Add location
 */
Ext.define('CB.view.location.Add', {
    extend: 'Ext.form.Panel',
    
    requires: [
        'Ext.form.field.ComboBox'
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
    
    defaults: {
        width: 600,
        labelWidth: 80
    },
    
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
        xtype: 'fieldcontainer',
        fieldLabel: 'Photos',
        items: [{
            xtype: 'grid',
            frame: true,
            height: 285,
            disableSelection: true,
            tbar: {
                items: [{
                    xtype: 'filebutton',
                    ui: 'default',
                    name: 'photos',
                    buttonOnly: true,
                    allowBlank: false,
                    text: 'Select Photos ...',
                    listeners: {
                        change: 'addFiles'
                    },
                    afterTpl: '<input id="{id}-fileInputEl" data-ref="fileInputEl" class="{childElCls} {inputCls}" ' +
                              'type="file" size="1" name="{inputName}" role="{role}" tabIndex="{tabIndex}" multiple="1">',
                    createFileInput: function(isTemporary) {
                        var me = this;
                        me.fileInputEl = me.el.createChild({
                            name: me.inputName,
                            id: !isTemporary ? me.id + '-fileInputEl' : undefined,
                            cls: me.inputCls,
                            tag: 'input',
                            type: 'file',
                            size: 1,
                            role: 'button',
                            multiple: 1
                        });
                        me.fileInputEl.on('change', me.fireChange, me);  
                    }
                },{
                    xtype: 'button',
                    text: 'Clear',
                    handler: 'clearFiles',
                    visible: false,
                    bind: {
                        visible: '{fileCount}'
                    }
                },{
                    xtype: 'tbtext',
                    visible: false,
                    bind: {
                        text: '{fileCount} files selected',
                        visible: '{fileCount}'
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
