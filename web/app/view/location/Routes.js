Ext.define('CB.view.location.Routes', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CB.view.location.RoutesCellEditing'
    ],
    
    xtype: 'cb-location-routes',
    
    cls: 'cb-location-routes',
    
    reference: 'routes',
    
    sortableColumns: false,

    reserveScrollbar: true,
    
    bind: {
        store: '{location.routes}'
    },
    
    selModel: {
        mode: 'SINGLE',
        allowDeselect: false
    },
    
    viewConfig: {
        listeners: {
            beforedrag: 'beforeRouteDrag',
            drop: 'routeDrop'
        },
        plugins: {
            ptype: 'gridviewdragdrop',
            pluginId: 'locationRouteDragDrop',
            dragText: 'Drag and drop to reorder',
            ddGroup: 'locationRouteDD',
            containerScroll: true
        }
    },
    
    plugins: {
        ptype: 'routescellediting',
        pluginId: 'locationRouteCellEditing',
        clicksToEdit: 2
    },
    
    columns: [{
        text: '#',
        dataIndex: 'pos',
        width: 36,
        sortable: false,
        hideable: false,
        draggable: false,
        resizable: false,
        menuDisabled: true,
        renderer: function(value) {
            return value + 1;
        }
    },{
        text: 'Name',
        dataIndex: 'name',
        flex: 3,
        sortable: false,
        hideable: false,
        draggable: false,
        menuDisabled: true,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
        /*
        editor: {
            xtype: 'combo',
            store: {
                fields: ['abbr', 'name'],
                data : [
                    {"abbr":"AL", "name":"Alabama"},
                    {"abbr":"AK", "name":"Alaska"},
                    {"abbr":"AZ", "name":"Arizona"}
                ]
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr'
        }
        */
    },{
        text: 'Grade',
        dataIndex: 'grades',
        flex: 1,
        sortable: false,
        draggable: false,
        editor: {
            xtype: 'cb-location-gradepickerfield',
            shadow: true
        },
        renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
            var grade = record.grades().getAt(0);
            return grade ? grade.get('grade') : '';
        }
    },{
        text: 'Height',
        dataIndex: 'height',
        flex: 1,
        sortable: false,
        draggable: false,
        editor: {
            xtype: 'numberfield'
        },
        renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
            return value ? value + 'm' : '';
        }
    }],
    
    listeners: {
        beforeedit: 'beforeRouteEdit',
        edit: 'routeEdit',
        selectionchange: 'routeSelectionChange',
        itemmouseenter: 'routeMouseEnter',
        itemmouseleave: 'routeMouseLeave'
    }
    
});