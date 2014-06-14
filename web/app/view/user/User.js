/**
 * User view
 */
Ext.define('CB.view.user.User', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Checkbox'
    ],
    
    xtype: 'cb-user',
    
    controller: 'cb-user',
    
    title: 'Sign In',
    
    bind: {
        title: '{user.username}'
    },
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Sign In',
            bind: {
                text: 'Wellcome {user.username}'
            },
            cls: 'title'
        }]
    },
    
    bodyPadding: 20,
    
    items: [{
        xtype: 'form',
        frame: true,
        width: 400,
        bodyPadding: 20,
        defaultType: 'textfield',
        defaults: {
            labelWidth: 120
        },
        items: [{
            allowBlank: false,
            fieldLabel: 'User ID',
            name: 'username',
            emptyText: 'user id'
        }, {
            allowBlank: false,
            fieldLabel: 'Password',
            name: 'password',
            emptyText: 'password',
            inputType: 'password'
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Remember me',
            name: 'autologin'
        }],
        buttons: [{
            formBind: true,
            text: 'Sign In',
            handler: 'login'
        }]
    }]
    
});
