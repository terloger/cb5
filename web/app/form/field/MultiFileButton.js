/**
 * Multi file upload button
 */
Ext.define('CB.form.field.MultiFileButton', {
    extend: 'Ext.form.field.FileButton',
    
    xtype: 'widget.multifilebutton',
    
    afterTpl: '<input id="{id}-fileInputEl" data-ref="fileInputEl" class="{childElCls} {inputCls}" ' +
        'type="file" size="1" name="{inputName}" role="{role}" tabIndex="{tabIndex}" multiple="1">',

    createFileInput: function(isTemporary) {
        var me = this;
        me.fileInputEl = me.el.createChild({
            name: me.inputName,
            id: !isTemporary ? me.id + '-fileInputEl' : undefined,
            cls: me.inputCls,
            tag: 'input',
            type: 'file',
            size: 1,
            role: 'button',
            multiple: 1
        });
        me.fileInputEl.on('change', me.fireChange, me);  
    }
    
});
