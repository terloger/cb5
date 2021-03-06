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
            text: 'Login required',
            cls: 'title',
            bind: {
                user: '{user}'
            },
            setUser: function(user) {
                if (user instanceof CB.model.User) {
                    this.setText('Wellcome ' + user.get('username'));
                } else {
                    this.setText('Login required');
                }
            },
            plugins: 'responsive',
            responsiveConfig: {
                'width < 500': {
                    width: 140
                },
                'width >= 500': {
                    width: 240
                }
            }
        },'->',{
            xtype: 'cb-user-headerbutton'
        }]
    },
    
    items: [{
        xtype: 'panel',
        bodyPadding: '0 20',
        html: [
            '<p>Registration will be available in the future ;)</p>',
            '<p>If you wish to participate in beta testing, write an email to <a href="mailto:climbuddy@gmail.com">climbuddy@gmail.com</a>.</p>'
        ].join(''),
        bind: {
            user: '{user}'
        },
        setUser: function(user) {
            var html;

            if (user instanceof CB.model.User) {
                html = [
                    '<pre>' + JSON.stringify(JSON.parse(Ext.encode(user.data)),null,2) + '</pre>'
                ];
            } else {
                html = [
                    '<p>The registration process has not been implemented yet.</p>',
                    '<p>If you really wish to participate, write us at <a href="mailto:climbuddy@gmail.com">climbuddy@gmail.com</a></p>'
                ];
            }

            this.update(html.join(''));

        }
    }]
    
});
