/**
 * User view
 */
Ext.define('CB.view.user.HeaderButton', {
    extend: 'Ext.button.Button',
    
    xtype: 'cb-user-headerbutton',

    ui: 'blank',

    text: 'Login',
    overflowText: 'Login',

    glyph: 'xe60f@climbuddy',

    hidden: false,

    bind: {
        user: '{user}'
    },

    handler: function(btn, e) {
        this.fireEvent('headeruserbuttonclick', btn, e);
    },

    setUser: function(user) {
        if (user instanceof CB.model.User) {
            this.setText(user.get('username'))
        } else {
            this.setText('Login');
        }
    }

});
