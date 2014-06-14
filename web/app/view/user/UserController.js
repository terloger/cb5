/**
 * User view controller
 */
Ext.define('CB.view.user.UserController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-user',
    
    login: function(btn, e) {
        var user = btn.up('form').getValues();
        console.log(user);
        
        CB.api.User.login(user, function(response) {
            if (response.success) {
                this.getView().getViewModel().set('user', Ext.create('CB.model.User', response.data));
            } else {
                console.log(response.message);
            }
        }, this);
    }
    
});
