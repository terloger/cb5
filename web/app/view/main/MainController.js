/**
 * Main view controller
 */
Ext.define('CB.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-main',
    
    config: {
        routes: {
            'home': 'onHome',
            'map': 'onMap',
            'user': 'onUser',
            'locations': 'onLocations',
            'location/:id': 'onLocation'
        },
        listen: {
            controller: {
                '#' : {
                    unmatchedroute : 'onUnmatchedRoute'
                },
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
    
    onCollapseClick: function() {
        var header = this.getView().getHeader(),
            el = header.getEl();
    
        if (header.isCollapsed) {
            header.isCollapsed = false;
            header.setWidth(198);
            header.removeCls('collapsed');
        } else {
            header.isCollapsed = true;
            header.originalWidth = header.getWidth();
            header.setWidth(68);
            header.addCls('collapsed');
        }
        
        this.getView().saveState();
    },
    
    /**
     * Routes
     */
    
    onUnmatchedRoute : function(hash) {
        var view = this.getView(),
            tab, header, title;
        
        view.setActiveTab(0);
        tab = view.getActiveTab();
        header = tab.down('toolbar[ui=header]');
        title = header.down('tbtext[cls=title]');
        title.setText('Unable to find #' + hash);
    },
    
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
        var mainView = this.getView(),
            locationView = this.lookupReference('cb-location'),
            locationViewModel = locationView.getViewModel(),
            locationViewCtrl = locationView.getController(),
            store = this.getStore('locations'),
            storeLoaded = store.isLoaded(),
            showLocation = function() {
                var location = store.getById(id);
                if (location) {
                    locationViewModel.bind({bindTo: '{location}', single: true}, function(location){
                        locationViewCtrl.showLocation(location);
                        if (storeLoaded && mainView.setActiveTab(locationView)) {
                            this.redirectTo('location/' + id);
                        }
                    }, this);
                    locationViewModel.linkTo('location', location);
                } else {
                    locationViewModel.set('location.name', 'Oooops, location #' + id + ' does not exist.');
                }
            };
    
        if (storeLoaded) {
            showLocation.apply(this);
        } else {
            store.on({
                load: {
                    fn: showLocation,
                    single: true,
                    scope: this
                }
            });
            
            if (mainView.setActiveTab(locationView)) {
                this.redirectTo('location/' + id);
            }
        }
        
        
    }
    
});
