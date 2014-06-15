/**
 * Add/edit location
 */
Ext.define('CB.view.location.Edit', {
    extend: 'Ext.form.Panel',
    
    requires: [
        'Ext.form.field.ComboBox'
    ],
    
    xtype: 'cb-location-edit',
    
    controller: 'cb-location-edit',
    
    viewModel: {
        type: 'cb-location-edit'
    },
    
    session: true,
    
    title: 'Add/edit Location',
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Add/edit Location',
            reference: 'title',
            cls: 'title'
        },{
            xtype: 'button',
            glyph: 'xe628@climbuddy',
            text: 'test'
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
        value: [],
        bind: {
            store: '{locationTypes}',
            value: '{types}'
        }
    },{
        xtype: 'filefield',
        name: 'photos',
        fieldLabel: 'Photos',
        allowBlank: false,
        buttonText: 'Select Photos ...'
    }]
    
});
