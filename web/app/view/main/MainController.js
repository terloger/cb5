/**
 * Main view controller
 */
Ext.define('CB.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-main',
    
    routes: {
        'home': 'showHome',
        'map': 'showMap',
        'user': 'showUser',
        'locations': 'showLocations',
        'location/add': 'showLocationAdd',
        'location/:id': {
            action: 'showLocation',
            conditions: {
                ':id': '([0-9]+)'
            }
        }
    },
    
    listen: {
        controller: {
            '#': {
                unmatchedroute : 'onUnmatchedRoute'
            },
            '*': {
                addlocation: 'showLocationAdd'
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
        this.callParent(arguments);
    },
    
    onTabChange: function (view, tab) {
        console.log('onTabChange');
        if (tab.route) {
            this.redirectTo(tab.route);
        }
    },
    
    onHeaderAfterRender: function(header) {
        console.log('onHeaderAfterRender');
        var collapseGlyph = 'xe61b@climbuddy',
            expandGlyph = 'xe61c@climbuddy',
            collapseText = 'Collapse menu',
            expandText = '';
        
        this.collapseButton = Ext.create('Ext.button.Button', {
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
    
    onUnmatchedRoute: function(hash) {
        console.log('onUnmatchedRoute');
        var view = this.getView(),
            tab, header, title;
        
        view.setActiveTab(0);
        tab = view.getActiveTab();
        header = tab.down('toolbar[ui=header]');
        title = header.down('tbtext[cls=title]');
        title.setText('Unable to find route #' + hash);
    },
    
    /**
     * Routes
     */
    
    showHome: function() {
        console.log('showHome');
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-home'));
        
        if (tab) {
            this.redirectTo('home');
        }
    },
    
    showMap: function() {
        console.log('showMap');
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-map'))
    
        if (tab) {
            this.redirectTo('map');
        }
    },
    
    showUser: function() {
        console.log('showUser');
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-user'))

        if (tab) {
            this.redirectTo('user');
        }
    },
    
    showLocations: function() {
        console.log('showLocations');
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-locations'))
    
        if (tab) {
            this.redirectTo('locations');
        }
    },
    
    showLocation: function(id) {
        console.log('showLocation');
        var view = this.getView(),
            viewModel = view.getViewModel(),
            locationView = view.down('cb-location'),
            locationViewModel = locationView.getViewModel(),
            locationViewCtrl = locationView.getController(),
            store = viewModel.get('locations'),
            storeLoaded = store.isLoaded(),
            showLocation = function() {
                var location = store.getById(id);
                if (location) {
                    locationViewCtrl.showLocation(location);
                    locationViewModel.bind({bindTo: '{location}', single: true}, function(location){
                        if (storeLoaded && view.setActiveTab(locationView)) {
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
            
            if (view.setActiveTab(locationView)) {
                this.redirectTo('location/' + id);
            }
        }
    },
    
    showLocationAdd: function(country, lat, lng) {
        console.log('showLocationAdd');
        var view = this.getView(),
            viewModel = view.getViewModel(),
            user = viewModel.get('user'),
            addLocationView,
            session,
            location;
    
        if (!user) {
            this.redirectTo('home');
            return;
        }
        
        session = Ext.create('Ext.data.Session');

        addLocationView = Ext.create('CB.view.location.Add', {
            session: session,
            tabConfig: {
                hidden: true
            }
        });
        
        view.add(addLocationView);

        location = session.createRecord('Location', {
            lat: lat,
            lng: lng,
            created: new Date()
        });
        
        location.setCountry(country);
        
        addLocationView.getViewModel().set('location', location);
        
        view.setActiveTab(addLocationView);
    },
    
    /**
     * Navigation menu
     */
    
    showNavigationMenu: function (e) {
        console.log('onMenuClick');
        if (!this.navigationMenu) {
            this.navigationMenu = Ext.create('Ext.menu.Menu', this.getView().navigationMenu);
        }

        this.navigationMenu.showAt(e.getXY());
    },
    
    onNavigationMenuClick: function (menu, item) {
        console.log('onMenuItemClick');
        this.getView().setActiveTab(menu.items.indexOf(item) + 1); // +1 for invisible first tab
    }
    
});
