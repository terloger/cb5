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
            xtype: 'cb-user-headerbutton'
        }]
    },
    
    items: [{
        xtype: 'panel',
        bodyPadding: 20,
        bind: {
            html: '{user}'
        },
        setHtml: function(user) {
            if (user instanceof CB.model.User) {
                var data = JSON.stringify(JSON.parse(Ext.encode(user.data)),null,2);
                this.update('<pre>' + data + '</pre>');
            } else {
                this.update('');
            }

        }
    }]
    
});
