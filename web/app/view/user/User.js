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
    
    bind: {
        title: '{user.username}'
    },
    
    initComponent: function() {
        this.callParent();
        
        if (!CB.init.User) {
            this.add({
                xtype: 'cb-user-login'
            });
        } else {
            this.add({
                xtype: 'cb-user-home'
            });
        }
    }
    
});
