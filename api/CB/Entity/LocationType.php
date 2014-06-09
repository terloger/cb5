<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Type entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="location_type")
 */
class LocationType extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;

    /**
     * @Column(type="string")
     */
    protected $name;

    /**
     * @Column(type="string")
     */
    protected $type;

    /**
     * Getters
     */

    public function getId()
    {
        return $this->id;
    }

    public function getType()
    {
        return $this->type;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getValues()
    {
        return [
            'id'   => $this->id,
            'type' => $this->type,
            'name' => $this->name,
        ];
    }

}
