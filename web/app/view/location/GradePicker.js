Ext.define('CB.view.location.GradePicker', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-location-gradepicker',
    
    cls: 'cb-location-gradepicker',

    layout: {
        type: 'hbox'
    },
    
    config: {
        store: null,
        location: null,
        route: null
    },

    typeMap: {
        sport:      ['french','usa'],
        bouldering: ['font','hueco'],
        multipitch: ['french','usa'],
        trad:       ['french'],
        alpine:     ['uiaa'],
        waterice:   ['waterice'],
        dws:        ['french'],
        drytooling: ['mixed'],
        indoor:     ['french','usa']
    },

    items: [],

    tbar: {
        items: []
    },

    initComponent: function(config) {
        this.setStore(Ext.data.StoreManager.lookup('gradeTypes'));

        this.keyNavConfig = {
            esc: function() {
                this.collapse();
                this.focus();
            },
            scope: this
        };

        this.getStore().each(function(type){

            this.tbar.items.push({
                xtype: 'title',
                itemId: type.get('type') + 'Header',
                text: type.get('name'),
                textAlign: 'center',
                flex: 1,
                width: 100
            });
            
            this.items.push({
                xtype: 'panel',
                //title: type.get('name'),
                itemId: type.get('type') + 'Picker',
                minWidth: 100,
                flex: 1,
                items: [{
                    xtype: 'dataview',
                    store: type.grades(),
                    itemSelector: 'div.grade',
                    overItemCls: 'grade-over',
                    selectedItemCls: 'grade-selected',
                    selModel: {
                        mode: 'SINGLE',
                        allowDeselect: true
                    },
                    listeners: {
                        selectionchange: this.pickerSelectionChange,
                        scope: this
                    },
                    tpl: [
                        '<tpl for=".">',
                            '<div class="grade">{grade}</div>',
                        '</tpl>'
                    ]
                }]
            });

        }, this);

        this.callParent();
    },

    pickerSelectionChange: function(selModel, selection) {
        var view = selModel.view,
            picker = view.up('panel'),
            route = this.getRoute(),
            grade = selection.length ? selection[0] : null;

        this.items.each(function(item) {
            if (item !== picker) {
                item.down('dataview').getSelectionModel().deselectAll(true);
            }
        }, this);

        route.grades().removeAll();

        if (grade) {
            route.grades().add(grade);
        }

        this.fireEvent('selectionchange', this, selection);
    },

    applyRoute: function(route) {
        return route;
    },

    applyLocation: function(location) {
        var types = this.getLocationGradeTypes(location);

        this.getStore().each(function(type){
            var header = this.getTypeHeader(type),
                picker = this.getTypePicker(type);

            if (types.indexOf(type.get('type')) > -1) {
                header.show();
                picker.show();
            } else {
                header.hide();
                picker.hide();
            }

        }, this);

        return location;
    },

    getTypeHeader: function(type) {
        type = type instanceof CB.model.GradeType ? type.get('type') : type;
        return this.down('#' + type + 'Header');
    },

    getTypePicker: function(type) {
        type = type instanceof CB.model.GradeType ? type.get('type') : type;
        return this.down('#' + type + 'Picker');
    },

    getLocationGradeTypes: function(location) {
        var map = this.typeMap,
            locationTypes = [];

        location.types().each(function(locationType){
            locationTypes = locationTypes.concat(map[locationType.get('type')]);
        }, this);

        return locationTypes;
    }
    
});