/**
 * User login controller
 */
Ext.define('CB.view.user.LoginController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-user-login',
    
    login: function(btn, e) {
        var view = this.getView(),
            vm = view.getViewModel(),
            userData = view.getValues(),
            user;

        CB.api.User.login(userData, function(response) {
            if (response.success) {
                user = Ext.create('CB.model.User', response.data);
                vm.getParent().set('user', user);
                view.up('window').close(); // TODO: move to a better place
            } else {
                vm.set('error', response.message);
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
