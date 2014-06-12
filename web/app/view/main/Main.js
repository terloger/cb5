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

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        cls: 'cb-navigation',
        glyph: 'xe600@climbuddy',
        layout: {
            align: 'stretchmax'
        },
        title: {
            text: 'CLIMBuddy',
            textAlign: 'center',
            flex: 0
        },
        listeners: {
            click: function() {
                /*
                if (this.collapsed) {
                    this.collapsed = false;
                    this.setWidth(this.originalWidth);
                    this.getEl().down('.x-title-text').show();
                    this.getEl().select('.x-tab-inner').show();
                } else {
                    this.collapsed = true;
                    this.originalWidth = this.getWidth();
                    this.setWidth(72);
                    this.getEl().down('.x-title-text').hide();
                    this.getEl().select('.x-tab-inner').hide();
                }
                */
            }
        },
        tools: [{
            type: 'gear',
            plugins: 'responsive',
            width: 120,
            height: 95,
            margin: '0 0 0 0',
            handler: 'onMenuClick',
            responsiveConfig: {
                'width < 600 && tall': {
                    visible: true
                },
                'width >= 600': {
                    visible: false
                }
            }
        }]
    },
    
    navigationMenu: {
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

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },
    
    listeners: {
        tabchange: 'onTabChange',
        scope: 'controller'
    },

    defaults: {
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left',
                    flex: 0
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    flex: 1
                },
                'width < 600 && tall': {
                    visible: false
                },
                'width >= 600': {
                    visible: true
                }
            }
        }
    },
    
    items: [{
        // This page has a hidden tab so we can only get here during initialization. This
        // allows us to avoid rendering an initial activeTab only to change it immediately
        // by routing
        xtype: 'component',
        tabConfig: {
            hidden: true
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
                'width < 600 && tall': {
                    visible: false
                },
                'width >= 600': {
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
