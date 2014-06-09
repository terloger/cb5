<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Sector entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="sector")
 * @HasLifecycleCallbacks
 */
class Sector extends AbstractEntity
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
     * @Column(type="datetime")
     */
    protected $created;

    /**
     * @PrePersist
     */
    public function onPrePersist()
    {
        $this->created = new \DateTime();
    }

}
