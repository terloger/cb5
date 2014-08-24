/**
 * Location list view controller
 */
Ext.define('CB.view.location.ListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-location-list',

    /**
     * Grid
     */
    
    gridItemDblClick: function(grid, record, item, index, e) {
        this.redirectTo('location/' + record.get('id'));
    },

    /**
     * Search
     */

    search: function(field, value, oldValue) {
        var view = this.getView(),
            grid = view.down('grid'),
            store = grid.getStore(),
            filter = this.searchFilter;

        if (!Ext.isString(value) || value === '') {
            this.clearSearch();
            return;
        }

        if (filter) {
            store.removeFilter(filter);
        }

        filter = this.searchFilter = new Ext.create('Ext.util.Filter', {
            property: 'name',
            value: new RegExp(value, 'gi')
        });

        store.addFilter(filter);
    },

    searchSpecialKey: function(field, e) {
        if (e.getKey() === e.ENTER) {
            this.doSearch();
        } else if (e.getKey() === e.ESC) {
            this.clearSearch();
        }
    },

    clearSearch: function() {
        var view = this.getView(),
            grid = view.down('grid'),
            store = grid.getStore(),
            filter = this.searchFilter;

        if (filter) {
            store.removeFilter(filter);
            this.searchFilter = null;
        }
    },

    /**
     * Type filter
     */

    typePicker: function(btn, e) {
        var picker = this.filterMenu;

        if (!picker) {
            picker = this.filterMenu = Ext.create('CB.view.location.TypePicker', {
                floating: true,
                hidden: true,
                closable: true,
                closeAction: 'hide',
                width: 460,
                height: 200,
                bodyPadding: 5,
                location: false,
                listeners: {
                    selectionchange: this.typeChange,
                    scope: this
                }
            });
        }

        if (picker.isVisible()) {
            // hide picker
            picker.hide();
        } else {
            // show picker
            picker.triggerCt = btn;
            picker.showBy(btn, 'tl-bl');
        }
    },

    typeChange: function(sm, selection) {
        var view = this.getView(),
            grid = view.down('grid'),
            store = grid.getStore(),
            filter = this.typeFilter;

        if (filter) {
            store.removeFilter(filter);
        }

        if (!selection.length) {
            this.typeFilter = null;
            return;
        }

        filter = this.typeFilter = new Ext.create('Ext.util.Filter', {
            filterFn: function(location) {
                var hasType = false;

                location.types().each(function(type){
                    if (selection.indexOf(type) > -1) {
                        hasType = true;
                        return false;
                    }
                });

                return hasType;
            }
        });

        store.addFilter(filter);
    }

});
