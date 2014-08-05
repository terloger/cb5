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

    initComponent: function() {
        this.callParent();

        this.on({
            focus: function() {
                this.expand();
            },
            scope: this
        });
    },

    createPicker: function() {
        return Ext.create('CB.view.location.GradePicker', {
            renderTo: document.body,
            pickerField: this,
            floating: true,
            hidden: true,
            focusOnShow: true,
            autoScroll: true,
            height: 200,
            listeners: {
                selectionchange: this.pickerSelectionChange,
                scope: this
            }
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
    }
    
});