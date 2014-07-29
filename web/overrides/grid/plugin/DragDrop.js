Ext.define('CB.overrides.grid.plugin.DragDrop', {
    override: 'Ext.grid.plugin.DragDrop',
    
    onViewRender : function(view) {
        var me = this,
            scrollEl;

        if (me.enableDrag) {
            if (me.containerScroll) {
                scrollEl = view.getEl();
            }

            me.dragZone = new Ext.view.DragZone(Ext.apply({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                containerScroll: me.containerScroll,
                scrollEl: scrollEl,
                onBeforeDrag: function(data, e) {
                    if (view.fireEvent('beforedrag', view, me, data, e) === false) {
                        return false;
                    }
                    return true;
                }
            }, me.dragZone));
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.grid.ViewDropZone(Ext.apply({
                view: view,
                ddGroup: me.dropGroup || me.ddGroup
            }, me.dropZone));
        }
    }
    
});