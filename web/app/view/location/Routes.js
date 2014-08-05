Ext.define('CB.view.location.Routes', {
    extend: 'Ext.grid.Panel',

    requires: [
        'CB.view.location.RoutesCellEditing'
    ],
    
    xtype: 'cb-location-routes',
    
    cls: 'cb-location-routes',
    
    reference: 'routes',
    
    sortableColumns: false,
    
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
        text: 'Name',
        dataIndex: 'name',
        flex: 3,
        sortable: false,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },{
        text: 'Grade',
        dataIndex: 'grades',
        flex: 1,
        sortable: false,
        editor: {
            xtype: 'cb-location-gradepickerfield'
        },
        renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
            var grade = record.grades().getAt(0);
            return grade ? grade.get('grade') : '';
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