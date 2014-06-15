/**
 * User login view model
 */
Ext.define('CB.view.user.LoginModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-user-login',
    
    data: {
        error: null,
        loading: false
    }
    
});
