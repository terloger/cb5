/**
 * User login
 */
Ext.define('CB.view.user.Login', {
    extend: 'Ext.form.Panel',
    
    xtype: 'cb-user-login',
    
    controller: 'cb-user-login',
    
    viewModel: {
        type: 'cb-user-login'
    },
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Sign In',
            cls: 'title'
        }]
    },
    
    bodyPadding: '20 0 0 20',
    
    defaultType: 'textfield',
    defaults: {
        width: 400,
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

    buttons: {
        maxWidth: 400,
        margin: '0 0 0 20',
        items: [{
            formBind: true,
            text: 'Sign In',
            handler: 'login'
        }]
    }
    
});
