/**
 * User home controller
 */
Ext.define('CB.view.user.HomeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-user-home',
    
    onLogoutClick: function() {
        var homeView = this.getView(),
            homeViewModel = homeView.getViewModel(),
            userView = homeView.up('cb-user'),
            mainViewModel = userView.getViewModel().getParent();
        
        homeViewModel.set('loading', true);
    
        CB.api.User.logout(function(response) {
            homeViewModel.set('loading', false);
            if (response.success) {
                mainViewModel.set('user', null);
                userView.showLogin();
            } else {
                Ext.Msg.alert('Server Error', response.message);
            }
        }, this);
    }
    
});
