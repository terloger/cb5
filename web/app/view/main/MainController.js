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
        'location/add': 'onLocationEdit',
        'location/edit/:id': {
            action: 'onLocationEdit',
            conditions: {
                ':id': '([0-9]+)'
            }
        },
        'location/:id': {
            action: 'onLocation',
            conditions: {
                ':id': '([0-9]+)'
            }
        }
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
    },
    
    /**
     * Core
     */
    
    init: function() {
        // initialize config
        CB.Config.init(CB.init.Config);

        // initialize user
        if (CB.init.User) {
            this.getView().getViewModel().set('user', Ext.create('CB.model.User', CB.init.User));
        }
    },
    
    destroy: function () {
        Ext.destroyMembers(this, 'addLocationView', 'navigationMenu', 'collapseButton');
        this.callParent();
    },
    
    /**
     * Routes
     */
    
    onUnmatchedRoute: function(hash) {
        console.log('onUnmatchedRoute');
        var view = this.getView(),
            tab, header, title;
        
        view.setActiveTab(0);
        tab = view.getActiveTab();
        header = tab.down('toolbar[ui=header]');
        title = header.down('tbtext[cls=title]');
        title.setText('Unable to find #' + hash);
    },
    
    onHome: function() {
        console.log('onHome');
        var tab = this.getView().setActiveTab(this.lookupReference('cb-home'));
        if (tab) {
            this.redirectTo('home');
        }
    },
    
    onMap: function() {
        console.log('onMap');
        var tab = this.getView().setActiveTab(this.lookupReference('cb-map'));
        if (tab) {
            this.redirectTo('map');
        }
    },
    
    onUser: function() {
        console.log('onUser');
        var tab = this.getView().setActiveTab(this.lookupReference('cb-user'));
        if (tab) {
            this.redirectTo('user');
        }
    },
    
    onLocations: function() {
        console.log('onLocations');
        var tab = this.getView().setActiveTab(this.lookupReference('cb-locations'));
        if (tab) {
            this.redirectTo('locations');
        }
    },
    
    onLocation: function(id) {
        console.log('onLocation');
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
    },
    
    onLocationEdit: function(id) {
        console.log('onLocationEdit', id);
        var mainView = this.getView(),
            editLocationView = this.editLocationView,
            store = this.getStore('locations'),
            storeLoaded = store.isLoaded(),
            user = mainView.getViewModel().get('user'),
            location,
            editLocation = function() {
                if (id) {
                    location = store.getById(id);
                } else {
                    location = Ext.create('CB.model.Location');
                }
                
                if (!location) {
                    this.redirectTo('home');
                    return;
                }
                
                if (!editLocationView) {
                    this.editLocationView = editLocationView = Ext.create('CB.view.location.Edit', {
                        tabConfig: {
                            hidden: true
                        }
                    });
                    mainView.add(editLocationView);
                }
                
                mainView.setActiveTab(editLocationView);
                
                editLocationView.getViewModel().set('location', location);
            };
    
        if (!user) {
            this.redirectTo('home');
            return;
        }
        
        if (storeLoaded) {
            editLocation.apply(this);
        } else {
            store.on({
                load: {
                    fn: editLocation,
                    single: true,
                    scope: this
                }
            });
        }
    },
    
    /**
     * Listeners
     */
    
    onHeaderAfterRender: function(header) {
        console.log('onHeaderAfterRender');
        var collapseGlyph = 'xe61b@climbuddy',
            expandGlyph = 'xe61c@climbuddy',
            collapseText = 'Collapse menu',
            expandText = '',
            btn;
        
        this.collapseButton = btn = Ext.create('Ext.button.Button', {
            renderTo: header.el,
            cls: 'cb-collapser',
            handler: 'onCollapseClick',
            glyph: header.isCollapsed ? expandGlyph : collapseGlyph,
            text: header.isCollapsed ? expandText : collapseText,
            collapseGlyph: collapseGlyph,
            expandGlyph: expandGlyph,
            collapseText: collapseText,
            expandText: expandText,
            height: 38,
            plugins: 'responsive',
            responsiveConfig: {
                tall: {
                    visible: false
                },
                wide: {
                    visible: true
                }
            }
        });
    },
    
    onCollapseClick: function() {
        console.log('onCollapseClick');
        var header = this.getView().getHeader(),
            btn = this.collapseButton,
            el = header.getEl();
    
        if (header.isCollapsed) {
            header.isCollapsed = false;
            header.setWidth(198);
            header.removeCls(header.collapsedCls);
            btn.setGlyph(btn.collapseGlyph);
            btn.setText(btn.collapseText);
        } else {
            header.isCollapsed = true;
            header.originalWidth = header.getWidth();
            header.setWidth(68);
            header.addCls(header.collapsedCls);
            btn.setGlyph(btn.expandGlyph);
            btn.setText(btn.expandText);
        }
        
        this.getView().saveState();
    },
    
    onTabChange: function (view, tab) {
        console.log('onTabChange');
        if (tab.route) {
            this.redirectTo(tab.route);
        }
    },
    
    onMenuClick: function (e) {
        console.log('onMenuClick');
        if (!this.navigationMenu) {
            this.navigationMenu = Ext.create('Ext.menu.Menu', this.getView().getNavigationMenu());
        }

        this.navigationMenu.showAt(e.getXY());
    },
    
    onMenuItemClick: function (menu, item) {
        console.log('onMenuItemClick');
        this.getView().setActiveTab(menu.items.indexOf(item) + 1); // +1 for invisible first tab
    },
    
    onMapMarkerClick: function(marker, location, e) {
        console.log('onMapMarkerClick');
        this.redirectTo('location/' + location.get('id'));
    }
    
});
