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
    
    bind: {
        title: '{user.username}'
    },
    
    listeners: {
        hide: 'deactivate',
        scope: 'controller'
    },

    config: {
        user: null
    },
    
    initComponent: function() {
        this.callParent();

        this.getViewModel().bind('{user}', function(){
            console.log('bind user', arguments);
        });

        /*
        if (!CB.init.User) {
            this.showLogin();
        } else {
            this.showHome();
        }
        */
    },
    
    showLogin: function() {
        this.removeAll();

        this.add({
            xtype: 'cb-user-login',
            tbar: {
                ui: 'header',
                height: 46,
                items: [{
                    xtype: 'tbtext',
                    text: 'Sign In',
                    cls: 'title'
                }]
            },
            cls: 'cb-user-login',
            bodyPadding: '20 0 0 20',
            defaultType: 'textfield',
            defaults: {
                width: 400,
                labelWidth: 120
            },
            buttons: {
                maxWidth: 400,
                margin: '0 0 0 20'
            }
        });
    },
    
    showHome: function() {
        this.removeAll();
        this.add({
            xtype: 'cb-user-home'
        });
    }
    
});
