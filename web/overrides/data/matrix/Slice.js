Ext.define('CB.overrides.data.matrix.Slice', {
    override: 'Ext.data.matrix.Slice',
    
    update: function (recordsOrIds, state) {
        //<debug>
        if (!(recordsOrIds instanceof Array)) {
            Ext.Error.raise('Only array of records or record ids are supported');
        }
        //</debug>

        var me = this,
            MatrixSlice = Ext.data.matrix.Slice,
            side = me.side,
            assocIndex = side.index,
            length = recordsOrIds.length,
            id = me.id,
            members = me.members,
            otherSide = side.inverse,
            assoc, call, i, item, otherId, otherSlices, otherSlice, record;

        for (i = 0; i < length; ++i) {
            call = record = null;
            item = recordsOrIds[i];
            otherId = item.isEntity ? (record = item).id : item;
            assoc = members[otherId];

            // If we're in a created state and we're asking to remove it, don't move it to
            // removed state, just blow it away completely.
            if (state < 0 && assoc && assoc[2] === 1) {
                delete members[otherId];
                otherSlice = otherSide[otherId] || otherSide.slices[otherId];
                if (otherSlice) {
                    delete otherSlice.members[id];
                }
                call = 1;
            } else {
                if (!assoc) {
                    // Note - when we create a new matrix tuple we must catalog it on both
                    // sides of the matrix or risk losing it on only one side. To gather all
                    // of the tuples we need only visit one side.
                    assoc = [ otherId, otherId, state ];
                    assoc[assocIndex] = id;

                    members[otherId] = assoc;
                    if (!(otherSlice = (otherSlices = otherSide.slices)[otherId])) {
                        otherSlices[otherId] = otherSlice = new MatrixSlice(otherSide, otherId);
                    }
                    otherSlice.members[id] =  assoc;
                    call = 1;
                } else if (state !== assoc[2] && state !== 0) {
                    // If they aren't equal and we're setting it to 0, favour the current state
                    assoc[2] = state;
                    otherSlice = otherSide.slices[otherId];
                    // because the assoc exists the other side will have a slice
                    call = 1;
                }
            }

            if (call) {
                if (me.notify) {
                    me.notify.call(me.scope, me, otherId, state);
                }
                if (otherSlice && otherSlice.notify) {
                    otherSlice.notify.call(otherSlice.scope, otherSlice, id, state);
                }
            }
        }
    }
    
});