/**
 * Main view controller
 */
Ext.define('CB.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'CB.Config'
    ],
    
    alias: 'controller.cb-main',
    
    routes: {
        'home': 'homeRoute',
        'map': 'mapRoute',
        'user': 'userRoute',
        'locations': 'locationsRoute',
        'location/:id': {
            action: 'locationRoute',
            before: 'beforeLocationRoute',
            conditions: {
                ':id': '([0-9]+)'
            }
        }
    },
    
    listen: {
        controller: {
            '#': {
                unmatchedroute : 'unmatchedRoute'
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
            this.getViewModel().set('user', Ext.create('CB.model.User', CB.init.User));
        }
    },
    
    destroy: function () {
        Ext.destroyMembers(this, 'addLocationView', 'navigationMenu', 'collapseButton');
        this.callParent(arguments);
    },
    
    /**
     * Routes
     */
    
    homeRoute: function() {
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-home'));
        
        if (tab) {
            this.redirectTo('home');
        }
    },
    
    mapRoute: function() {
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-map'))
    
        if (tab) {
            this.redirectTo('map');
        }
    },
    
    userRoute: function() {
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-user'))

        if (tab) {
            this.redirectTo('user');
        }
    },
    
    locationsRoute: function() {
        var view = this.getView(),
            tab = view.setActiveTab(view.down('cb-location-list'))
    
        if (tab) {
            this.redirectTo('locations');
        }
    },
    
    beforeLocationRoute: function(id, action) {
        var view = this.getView(),
            locationView = view.down('cb-location'),
            vm = locationView.getViewModel(),
            store = vm.get('locations'),
            storeLoaded = store.isLoaded(),
            checkLocation = function() {
                var location = store.getById(id);
                if (location) {
                    action.resume();
                } else {
                    action.stop(true);
                    this.showError('Unable to find location ' + id);
                }
            };
    
        if (storeLoaded) {
            checkLocation.apply(this);
        } else {
            store.on({
                load: checkLocation,
                single: true,
                scope: this
            });
        }
    },
    
    locationRoute: function(id) {
        var view = this.getView(),
            locationView = view.down('cb-location'),
            vm = locationView.getViewModel(),
            store = vm.get('locations'),
            location = store.getById(id);
        
        view.setActiveTab(locationView);
        locationView.showLocation(location);
        this.redirectTo('location/' + id);
    },
    
    unmatchedRoute: function(hash) {
        this.showError('Unable to find route ' + hash);
    },
    
    /**
     * View
     */
    
    tabChange: function (view, tab) {
        if (tab.route) {
            this.redirectTo(tab.route);
        }
    },
    
    headerAfterRender: function(header) {
        var collapseGlyph = 'xe61b@climbuddy',
            expandGlyph = 'xe61c@climbuddy',
            collapseText = 'Collapse menu',
            expandText = '';
        
        this.collapseButton = Ext.create('Ext.button.Button', {
            renderTo: header.el,
            cls: 'cb-collapser',
            handler: 'collapseClick',
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
    
    collapseClick: function() {
        var header = this.getView().getHeader(),
            btn = this.collapseButton;
    
        if (header.isCollapsed) {
            header.isCollapsed = false;
            header.setWidth(178);
            header.removeCls(header.collapsedCls);
            btn.setGlyph(btn.collapseGlyph);
            btn.setText(btn.collapseText);
        } else {
            header.isCollapsed = true;
            header.originalWidth = header.getWidth();
            header.setWidth(52);
            header.addCls(header.collapsedCls);
            btn.setGlyph(btn.expandGlyph);
            btn.setText(btn.expandText);
        }
        
        this.getView().saveState();
    },
    
    showError: function(msg) {
        var view = this.getView(),
            tab, header, title;
        
        view.setActiveTab(0);
        tab = view.getActiveTab();
        header = tab.down('toolbar[ui=header]');
        title = header.down('tbtext[cls=title]');
        title.setText(msg || 'Unknown error');
    },
    
    showLocationAdd: function(country, lat, lng) {
        var view = this.getView(),
            vm = view.getViewModel(),
            user = vm.get('user'),
            addLocationView;

        if (!user) {
            this.redirectTo('home');
            return;
        }

        addLocationView = Ext.create('CB.view.location.Add', {
            country: country,
            lat: lat,
            lng: lng,
            tabConfig: {
                hidden: true
            }
        });
        
        view.add(addLocationView);
        view.setActiveTab(addLocationView);
    },
    
    showNavigationMenu: function (e) {
        if (!this.navigationMenu) {
            this.navigationMenu = Ext.create('Ext.menu.Menu', this.getView().navigationMenu);
        }

        this.navigationMenu.showAt(e.getXY());
    },
    
    navigationMenuClick: function (menu, item) {
        this.getView().setActiveTab(menu.items.indexOf(item) + 1); // +1 for invisible first tab
    }
    
});
