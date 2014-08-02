Ext.define('CB.view.location.Routes', {
    extend: 'Ext.grid.Panel',
    
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
            beforedrag: 'checkUser',
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
        ptype: 'cellediting',
        pluginId: 'locationRouteCellEditing',
        clicksToEdit: 2
    },
    
    columns: [{
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        sortable: false,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }/*,{
        text: 'Pos',
        dataIndex: 'pos',
        width: 100,
        sortable: false
    }*/],
    
    listeners: {
        beforeedit: 'checkUser',
        edit: 'routeEdit',
        selectionchange: 'routeSelectionChange',
        itemmouseenter: 'routeMouseEnter',
        itemmouseleave: 'routeMouseLeave'
    }
    
});