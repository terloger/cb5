<?php

/**
 * Climbuddy namespace
 *
 * @package CB\Entity
 */
namespace CB\Entity;

/**
 * GradeType entity
 *
 * @package CB\Entity
 *
 * @Entity
 * @Table(name="grade_type")
 */
class GradeType extends AbstractEntity
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
     * @OneToMany(targetEntity="Grade", mappedBy="type")
     */
    protected $grades;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->grades = new \Doctrine\Common\Collections\ArrayCollection();
    }

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

    public function getType()
    {
        return $this->type;
    }

    public function getGrades()
    {
        return $this->grades;
    }

    public function getValues()
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'type' => $this->type,
        ];
    }

    /**
     * Setters
     */

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

}
