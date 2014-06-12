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
    
    session: true,
    
    reference: 'cb-main',
    
    ui: 'navigation',
    
    stateful: true,
    stateId: 'CB.view.main.Main',
    
    applyState: function(state) {
        if (state) {
            if (state.header && state.header.isCollapsed) {
                Ext.apply(this.header, {
                    isCollapsed: true,
                    width: 68,
                    cls: this.header.cls + ' ' + this.header.collapsedCls
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
    },

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        cls: 'cb-navigation',
        collapsedCls: 'collapsed',
        glyph: 'xe600@climbuddy',
        width: 198,
        layout: {
            align: 'stretchmax'
        },
        title: {
            text: 'CLIMBuddy',
            textAlign: 'center',
            flex: 0
        },
        listeners: {
            afterrender: 'onHeaderAfterRender'
        },
        tools: [{
            type: 'gear',
            width: 96,
            height: 72,
            margin: '0 0 0 0',
            handler: 'onMenuClick',
            plugins: 'responsive',
            responsiveConfig: {
                'width < 566 && tall': {
                    visible: true
                },
                'width >= 566': {
                    visible: false
                }
            }
        }]
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
    
    setCollapsed: function(collapsed) {
        var header = this.getHeader(),
            el = header.el;
    
        if (!el) {
            return;
        }
        
        if (collapsed && header.isCollapsed) {
            el.addCls('collapsed');
        } else {
            el.removeCls('collapsed');
        }
    },
    
    listeners: {
        tabchange: 'onTabChange',
        scope: 'controller'
    },

    navigationMenu: {
        xtype: 'menu',
        cls: 'cb-navigation-menu',
        items: [{
            text: 'Home',
            glyph: 'xe602@climbuddy',
            height: 50
        },{
            text: 'Map',
            glyph: 'xe603@climbuddy',
            height: 50
        },{
            text: 'Locations',
            glyph: 'xe605@climbuddy',
            height: 50
        },{
            text: 'Sign In',
            glyph: 'xe60f@climbuddy',
            height: 50
        }],
        listeners: {
            click: 'onMenuItemClick'
        }
    },
    
    defaults: {
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left',
                    flex: 0,
                    height: 58
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    flex: 1
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
            height: 72,
            items: [{
                xtype: 'tbtext',
                text: '',
                cls: 'title'
            }]
        }
    },{
        title: 'Home',
        xtype: 'cb-home',
        reference: 'cb-home',
        glyph: 'xe602@climbuddy',
        route: 'home',
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left',
                    flex: 0,
                    height: 58,
                    style: {
                        'box-shadow': 'inset 0px 5px 4px -2px rgba(0, 0, 0, 0.35)'
                    }
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    flex: 1,
                    style: {
                        'box-shadow': 'none'
                    }
                },
                'width < 566 && tall': {
                    visible: false
                },
                'width >= 566': {
                    visible: true
                }
            },
            style: {
                
            }
        }
    },{
        title: 'Map',
        xtype: 'cb-map',
        reference: 'cb-map',
        glyph: 'xe603@climbuddy',
        route: 'map'
    },{
        title: 'Location',
        xtype: 'cb-location',
        reference: 'cb-location',
        glyph: 'xe605@climbuddy',
        tabConfig: {
            hidden: true
        }
    },{
        title: 'Locations',
        xtype: 'cb-locations',
        reference: 'cb-locations',
        glyph: 'xe605@climbuddy',
        route: 'locations'
    },{
        title: 'Sign In',
        xtype: 'cb-user',
        reference: 'cb-user',
        glyph: 'xe60f@climbuddy',
        route: 'user'
    }]
    
});
