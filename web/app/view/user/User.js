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
    
    title: 'User',
    
    tbar: {
        ui: 'header',
        height: 72,
        items: [{
            xtype: 'tbtext',
            text: 'Sign In',
            cls: 'title'
        }]
    },
    
    bodyPadding: 20,
    
    items: [{
        xtype: 'form',
        frame: true,
        width: 370,
        bodyPadding: 20,
        defaultType: 'textfield',
        defaults: {
            labelWidth: 120
        },
        items: [{
            allowBlank: false,
            fieldLabel: 'User ID',
            name: 'user',
            emptyText: 'user id'
        }, {
            allowBlank: false,
            fieldLabel: 'Password',
            name: 'pass',
            emptyText: 'password',
            inputType: 'password'
        }, {
            xtype:'checkbox',
            fieldLabel: 'Remember me',
            name: 'remember'
        }],
        buttons: [{
            text:'Sign In'
        }]
    }]
    
});
