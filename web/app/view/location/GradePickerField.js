Ext.define('CB.view.location.GradePickerField', {
    extend: 'Ext.form.field.Picker',

    requires: [
        'CB.view.location.GradePicker'
    ],
    
    xtype: 'cb-location-gradepickerfield',
    
    cls: 'cb-location-gradepickerfield',

    editable: false,
    selectOnFocus: true,
    
    config: {
        location: null,
        route: null
    },

    matchFieldWidth: false,

    ignoreSelection: 0,

    initComponent: function() {
        this.callParent();

        this.on({
            focus: function() {
                this.expand();
            },
            scope: this
        });
    },

    setValue: function(grade) {
        var inputEl = this.inputEl,
            value,
            rawValue;

        if (inputEl && this.emptyText && !Ext.isEmpty(grade)) {
            inputEl.removeCls(this.emptyUICls);
            inputEl.removeCls(this.emptyCls);
            this.valueContainsPlaceholder = false;
        }

        if (grade instanceof CB.model.Grade) {

            // grade instance
            value = grade;
            rawValue = grade.get('grade');

        } else if (Ext.isArray(grade)) {

            // grade object
            grade = grade[0];
            value = Ext.data.StoreManager.lookup('grades').getById(grade.id);
            rawValue = grade.grade;

        } else {

            // no value
            value = null;
            rawValue = null;

        }

        this.setRawValue(rawValue);

        this.value = value;

        this.checkChange();

        this.applyEmptyText();

        return this;
    },

    getValue: function() {
        return this.value;
    },

    pickerSelectionChange: function(picker, selection) {
        var grade = selection.length ? selection[0] : null;

        this.setValue(grade);

        this.fireEvent('blur');
    },

    applyLocation: function(location) {
        this.getPicker().setLocation(location);

        return location;
    },

    applyRoute: function(route) {
        this.getPicker().setRoute(route);

        return route;
    },

    createPicker: function() {
        return Ext.create('CB.view.location.GradePicker', {
            pickerField: this,
            floating: true,
            hidden: true,
            border: true,
            focusOnShow: true,
            focusOnToFront: false,
            preserveScrollOnRefresh: true,
            shadow: 'sides',
            autoScroll: true,
            maxHeight: 200,
            listeners: {
                selectionchange: this.pickerSelectionChange,
                refresh: this.onListRefresh,
                scope: this
            }
        });
    },

    alignPicker: function(){
        var me = this,
            picker = me.getPicker(),
            heightAbove = me.getPosition()[1] - Ext.getBody().getScroll().top,
            heightBelow = Ext.Element.getViewportHeight() - heightAbove - me.getHeight(),
            space = Math.max(heightAbove, heightBelow),
            pickerEl = picker.getTargetEl().dom,
            pickerScrollPos = pickerEl.scrollTop;

        // Allow the picker to height itself naturally.
        if (picker.height) {
            delete picker.height;
            picker.updateLayout();
        }

        // Then ensure that vertically, the dropdown will fit into the space either above or below the inputEl.
        if (picker.getHeight() > space - 5) {
            picker.setHeight(space - 5); // have some leeway so we aren't flush against
        }
        me.callParent();
        pickerEl.scrollTop = pickerScrollPos;
    },

    onListRefresh: function() {
        // Picker will be aligned during the expand call
        if (!this.expanding) {
            this.alignPicker();
        }
        //this.syncSelection();
    },

    syncSelection: function() {
        var me = this,
            picker = me.getPicker(),
            selection, selModel,
            values = me.valueModels || [],
            vLen  = values.length, v, value;

        if (picker) {
            // From the value, find the Models that are in the store's current data
            selection = [];
            for (v = 0; v < vLen; v++) {
                value = values[v];

                if (value && value.isModel && me.store.indexOf(value) >= 0) {
                    selection.push(value);
                }
            }

            // Update the selection to match
            me.ignoreSelection++;
            selModel = picker.getSelectionModel();
            if (selection.length) {
                selModel.select(selection, false);
            } else {
                selModel.deselectAll();
            }
            me.ignoreSelection--;
        }
    }/*,

    onEditorTab: function(e){
        var keyNav = this.listKeyNav;

        if (this.selectOnTab && keyNav) {
            keyNav.selectHighlighted(e);
        }
    }*/
    
});