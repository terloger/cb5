Ext.define('CB.view.location.Header', {
    extend: 'Ext.toolbar.Toolbar',
    
    xtype: 'cb-location-header',

    ui: 'header',
            
    layout: {
        overflowHandler: 'menu'
    },

    defaults: {
        hidden: true
    },

    items: [{
        xtype: 'tbtext',
        cls: 'title',
        bind: {
            hidden: '{!location}',
            text: '{location.name}'
        },
        listeners: {
            click: {
                element: 'el',
                fn: 'switchCard'
            }
        }
    },' ',{
        xtype: 'component',
        itemId: 'types',
        cls: 'types x-unselectable',
        hidden: false,
        height: 37,
        bind: {
            types: '{location.types}'
        },
        listeners: {
            click: {
                element: 'el',
                fn: 'typePicker'
            }
        },
        setTypes: function(types) {
            var html = [];
            types.each(function(type){
                html.push('<img src="resources/types/' + type.get('type') + '.png" data-qtip="' + type.get('name') + '" />');
            });
            this.update(html.join(' '));
        }
    },' ',{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Previous Photo',
        overflowText: 'Previous Photo',
        glyph: 'xe61b@climbuddy',
        handler: 'prevFile',
        bind: {
            hidden: '{!hasFiles}'
        }
    },{
        xtype: 'tbtext',
        bind: {
            hidden: '{!hasFiles}',
            text: '{fileIndex} of {fileCount}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Next Photo',
        overflowText: 'Next Photo',
        glyph: 'xe61c@climbuddy',
        handler: 'nextFile',
        bind: {
            hidden: '{!hasFiles}'
        }
    },{
        xtype: 'tbseparator',
        bind: {
            hidden: '{!hasFiles}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Zoom In',
        overflowText: 'Zoom In',
        glyph: 'xe63f@climbuddy',
        handler: 'zoomIn',
        bind: {
            hidden: '{!fileCount}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Zoom Out',
        overflowText: 'Zoom Out',
        glyph: 'xe63e@climbuddy',
        handler: 'zoomOut',
        bind: {
            hidden: '{!fileCount}'
        }
    },{
        xtype: 'tbseparator',
        bind: {
            hidden: '{!user}'
        }
    },{
        xtype: 'multifilebutton',
        ui: 'blank',
        tooltip: 'Add Photo',
        overflowText: 'Add Photo',
        glyph: 'xe623@climbuddy',
        bind: {
            hidden: '{!user}'
        },
        listeners: {
            change: 'saveFiles'
        }
    },{
        xtype: 'tbseparator',
        bind: {
            hidden: '{!draw}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Select Tool',
        overflowText: 'Select Tool',
        glyph: 'xe62a@climbuddy',
        paperTool: 'select',
        handler: 'setPaperTool',
        toggleGroup: 'paper-tools',
        bind: {
            hidden: '{!draw}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Move Tool',
        overflowText: 'Move Tool',
        glyph: 'xe63a@climbuddy',
        paperTool: 'move',
        handler: 'setPaperTool',
        toggleGroup: 'paper-tools',
        pressed: true,
        bind: {
            hidden: '{!draw}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Pen Tool',
        overflowText: 'Pen Tool',
        glyph: 'xe628@climbuddy',
        paperTool: 'pen',
        handler: 'setPaperTool',
        toggleGroup: 'paper-tools',
        bind: {
            hidden: '{!draw}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Clear Route Lines',
        overflowText: 'Clear Route Lines',
        glyph: 'xe61e@climbuddy',
        handler: 'clearRoute',
        bind: {
            hidden: '{!draw}'
        }
    },{
        xtype: 'tbseparator',
        bind: {
            hidden: '{!dirty}'
        }
    },{
        xtype: 'button',
        ui: 'default',
        text: 'Save',
        glyph: 'xe647@climbuddy',
        handler: 'save',
        bind: {
            hidden: '{!dirty}'
        }
    },'->',{
        xtype: 'button',
        ui: 'blank',
        tooltip: 'Settings',
        overflowText: 'Settings',
        glyph: 'xe60a@climbuddy',
        bind: {
            //hidden: '{!user}'
        }
    },{
        xtype: 'button',
        ui: 'blank',
        text: 'Login',
        overflowText: 'Login',
        glyph: 'xe60f@climbuddy',
        hidden: false,
        bind: {
            user: '{user}'
        },
        handler: function(btn, e){
            this.fireEvent('headeruserbuttonclick', btn, e);
        },
        setUser: function(user) {
            if (user instanceof CB.model.User) {
                this.setText(user.get('username'))
            } else {
                this.setText('Login');
            }
        }
    }]

});