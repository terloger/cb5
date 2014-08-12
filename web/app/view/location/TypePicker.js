Ext.define('CB.view.location.TypePicker', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-location-typepicker',
    
    cls: 'cb-location-typepicker',
    
    title: 'Types',
    
    config: {
        location: null,
        types: null
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

        if (this.getLocation()) {
            this.view.on({
                itemclick: this.onItemClick,
                scope: this
            });
        }

        if (this.floating) {
            this.on({
                show: this.monDoc,
                hide: this.munDoc,
                scope: this
            });
        }
    },
    
    applyLocation: function(location) {
        if (location instanceof CB.model.Location) {
            this.setTypes(location.types());
        }

        return location;
    },

    applyTypes: function(types) {
        var sm = this.down('dataview').getSelectionModel();

        if (!types) {
            types = [];
        } else if (types instanceof Ext.data.Store) {
            types = types.getRange();
        } else if (types instanceof CB.model.LocationType) {
            types = [types];
        }

        if (types.length) {
            sm.select(types, false, true);
        } else {
            sm.deselectAll(true);
        }

        return types;
    },
    
    onItemClick: function(view, type, item, index, e) {
        var location = this.getLocation();
        if (location instanceof CB.model.Location) {
            // handle type if attached to location
            var types = location.types(),
                hasType = types.getById(type.get('id'));

            if (hasType) {
                // remove type
                types.remove(hasType);
            } else {
                // add type
                types.add(type);
            }
        }
    },
    
    monDoc: function() {
        this.mon(Ext.getDoc(), 'mousedown', this.mimicBlur, this, {
            delay: 10
        });
    },
    
    munDoc: function() {
        this.mun(Ext.getDoc(), 'mousedown', this.mimicBlur, this);
    },
    
    mimicBlur: function(e) {
        if (!this.isDestroyed && !(this.el.contains(e.target) || this.triggerCt.el.contains(e.target))) {
            this.hide();
        }
    }
    
});