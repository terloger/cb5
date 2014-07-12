/**
 * CB ExtJS paper panel view controller
 */
Ext.define('CB.paper.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-paper',
    
    mixins: {
        paper: 'CB.paper.Paper',
        location: 'CB.paper.Location',
        file: 'CB.paper.File',
        image: 'CB.paper.Image',
        route: 'CB.paper.Route',
        layer: 'CB.paper.Layer',
        path: 'CB.paper.Path', // cannot use path ;)
        tools: 'CB.paper.Tools',
        mouse: 'CB.paper.Mouse',
        touch: 'CB.paper.Touch',
        transform: 'CB.paper.Transform',
        zoom: 'CB.paper.Zoom'
    },
    
    init: function() {
        var vm = this.getViewModel().getParent();
        vm.bind('{location}', this.setLocation, this);
        vm.bind('{file}', this.setFile, this);
    },
    
    initPaper: function() {
        // init paper
        this.mixins.paper.constructor.call(this);
        
        // init touch/mouse
        if (Ext.supports.Touch) {
            this.mixins.touch.constructor.call(this);
        } else {
            this.mixins.mouse.constructor.call(this);
        }
        
        // init core mixins
        this.mixins.transform.constructor.call(this);
        this.mixins.location.constructor.call(this);
        this.mixins.file.constructor.call(this);
        this.mixins.route.constructor.call(this);
        this.mixins.layer.constructor.call(this);
        this.mixins.path.constructor.call(this);
        this.mixins.zoom.constructor.call(this);
        
        // init tools
        this.mixins.tools.constructor.call(this, {
            tools: ['move','select','pen']
        });
    }
    
});