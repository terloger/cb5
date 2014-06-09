<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Country entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="country")
 */
class Country extends AbstractEntity
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
    protected $iso;

    /**
     * @OneToMany(targetEntity="Location", mappedBy="country")
     */
    protected $locations;

    /**
     * Getters
     */

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getIso()
    {
        return $this->iso;
    }

    public function getValues()
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'iso'  => $this->iso,
        ];
    }

}
