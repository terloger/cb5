/**
 * Location view model
 */
Ext.define('CB.view.location.LocationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cb-location',
    
    config: {
        session: Ext.create('Ext.data.Session')
    }
    
});
