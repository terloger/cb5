/**
 * Add location
 */
Ext.define('CB.view.location.Add', {
    extend: 'Ext.form.Panel',
    
    xtype: 'cb-location-add',
    
    controller: 'cb-location-add',
    
    viewModel: {
        type: 'cb-location-add'
    },
    
    session: true,
    
    title: 'Add Location',
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Add Location',
            reference: 'title',
            cls: 'title'
        }]
    },
    
    items: [{
        xtype: 'textfield',
        name: 'name'
    }]
    
});
