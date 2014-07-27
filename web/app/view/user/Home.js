/**
 * User home
 */
Ext.define('CB.view.user.Home', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-user-home',
    
    controller: 'cb-user-home',
    
    viewModel: {
        type: 'cb-user-home'
    },
    
    cls: 'cb-user-home',
    
    tbar: {
        ui: 'header',
        height: 46,
        items: [{
            xtype: 'tbtext',
            text: 'Wellcome',
            cls: 'title',
            bind: {
                text: 'Wellcome {user.username}'
            }
        },'->',{
            xtype: 'button',
            text: 'Sign Out',
            glyph: 'xe60b@climbuddy',
            handler: 'logoutClick'
        }]
    },
    
    items: [{
        xtype: 'panel',
        bodyPadding: 20,
        setHtml: function(user) {
            var data = JSON.stringify(JSON.parse(Ext.encode(user.data)),null,2);
            this.update('<pre>' + data + '</pre>');
        },
        bind: {
            html: '{user}'
        }
    }]
    
});
