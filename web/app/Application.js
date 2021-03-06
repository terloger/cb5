/**
 * Climbuddy application
 */
Ext.define('CB.Application', {
    extend: 'Ext.app.Application',
    
    name: 'CB',
    
    defaultToken: 'home',
    
    glyphFontFamily: 'climbuddy',
    
    requires: [
        'Ext.state.CookieProvider',
        'Ext.direct.RemotingProvider',
        'Ext.MessageBox',
        'CB.overrides.data.matrix.Slice',
        'CB.overrides.data.session.BatchVisitor',
        'CB.overrides.grid.plugin.DragDrop',
        'CB.service.File',
        'CB.Config'
    ],

    models: [
        'Base',
        'Country',
        'File',
        'Grade',
        'GradeType',
        'Layer',
        'Location',
        'LocationType',
        'Route',
        'Sector',
        'User'
    ],
    
    views: [
        'main.Main',
        'home.Home',
        'map.Map',
        'location.Location',
        'location.List',
        'location.Add',
        'user.User',
        'user.Login',
        'user.Home',
        'user.HeaderButton'
    ],
    
    waitFor: [
        'Country.read',
        'Location.read',
        'LocationType.read',
        'GradeType.read'
    ],
    
    init: function() {
        // initialize state provider
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
            expires: new Date(new Date().getTime()+(1000*60*60*24*30))
        }));
        
        // initialize direct provider
        Ext.direct.Manager.addProvider(CB.init.API);
        
        // handle api errors
        Ext.direct.Manager.on({
            event: this.onDirectEvent,
            exception: this.onDirectException,
            scope: this
        });
    },
    
    launch: function() {
        Ext.getBody().mask('Loading application ...');
    },
    
    onDataReady: function() {
        // remove direct event handler
        Ext.direct.Manager.un({
            event: this.onDirectEvent,
            scope: this
        });
        
        // unmask body
        Ext.getBody().unmask();
        
        // fire application event
        this.fireEvent('dataready');

        /*
        var wnd = Ext.create('Ext.window.Window', {
            title: 'captcha',
            width: 460,
            height: 164,
            bodyPadding: 10,
            autoShow: true,
            items: [{
                xtype: 'component',
                id: 'captcha'
            }],
            listeners: {
                afterrender: function() {
                    Recaptcha.create("6Lej8PgSAAAAAOuN3DxUg4NYCC0d-HkQafT8CB9E",
                        "captcha",
                        {
                            theme: "clean",
                            callback: Recaptcha.focus_response_field
                        }
                    );
                }
            }
        });
        */
    },
    
    onDirectEvent: function(e, provider) {
        var event = e.action + '.' + e.method,
            index = this.waitFor.indexOf(event);

        if (index > -1) {
            this.waitFor.splice(index, 1);
            if (this.waitFor.length === 0) {
                this.onDataReady();
            }
        }
    },
    
    onDirectException: function(e) {
        Ext.Msg.show({
            title: 'Server Exception',
            msg: e.message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    
});
