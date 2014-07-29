Ext.define('CB.view.location.MiniMap', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-location-minimap',
    
    cls: 'cb-location-minimap',
    
    title: 'Mini Map',
    
    stateful: true,
    stateId: 'CB.view.location.MiniMap',
    
    layout: {
        type: 'fit'
    },
    
    listeners: {
        resize: 'resizeMiniMap'
    }

});