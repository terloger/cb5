/**
 * Main view controller
 */
Ext.define('CB.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-main',
    
    routes: {
        'home': 'onHome',
        'map': 'onMap',
        'user': 'onUser',
        'locations': 'onLocations',
        'location/:id': 'onLocation'
    },
    
    destroy: function () {
        Ext.destroyMembers(this, 'menu');
        this.callParent();
    },
    
    onMenuClick: function (e) {
        var menu = this.menu;

        if (!menu) {
            menu = this.getView().navigationMenu;
            this.menu = menu = Ext.create('Ext.menu.Menu', menu);
        }

        menu.showAt(e.getXY());
    },
    
    onMenuItemClick: function (menu, item) {
        this.getView().setActiveTab(menu.items.indexOf(item) + 1); // +1 for invisible first tab
    },
    
    onTabChange: function (view, tab) {
        this.redirectTo(tab.route);
    },
    
    onHome: function() {
        this.getView().setActiveItem(this.lookupReference('cb-home'));
    },
    
    onMap: function() {
        this.getView().setActiveItem(this.lookupReference('cb-map'));
    },
    
    onUser: function() {
        this.getView().setActiveItem(this.lookupReference('cb-user'));
    },
    
    onLocations: function() {
        this.getView().setActiveItem(this.lookupReference('cb-locations'));
    },
    
    onLocation: function(id) {
        this.getView().setActiveItem(this.lookupReference('cb-location'));
    }
    
});
