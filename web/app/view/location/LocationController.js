/**
 * Location view controller
 */
Ext.define('CB.view.location.LocationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location',
    
    showLocation: function(location) {
        console.log('showLocation');
        
        var view = this.getView(),
            rendered = view.rendered,
            visible = view.isVisible(),
            paper = this.lookupReference('cb-paper');
        
        if (!rendered) {
            view.on({
                afterrender: function() {
                    paper.setLocation(location);
                }
            });
        } else if (!visible) {
            view.on({
                show: {
                    fn: function() {
                        paper.setLocation(location);
                    },
                    single: true
                }
            });
        } else {
            paper.setLocation(location);
        }
    },
    
    hideLocation: function() {
        console.log('hideLocation');
        
        var view = this.getView(),
            viewModel = view.getViewModel(),
            paper = this.lookupReference('cb-paper');
    
        viewModel.set('location', null);
        
        paper.setLocation(null);
    }
    
});
