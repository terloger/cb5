/**
 * User view controller
 */
Ext.define('CB.view.user.UserController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-user',
    
    deactivate: function() {
        var loginView = this.getView().down('cb-user-login');
        if (loginView) {
            loginView.reset();
        }
    }
    
});
