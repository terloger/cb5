<?php

use Phinx\Migration\AbstractMigration;

class ChangeLocation extends AbstractMigration
{
    /**
     * Change table.
     */
    public function change()
    {
        $this->table('location')
            ->addColumn('parent_id', 'integer', array('after' => 'id', 'null' => true, 'default' => null))
            ->addIndex('parent_id')
            ->addForeignKey('parent_id', 'location', 'id', array('delete' => 'RESTRICT', 'update' => 'RESTRICT'))
            ->addColumn('slug', 'string', array('after' => 'description', 'limit'=>255))
            ->addColumn('confirmed', 'boolean', array('after' => 'created'))
            ->addColumn('deleted', 'boolean', array('after' => 'confirmed'))
            ->save();
    }

}