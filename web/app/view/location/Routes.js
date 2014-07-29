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
            drop: 'routeDrop'
        },
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorder',
            containerScroll: true,
            ddGroup: 'locationRouteDD'
        }
    },
    
    plugins: {
        ptype: 'cellediting',
        pluginId: 'cellediting',
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
        edit: 'routeEdit',
        itemclick: 'routeSelectionChange',
        itemmouseenter: 'routeMouseEnter',
        itemmouseleave: 'routeMouseLeave'
    }
    
});