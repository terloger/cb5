/**
 * CB ExtJS paper panel view controller
 */
Ext.define('CB.paper.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-paper',
    
    config: {
        location: null
    },
    
    init: function() {
        this.getViewModel().bind('{location}', this.setLocation, this);
    }
    
});