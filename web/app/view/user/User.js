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
    
    listeners: {
        hide: 'deactivate',
        scope: 'controller'
    },
    
    initComponent: function() {
        this.callParent();
        
        if (!CB.init.User) {
            this.showLogin();
        } else {
            this.showHome();
        }
    },
    
    showLogin: function() {
        this.removeAll();
        this.add({
            xtype: 'cb-user-login'
        });
    },
    
    showHome: function() {
        this.removeAll();
        this.add({
            xtype: 'cb-user-home'
        });
    }
    
});
