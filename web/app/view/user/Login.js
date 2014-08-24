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
    
    cls: 'cb-user-login',

    defaultType: 'textfield',

    defaults: {
        labelWidth: 120,
        listeners: {
            specialkey: 'specialKey'
        }
    },
    
    items: [{
        allowBlank: false,
        fieldLabel: 'Username',
        name: 'username',
        emptyText: 'username'
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
    },{
        xtype: 'displayfield',
        hidden: true,
        bind: {
            value: '{error}',
            hidden: '{!error}'
        },
        fieldStyle: {
            color: 'red'
        }
    }],

    buttons: {
        items: [{
            formBind: true,
            text: 'Sign In',
            handler: 'login'
        }]
    }
    
});
