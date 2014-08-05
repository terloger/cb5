Ext.define('CB.view.location.RoutesCellEditing', {
    extend: 'Ext.grid.plugin.CellEditing',

    alias: 'plugin.routescellediting',

    onEditComplete : function(ed, value, startValue) {
        var me = this,
            activeColumn = me.getActiveColumn(),
            context = me.context,
            field = ed.field,
            record;

        if (activeColumn) {
            record = context.record;

            me.setActiveEditor(null);
            me.setActiveColumn(null);
            me.setActiveRecord(null);

            context.value = value;
            if (!me.validateEdit()) {
                me.editing = false;
                return;
            }

            if (field.isXType('cb-location-gradepickerfield')) {

                // update route grade
                me.view.refresh();
                //console.log('set grade', value);
                //console.log('context', context);

            } else {

                // Only update the record if the new value is different than the
                // startValue. When the view refreshes its el will gain focus
                if (!record.isEqual(value, startValue)) {
                    record.set(activeColumn.dataIndex, value);
                }

            }

            // Restore focus back to the view.
            // Use delay so that if we are completing due to tabbing, we can cancel the focus task
            context.view.focusRow(context.rowIdx, 100);
            me.fireEvent('edit', me, context);
            me.editing = false;
        }
    }
    
});