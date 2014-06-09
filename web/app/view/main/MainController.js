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
    
    config: {
        listen: {
            controller: {
                'cb-map': {
                    markerclick: 'onMapMarkerClick'
                }
            }
        }
    },
    
    destroy: function () {
        Ext.destroyMembers(this, 'menu');
        this.callParent();
    },
    
    onTabChange: function (view, tab) {
        if (tab.route) {
            this.redirectTo(tab.route);
        }
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
    
    onMapMarkerClick: function(marker, location, e) {
        this.redirectTo('location/' + location.get('id'));
    },
    
    /**
     * Routes
     */
    
    onHome: function() {
        var tab = this.getView().setActiveTab(this.lookupReference('cb-home'));
        if (tab) {
            this.redirectTo('home');
        }
    },
    
    onMap: function() {
        var tab = this.getView().setActiveTab(this.lookupReference('cb-map'));
        if (tab) {
            this.redirectTo('map');
        }
    },
    
    onUser: function() {
        var tab = this.getView().setActiveTab(this.lookupReference('cb-user'));
        if (tab) {
            this.redirectTo('user');
        }
    },
    
    onLocations: function() {
        var tab = this.getView().setActiveTab(this.lookupReference('cb-locations'));
        if (tab) {
            this.redirectTo('locations');
        }
    },
    
    onLocation: function(id) {
        var view = this.lookupReference('cb-location'),
            viewModel = view.getViewModel(),
            location = this.getStore('Locations').getById(id),
            tab;
    
        if (!location) {
            return;
        }
        
        id = parseInt(id);
        view.getViewModel().setData(location.data);
        
        /*
        viewModel.linkTo('record', {
            reference: 'Location',
            id: id
        });
        */
        
        tab = this.getView().setActiveTab(view);
        if (tab) {
            this.redirectTo('location/' + id);
        }
        
    }
    
});
