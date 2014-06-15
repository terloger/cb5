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
    
    tbar: {
        ui: 'header',
        height: 72,
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
            glyph: 'xe60b@climbuddy'
        }]
    },
    
    items: [{
        xtype: 'panel',
        bodyPadding: 20,
        html: 'User page'
    }]
    
});
