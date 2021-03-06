/**
 * Main view
 */
Ext.define('CB.view.main.Main', {
    extend: 'Ext.tab.Panel',
    
    xtype: 'cb-main',

    controller: 'cb-main',

    viewModel: {
        type: 'cb-main'
    },
    
    ui: 'navigation',
    
    stateful: true,
    stateId: 'CB.view.main.Main',
    
    cls: 'cb-main',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        cls: 'cb-navigation',
        collapsedCls: 'collapsed',
        glyph: 'xe600@climbuddy',
        width: 178,
        layout: {
            align: 'stretchmax'
        },
        title: {
            text: 'CLIMBuddy',
            textAlign: 'center',
            flex: 0
        },
        listeners: {
            afterrender: 'navigationAfterRender'
        },
        tools: [{
            type: 'gear',
            width: 52,
            height: 46,
            margin: '0 0 0 0',
            handler: 'showNavigationMenu',
            plugins: 'responsive',
            hidden: true,
            responsiveConfig: {
                'width < 566 && tall': {
                    hidden: false
                },
                'width >= 566': {
                    hidden: true
                }
            }
        }]
    },
    
    navigationMenu: {
        xtype: 'menu',
        cls: 'cb-navigation-menu',
        items: [{
            text: 'Home',
            route: 'home',
            glyph: 'xe602@climbuddy',
            height: 46
        },{
            text: 'Map',
            route: 'map',
            glyph: 'xe603@climbuddy',
            height: 46
        },{
            text: 'Locations',
            route: 'locations',
            glyph: 'xe605@climbuddy',
            height: 46
        },{
            text: 'User',
            route: 'user',
            glyph: 'xe60f@climbuddy',
            height: 46
        }],
        listeners: {
            click: 'navigationMenuClick'
        }
    },
    
    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            collapsed: false,
            headerPosition: 'top'
        },
        wide: {
            collapsed: true,
            headerPosition: 'left'
        }
    },
    
    listeners: {
        tabchange: 'tabChange',
        scope: 'controller'
    },
    
    defaults: {
        tabConfig: {
            plugins: 'responsive',
            iconAlign: 'left',
            textAlign: 'left',
            flex: 0,
            responsiveConfig: {
                wide: {
                    height: 52
                },
                tall: {
                    height: 46
                },
                'width < 566 && tall': {
                    visible: false
                },
                'width >= 566': {
                    visible: true
                }
            }
        }
    },
    
    items: [{
        xtype: 'panel',
        tabConfig: {
            hidden: true
        },
        tbar: {
            ui: 'header',
            height: 46,
            items: [{
                xtype: 'tbtext',
                text: 'Loading application ...',
                cls: 'title'
            }]
        }
    },{
        title: 'Home',
        xtype: 'cb-home',
        glyph: 'xe602@climbuddy',
        route: 'home'
    },{
        title: 'Map',
        xtype: 'cb-map',
        glyph: 'xe603@climbuddy',
        route: 'map'
    },{
        title: 'Location',
        xtype: 'cb-location',
        glyph: 'xe605@climbuddy',
        tabConfig: {
            hidden: true
        }
    },{
        title: 'Locations',
        xtype: 'cb-location-list',
        glyph: 'xe605@climbuddy',
        route: 'locations'
    },{
        title: 'User',
        xtype: 'cb-user',
        glyph: 'xe60f@climbuddy',
        route: 'user'
    }],

    setCollapsed: function(collapsed) {
        var header = this.getHeader(),
            el = header.el;
    
        if (!el) {
            return;
        }
        
        if (collapsed && header.isCollapsed) {
            el.addCls('collapsed');
        } else if (el.is('.collapsed')) {
            el.removeCls('collapsed');
        }
    },
    
    applyState: function(state) {
        if (state) {
            if (state.header && state.header.isCollapsed) {
                var cls = this.header.cls;
                if (Ext.mixin.Responsive.state.wide) {
                    cls += ' ' + this.header.collapsedCls;
                }
                Ext.apply(this.header, {
                    isCollapsed: true,
                    width: 52,
                    cls: cls
                });
            }
        }
    },

    getState: function() {
        var header = this.getHeader(),
            state = {
                header: {
                    isCollapsed: header.isCollapsed
                }
            };
        
        return state;
    }
    
});
