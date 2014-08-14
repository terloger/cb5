/**
 * User login controller
 */
Ext.define('CB.view.user.LoginController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-user-login',
    
    login: function(btn, e) {
        var loginView = this.getView(),
            loginViewModel = loginView.getViewModel(),
            userView = loginView.up('cb-user'),
            mainViewModel = userView.getViewModel().getParent(),
            userData = loginView.getValues(),
            user;
    
        loginViewModel.set('loading', true);
    
        CB.api.User.login(userData, function(response) {
            loginViewModel.set('loading', false);
            if (response.success) {
                user = Ext.create('CB.model.User', response.data);
                mainViewModel.set('user', user);
                userView.showHome();
            } else {
                loginViewModel.set('error', response.message);
            }
        }, this);
    },

    specialKey: function(field, e){
        // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
        // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
        if (e.getKey() == e.ENTER) {
            this.login();
        }
    }
    
});
