<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * Token entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="token")
 */
class Token extends AbstractEntity
{
    /**
     * @Id
     * @Column(type="string")
     */
    protected $id;

    /**
     * @Column(type="string")
     */
    protected $type;

    /**
     * @Column(type="string")
     */
    protected $value;

    /**
     * @Column(type="datetime")
     */
    protected $expires;

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

    public function getValue()
    {
        return $this->value;
    }

    public function getExpires()
    {
        return $this->expires;
    }

    /**
     * Setters
     */

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

    public function setExpires($expires)
    {
        $this->expires = $expires;
    }

}
