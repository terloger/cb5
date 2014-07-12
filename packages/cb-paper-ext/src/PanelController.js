/**
 * CB ExtJS paper panel view controller
 */
Ext.define('CB.paper.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-paper',
    
    mixins: {
        location: 'CB.paper.Location',
        file: 'CB.paper.File',
        route: 'CB.paper.Route',
        layer: 'CB.paper.Layer',
        ppath: 'CB.paper.PPath', // cannot use path ;)
        tools: 'CB.paper.Tools',
        mouse: 'CB.paper.Mouse',
        touch: 'CB.paper.Touch',
        transform: 'CB.paper.Transform',
        zoom: 'CB.paper.Zoom'
    },
    
    config: {
        paper: null,
        canvas: null,
        image: null,
        imageWidth: 0,
        imageHeight: 0,
        imagePadding: 20
    },
    
    init: function() {
        var vm = this.getViewModel().getParent();
        
        vm.bind('{location}', this.setLocation, this);
        vm.bind('{file}', this.setFile, this);
    },
    
    initPaper: function() {
        var view = this.getView(),
            w = view.getWidth(),
            h = view.getHeight();
    
        // set paper, canvas and image reference
        this.setPaper(Ext.get('cb-paper'));
        this.setImage(Ext.get('cb-image'));
        this.setCanvas(Ext.get('cb-canvas'));
        
        // init canvas
        paper.setup(this.getCanvas().dom);
        
        // fit canvas to parent container
        this.resizePaper(w, h);
        
        // init mixins
        if (Ext.supports.Touch) {
            this.mixins.touch.constructor.call(this);
        } else {
            this.mixins.mouse.constructor.call(this);
        }
        
        this.mixins.transform.constructor.call(this);
        
        this.mixins.location.constructor.call(this);
        this.mixins.file.constructor.call(this);
        this.mixins.route.constructor.call(this);
        this.mixins.layer.constructor.call(this);
        
        this.mixins.ppath.constructor.call(this);
        
        this.mixins.zoom.constructor.call(this);
        
        this.mixins.tools.constructor.call(this, {
            tools: ['move','select','pen']
        });
    },
    
    resizePaper: function(a, b, c) {
        var w = Ext.isNumber(a) ? a : b,
            h = Ext.isNumber(a) ? b : c;
    
        if (this.getCanvas()) {
            this.getCanvas().setWidth(w);
            this.getCanvas().setHeight(h);
            paper.view.viewSize = new paper.Size(w, h);
        }
    }
    
});