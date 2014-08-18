Ext.define('CB.view.map.SearchMenu', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-map-searchmenu',
    
    cls: 'cb-map-searchmenu',
    
    //title: 'Search results',

    config: {
        store: null
    },
    
    items: [{
        xtype: 'dataview',
        store: {
            type: 'json',
            storeId: 'mapSearchResults',
            fields: [
                'name',
                'location',
                'bounds'
            ]
            /*
            fields: [
                'formatted_address',
                'address_components',
                'geometry',
                'types'
            ]
            */
        },
        itemSelector: 'div.item',
        overItemCls: 'item-over',
        selectedItemCls: 'item-selected',
        selModel: {
            mode: 'SINGLE',
            allowDeselect: false
        },
        tpl: [
            '<tpl for=".">',
                '<div class="item">',
                    '<span class="icon {iconCls}"></span>{name}',
                '</div>',
            '</tpl>'
        ]
    }],

    initComponent: function() {
        this.callParent();
        
        this.view = this.down('dataview');

        this.setStore(this.view.getStore());

        this.relayEvents(this.view, ['selectionchange']);

        if (this.floating) {
            this.on({
                show: this.monDoc,
                hide: this.munDoc,
                scope: this
            });
        }
    },

    showBy: function(cmp, position, offsets) {
        this.triggerCt = cmp;

        this.callParent(arguments);
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