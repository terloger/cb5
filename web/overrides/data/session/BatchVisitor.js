Ext.define('CB.overrides.data.session.BatchVisitor', {
    override: 'Ext.data.session.BatchVisitor',

    onDirtyRecord: function (record) {

        // skip dropped phantom records
        if (record.phantom && record.dropped) {
            return;
        }

        var me = this,
            operation = record.phantom ? 'create'
                : (record.dropped ? 'destroy' : 'update'),
            name = record.$className,
            map = (me.map || (me.map = {})),
            bucket = (map[name] || (map[name] = {
                entity: record.self
            }));

        //  User: {
        //      entity: User,
        //      create: [
        //          { id: 20, name: 'Don' }
        //      ]
        //  }

        bucket = bucket[operation] || (bucket[operation] = []);
        bucket.push(record);
    }
});