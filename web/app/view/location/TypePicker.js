Ext.define('CB.view.location.TypePicker', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-location-typepicker',
    
    cls: 'cb-location-typepicker',
    
    title: 'Types',
    
    config: {
        location: null
    },
    
    items: [{
        xtype: 'dataview',
        store: 'locationTypes',
        itemSelector: 'div.type',
        overItemCls: 'type-over',
        selectedItemCls: 'type-selected',
        selModel: {
            mode: 'SIMPLE'
        },
        tpl: [
            '<tpl for=".">',
                '<div class="type">',
                    '<img src="resources/types/{type}.png" />',
                    '<span>{name}</span>',
                '</div>',
            '</tpl>'
        ]
    }],

    initComponent: function() {
        this.callParent();
        
        this.view = this.down('dataview');
        
        this.relayEvents(this.view, ['selectionchange']);
        
        this.view.on({
            itemclick: this.onItemClick,
            scope: this
        });
        
        this.on({
            show: this.resumeListeners,
            hide: this.suspendListeners,
            scope: this
        });
    },
    
    applyLocation: function(location) {
        var dataview = this.down('dataview'),
            store = dataview.getStore(),
            sm = dataview.getSelectionModel(),
            types = [];
    
        if (location) {
            location.types().each(function(type){
                var record = store.getById(type.get('id'));
                if (record) {
                    types.push(record);
                }
            }, this);
        }
        
        if (types.length) {
            sm.select(location.types().getRange(), false, true);
        } else {
            sm.deselectAll(true);
        }
        
        return location;
    },
    
    onItemClick: function(view, type, item, index, e) {
        var view = this.up('cb-location'),
            vm = view.getViewModel(),
            location = vm.get('location'),
            types = location.types(),
            hasType = types.getById(type.get('id'));
    
        if (hasType) {
            // remove type
            types.remove(hasType);
        } else {
            // add type
            types.add(type);
        }
        
        view.down('#types').setTypes(types);
    },
    
    resumeListeners: function() {
        this.mon(Ext.getDoc(), 'mousedown', this.mimicBlur, this, {
            delay: 10
        });
    },
    
    suspendListeners: function() {
        this.mun(Ext.getDoc(), 'mousedown', this.mimicBlur, this);
    },
    
    mimicBlur: function(e) {
        if (!this.isDestroyed && !(this.el.contains(e.target) || this.parent.el.contains(e.target))) {
            this.hide();
            console.log('hide mimicblur');
        }
    }
    
});