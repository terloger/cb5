/**
 * User view
 */
Ext.define('CB.view.user.User', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'CB.view.user.Login'
    ],
    
    xtype: 'cb-user',
    
    controller: 'cb-user',
    
    viewModel: {
        type: 'cb-user'
    },
    
    title: 'User',
    cls: 'cb-user',
    
    listeners: {
        hide: 'deactivate',
        scope: 'controller'
    },

    config: {
        user: null
    },

    items: [{
        xtype: 'cb-user-home'
    }]
    
});
